<template>
    <div style="padding:10px;">
        <xui-toolbar :options="toolbarOptions" style="padding-bottom:10px;"></xui-toolbar>
        <xui-table ref="table" :options="orderTableOptions"></xui-table>
        <xui-modal ref="detail" width="800" title="订单信息">
            <xui-form ref="form" :options="formOptions" @submit="save" @cancel="cancel"></xui-form>
        </xui-modal>
        <xui-modal ref="plaintModal" width="1600" title="生成诉状" :maskClose="false">
            <div style="position:relative;height:650px;">
                <div style="position:absolute;top:0px;left:0px;right:700px;bottom:0px;">
                    <xui-tabs :options="tcTabOptions" v-model="tcCapitalAccount"></xui-tabs>
                    <calculate-result ref="plaintcalculateresult"></calculate-result>
                </div>
                <div style="position:absolute;top:0px;right:0px;width:700px;bottom:0px;border-left:1px solid #dedede;">
                    <xui-form ref="plaintForm" class="plaintForm" :options="plaintFormOptions" @submit="generatePlaint" @cancel="cancelPlaint"></xui-form>
                </div>
            </div>
        </xui-modal>
        <xui-modal ref="calculatemodal" title="损失计算结果" width="1000">
            <calculate-result ref="calculateresult"></calculate-result>
        </xui-modal>
        <xui-modal ref="linkmodal" width="500" title="关联云订单">
            <xui-form ref="linkForm" :options="linkFormOptions" @submit="linkWechatOrder" @cancel="cancelLink"></xui-form>
        </xui-modal>
    </div>
</template>
<script>
import Store from "./store";
import CalculateResult from "./calculateresult";

const ProductManage = $import("dag/modules/Product");
const WechartOrderManage = $import("dag/modules/WechatOrder");
const $tip = $import("dag/common/tip");
const $tools = $import("dag/common/tools");
const $confirm = $import("dag/common/confirm");

export default {
    components: {
        CalculateResult,
    },
    props: {
        customer: {},
    },
    data() {
        return {
            tcs: [],
            tcTabOptions: {
                data: [],
            },
            tcCapitalAccount: "",
            toolbarOptions: {
                tools: [
                    {
                        label: "新增",
                        color: "primary",
                        operate: () => {
                            this.edit();
                        },
                    },
                    {
                        label: "重新计算",
                        color: "primary",
                        operate: () => {
                            Store.reCalculate([this.customer.id]).then(
                                (res) => {
                                    $tip("计算完成", "success");
                                    this.$refs.table.refresh();
                                }
                            );
                        },
                    },
                ],
            },
            linkFormOptions: {
                cols: 1,
                fields: [
                    {
                        label: "云订单",
                        name: "wechatOrderIdNo",
                        widget: "select",
                        style: "width:300px;",
                        filter: true,
                        data: [],
                        watch: [
                            "identCode",
                            (model, options) => {
                                return WechartOrderManage.Query({
                                    identCode: model.identCode,
                                }).then((res) => {
                                    options.data = res.list.map((item) => ({
                                        text: `${item.orderNo}_${item.name}`,
                                        value: item.id + ":" + item.orderNo,
                                    }));
                                });
                            },
                        ],
                    },
                ],
                cast(model) {
                    model.wechatOrderIdNo = `${model.wechatOrderId}:${model.wechatOrderNo}`;
                },
                format(model) {
                    if (model.wechatOrderIdNo) {
                        var s = model.wechatOrderIdNo.split(":");
                        model.wechatOrderId = s[0];
                        model.wechatOrderNo = s[1];
                    }
                },
            },
            orderTableOptions: {
                columns: [
                    { title: "股票代码", name: "product.code" },
                    { title: "产品名称", name: "product.name" },
                    { title: "签约主体", name: "contractSubject" },
                    { title: "第一责任人", name: "primaryPerson" },
                    { title: "收费比例", name: "chargeRatio" },
                    { title: "实施日库存", name: "implementationDateStock" },
                    { title: "净买入", name: "beforeHold" },
                    { title: "剩余持有", name: "afterHold" },
                    {
                        title: "基准日前亏损",
                        name: "beforeLoss",
                        format(v) {
                            return (+v).toFixed(2);
                        },
                    },
                    {
                        title: "基准日后亏损",
                        name: "afterLoss",
                        format(v) {
                            return (+v).toFixed(2);
                        },
                    },
                    {
                        title: "合计损失",
                        name: "totalLoss",
                        format(v) {
                            return (+v).toFixed(2);
                        },
                    },
                    {
                        title: "损失备注",
                        name: "calculateResult",
                        style(v) {
                            return v == "3" ? "color:green;" : "";
                        },
                        enum: "ORDER_CALCULATE_RESULT",
                    },
                    {
                        title: "云订单",
                        name: "wechatOrderNo",
                        align: "center",
                        format(v) {
                            return v || "-";
                        },
                    },
                    {
                        title: "操作",
                        style: "width:280px;",
                        toolbar: [
                            {
                                label: "编辑",
                                size: "mini",
                                operate: (record) => {
                                    this.edit(record);
                                },
                            },
                            {
                                label: "关联云订单",
                                size: "mini",
                                operate: (record) => {
                                    this.$refs.linkmodal.open();
                                    this.$refs.linkForm.reset({
                                        id: record.id,
                                        customerId: this.customer.id,
                                        identCode: this.customer.identCode,
                                        wechatOrderId: record.wechatOrderId,
                                        wechatOrderNo: record.wechatOrderNo,
                                    });
                                },
                            },
                            // {
                            //     label: "计算损失",
                            //     size: "mini",
                            //     operate: (record) => {
                            //         this.$refs.calculatemodal.open();
                            //         this.$refs.calculateresult.open(record.id);
                            //     },
                            // },
                            {
                                label: "生成诉状",
                                size: "mini",
                                operate: (record) => {
                                    this.openGeneratePlaint(record);
                                },
                            },
                            {
                                label: "删除",
                                size: "mini",
                                color: "danger",
                                operate: (record) => {
                                    this.remove(record);
                                },
                            },
                        ],
                    },
                ],
                lazy: true,
                pageNumberStart: 0,
                pageSize: 15,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    return Store.listOrder(filter);
                },
            },
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "产品",
                        name: "productKey",
                        widget: "select",
                        placeholder: "请选择产品",
                        data: () => {
                            return ProductManage.GetProducts().then((res) => {
                                return (
                                    (res &&
                                        res.list.map((item) => ({
                                            text: `${item.code}_${item.name}`,
                                            value: `${item.id}$$$${item.code}$$$${item.name}`,
                                        }))) ||
                                    []
                                );
                            });
                        },
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "签约实体",
                        name: "contractSubject",
                        widget: "input",
                        placeholder: "请输入签约实体",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "第一责任人",
                        name: "primaryPerson",
                        widget: "input",
                        placeholder: "请输入第一责任人",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "订单费率",
                        name: "chargeRatio",
                        widget: "input",
                        placeholder: "请输入订单费率",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "实施日库存",
                        name: "implementationDateStock",
                        widget: "input",
                        placeholder: "请输入实施日库存",
                        validate: {
                            required: true,
                            integer: true,
                        },
                    },
                    {
                        label: "状态",
                        name: "status",
                        widget: "select",
                        data: [
                            {
                                text: "正常",
                                value: "1",
                            },
                            {
                                text: "异常",
                                value: "2",
                            },
                        ],
                        defaultFirst: true,
                        placeholder: "请选择状态",
                        validate: {
                            required: true,
                        },
                    },
                ],
                cast(model) {
                    if (model.productId) {
                        model.productKey = `${model.productId}$$$${model.productCode}$$$${model.productName}`;
                    }
                },
                format: (model) => {
                    model.customerId = this.customer.id;
                    if (model.productKey) {
                        var temp = model.productKey.split("$$$");
                        model.productId = temp[0] || "";
                        model.productCode = temp[1] || "";
                        model.productName = temp[2] || "";
                    }
                },
            },
            plaintFormOptions: {
                cols: 2,
                fields: [
                    {
                        group: "亏损详情",
                        label: "开始日期",
                        name: "startDate",
                        widget: "input",
                        placeholder: "请输入开始日期",
                    },
                    {
                        label: "结束日期",
                        name: "endDate",
                        widget: "input",
                        placeholder: "请输入结束日期",
                    },
                    {
                        label: "买入均价",
                        name: "buyMeanPrice",
                        append: "元",
                        widget: "input",
                        placeholder: "请输入买入均价",
                    },
                    {
                        label: "买入股数",
                        name: "buyCount",
                        widget: "input",
                        placeholder: "请输入买入股数",
                    },
                    {
                        label: "前卖出股数",
                        name: "beforeSaleCount",
                        widget: "input",
                        placeholder: "请输入卖出股数",
                    },
                    {
                        label: "后卖出均价",
                        name: "afterSalteMeanPrice",
                        widget: "input",
                        placeholder: "请输入卖出股数",
                    },
                    {
                        label: "后卖出股数",
                        name: "afterSaleCount",
                        widget: "input",
                        placeholder: "请输入卖出股数",
                    },
                    {
                        label: "赔偿投资差额",
                        name: "investmentBalance",
                        widget: "input",
                        placeholder: "请输入赔偿投资差额",
                        append: "元",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "印花税",
                        name: "stampDuty",
                        widget: "input",
                        placeholder: "请输入印花税",
                        append: "元",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "佣金",
                        name: "commission",
                        widget: "input",
                        placeholder: "请输入佣金",
                        append: "元",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "资金利息",
                        name: "capitalInterest",
                        widget: "input",
                        placeholder: "请输入资金利息",
                        append: "元",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "合计",
                        name: "totalAmount",
                        widget: "input",
                        placeholder: "请输入合计",
                        append: "元",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        group: "诉讼信息",
                        label: "法院",
                        name: "court",
                        widget: "input",
                        placeholder: "请输入法院名称",
                    },
                    {
                        label: "日期",
                        name: "lawsuitDate",
                        widget: "input",
                        placeholder: "请输入日期",
                    },
                ],
            },
        };
    },
    watch: {
        customer() {
            this.refresh();
        },
        tcCapitalAccount(v) {
            this.showTransactionCalculate(v);
        },
    },
    methods: {
        refresh() {
            if (this.customer && this.customer.id) {
                this.$refs.table.search({ customerId: this.customer.id });
            } else {
                this.$refs.table.clear();
            }
        },
        edit(model) {
            this.$refs.detail.open();
            this.$refs.form.reset(model);
        },
        // 添加或者编辑确认保存
        save(model) {
            Store.saveOrder(model).then(() => {
                //关闭窗口
                this.$refs.detail.close();
                //刷新表格
                this.$refs.table.refresh();
                $tip("保存成功", "success");
            });
        },
        remove(data) {
            $confirm(`确定删除？`).then(() => {
                Store.removeOrder(data.id).then((res) => {
                    $tip("删除成功", "success");
                    this.refresh();
                });
            });
        },
        cancel() {
            this.$refs.detail.close();
        },
        openGeneratePlaint(record) {
            Store.CalculateTransaction(record.id).then((res) => {
                if (!res || res.length == 0) {
                    this.$refs.plaintForm.reset({
                        customerId: record.customerId,
                        productId: record.productId,
                    });
                    return;
                }
                this.tcTabOptions.data = res.map((tc) => ({
                    text: tc.capitalAccountGroup || "未设定",
                    value: tc.capitalAccountGroup,
                }));
                var model = {
                    customerId: record.customerId,
                    productId: record.productId,
                    court: record.product.court,
                };
                var beforeBuyStartDate = res[0].beforeBuyStartDate;
                var beforeBuyEndDate = res[0].beforeBuyEndDate;
                var beforeBuyAveragePrice =
                    res.length == 1
                        ? (+res[0].beforeBuyAveragePrice).toFixed(2)
                        : "";
                var beforeBuyNum = 0;
                var beforeSaleNum = 0;
                var afterSaleAveragePrice =
                    res.length == 1
                        ? (+res[0].afterSaleAveragePrice).toFixed(2)
                        : "";
                var afterSaleNum = 0;
                var investmentLoss = 0;
                var stampDuty = 0;
                var commission = 0;
                var interest = 0;
                var totalLoss = 0;
                res.forEach((tc) => {
                    if (tc.beforeBuyStartDate < beforeBuyStartDate) {
                        beforeBuyStartDate = tc.beforeBuyStartDate;
                    }
                    if (tc.beforeBuyEndDate > beforeBuyEndDate) {
                        beforeBuyEndDate = tc.beforeBuyEndDate;
                    }
                    beforeBuyNum += tc.beforeBuyNum;
                    beforeSaleNum += tc.beforeSaleNum;
                    afterSaleNum += tc.afterSaleNum;
                    investmentLoss += tc.investmentLoss;
                    stampDuty += tc.stampDuty;
                    commission += tc.commission;
                    interest += tc.interest;
                    totalLoss += tc.totalLoss;
                });
                model.startDate = this.formatDate(beforeBuyStartDate);
                model.endDate = this.formatDate(beforeBuyEndDate);
                model.buyMeanPrice = (+beforeBuyAveragePrice).toFixed(2);
                model.buyCount = beforeBuyNum;
                model.beforeSaleCount = beforeSaleNum;
                model.afterSalteMeanPrice = (+afterSaleAveragePrice).toFixed(2);
                model.afterSaleCount = afterSaleNum;
                model.investmentBalance = (+investmentLoss).toFixed(2);
                model.stampDuty = (+stampDuty).toFixed(2);
                model.commission = (+commission).toFixed(2);
                model.capitalInterest = (+interest).toFixed(2);
                model.totalAmount = (+totalLoss).toFixed(2);
                this.$refs.plaintForm.reset(model);
                this.tcs = res;

                this.$refs.plaintModal.open();
                this.$nextTick(() => {
                    this.tcCapitalAccount = this.tcTabOptions.data[0]
                        ? this.tcTabOptions.data[0].value
                        : "";
                    this.showTransactionCalculate(this.tcCapitalAccount);
                });
            });
        },
        showTransactionCalculate(v) {
            for (var i = 0; i < this.tcs.length; i++) {
                if (this.tcs[i].capitalAccountGroup == v) {
                    this.$refs.plaintcalculateresult.openCalculateResult(
                        this.tcs[i]
                    );
                    return;
                }
            }
        },
        onCalculateLoad(tc) {
            var model = this.$refs.plaintForm.getModel();
            model.startDate = this.formatDate(tc.beforeBuyStartDate);
            model.endDate = this.formatDate(tc.beforeBuyEndDate);
            model.buyMeanPrice = (+tc.beforeBuyAveragePrice).toFixed(2);
            model.buyCount = tc.beforeBuyNum;
            model.beforeSaleCount = tc.beforeSaleNum;
            model.afterSalteMeanPrice = (+tc.afterSaleAveragePrice).toFixed(2);
            model.afterSaleCount = tc.afterSaleNum;
            model.investmentBalance = (+tc.investmentLoss).toFixed(2);
            model.stampDuty = (+tc.stampDuty).toFixed(2);
            model.commission = (+tc.commission).toFixed(2);
            model.capitalInterest = (+tc.interest).toFixed(2);
            model.totalAmount = (+tc.totalLoss).toFixed(2);
            model.court = tc.product.court;
            this.$refs.plaintForm.reset(model);
        },
        formatDate(v) {
            v = `${v}`;
            if (v.length != 8) {
                return v;
            }
            return `${v.substring(0, 4)}年${v.substring(4, 6)}月${v.substring(
                6,
                8
            )}日`;
        },
        cancelPlaint() {
            this.$refs.plaintModal.close();
        },
        generatePlaint(record) {
            Store.generatePlaint(record).then(() => {
                $tip("生成成功", "success");
                this.$emit("refresh");
                this.cancelPlaint();
            });
        },
        linkWechatOrder(model) {
            Store.linkWechatOrder(model).then(() => {
                this.$refs.linkmodal.close();
                this.$refs.table.refresh();
                $tip("关联成功", "success");
            });
        },
        cancelLink() {
            this.$refs.linkmodal.close();
        },
    },
};
</script>
<style lang="less">
.plaintForm.xui-form.xui-form-style {
    .xui-input.xui-input-style {
        width: 200px;
    }
    .xui-toolbar.xui-toolbar-style {
        text-align: center;
        padding-top: 20px;
    }
}
</style>