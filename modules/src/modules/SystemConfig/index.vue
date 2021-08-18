<template>
    <div class="MODULE-CONTAINER" style="top:10px;">
        <div class="Equipment-params">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions">
            </xui-tabs>
            <div class="Equipment-params-major">
                <config-password v-show="currentTab=='PASSWORD'" :user="currentUser"></config-password>
                <config-wechat v-show="currentTab=='WECHAT'" :user="currentUser"></config-wechat>
                <config-mail v-show="currentTab=='MAIL'" :user="currentUser"></config-mail>
                <config-phone v-show="currentTab=='PHONE'" :user="currentUser"></config-phone>
                <!-- <config-logo v-show="currentTab=='LOGO'" :user="currentUser" @refreshlogo="refreshlogo"></config-logo> -->
            </div>
        </div>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");

import configPassword from "./config/password.vue";
import configMail from "./config/mail.vue";
import configPhone from "./config/phone.vue";
import configWechat from "./config/wechat.vue";
import configLogo from "./config/logo.vue";

import Store from "./store";

export default {
    components: {
        configPassword,
        configMail,
        configPhone,
        configWechat,
        configLogo,
    },
    data() {
        return {
            currentTab: "PASSWORD",
            currentUser : $business.getCurrentUser(),
            tabOptions: {
                data: [
                    {
                        text: "修改密码",
                        value: "PASSWORD",
                    },
                    {
                        text: "微信绑定",
                        value: "WECHAT",
                    },
                    {
                        text: "修改邮箱",
                        value: "MAIL",
                    },
                    {
                        text: "修改手机号码",
                        value: "PHONE",
                    },
                    // {
                    //     text: "登陆特性",
                    //     value: "LOGO",
                    // },
                ],
            },
            loading: false,
            toolbarOptions: {
                tools: [
                    {
                        label: "新增",
                        icon: "iconfont iconxinzeng",
                        color: "primary",
                        operate: () => {
                            this.edit();
                        },
                    },
                ],
            },
            tableOptions: {
                columns: [
                    {
                        title: "序号",
                        name: "index",
                        style: "text-align:center;max-width:50px",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                        style: "width:100px;",
                    },
                    {
                        title: "配置名称",
                        name: "name",
                        align: "center",
                        style: "width:300px;",
                    },
                    {
                        title: "操作",
                        toolbar: [
                            {
                                label: "编辑",
                                size: "mini",
                                operate: (record) => {
                                    this.edit(record);
                                },
                            },
                        ],
                    },
                ],
                lazy: false,
                pageNumberStart: 0,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    return Store.list(filter);
                },
            },
            totalNum: 0,
            transactionRelDetailFormOptions: {
                fields: [
                    {
                        name: "value",
                        widget: "edittable",
                        removeable: false,
                        showNumber: false,
                        add: false,
                        cols: [
                            {
                                title: "名称",
                                name: "key",
                            },
                            {
                                title: "别名",
                                name: "alias",
                                widget: "input",
                                style: "width:500px;",
                                placeholder: "请输入别名,逗号分隔",
                            },
                            {
                                title: "校验规则",
                                name: "validator",
                                widget: "input",
                                placeholder: "请输入校验规则（正则）",
                            },
                        ],
                        placeholder: "请输入合计欠款",
                    },
                ],
                cast(model) {
                    var allKeys = [
                        "客户号",
                        "证券代码",
                        "证券简称",
                        "成交日期",
                        "业务类别",
                        "成交价格",
                        "成交数量",
                        "成交金额",
                        "库存数",
                        "印花税",
                    ];
                    var rules = [];
                    var ruleMap = {};
                    try {
                        ruleMap = JSON.parse(model.value).reduce(
                            (res, item) => {
                                res[item.key] = item;
                                return res;
                            },
                            {}
                        );
                    } catch (e) {
                        console.log(e);
                        ruleMap = {};
                    }
                    allKeys.forEach((k) => {
                        if (ruleMap[k]) {
                            rules.push(ruleMap[k]);
                        } else {
                            rules.push({
                                key: k,
                                alias: "",
                                match: "",
                                validator: "",
                            });
                        }
                    });
                    model.value = JSON.stringify(rules);
                    return model;
                },
            },
            transactionCategoryFormOptions: {
                fields: [
                    {
                        name: "value",
                        widget: "edittable",
                        removeable: true,
                        showNumber: false,
                        add: true,
                        addTemplate() {
                            return {
                                category: "买入",
                                checkAmount: true,
                                checkStampDuty: true,
                            };
                        },
                        cols: [
                            {
                                title: "关键字",
                                name: "keyword",
                                widget: "input",
                                placeholder: "请输入关键字",
                                colStyle: "width:300px",
                            },
                            {
                                title: "交易类别",
                                name: "category",
                                widget: "radio",
                                colStyle: "width:160px",
                                data: [
                                    {
                                        text: "买入",
                                        value: "买入",
                                    },
                                    {
                                        text: "卖出",
                                        value: "卖出",
                                    },
                                ],
                            },
                            {
                                title: "校验金额",
                                name: "checkAmount",
                                widget: "checkbox",
                                colStyle: "width:85px",
                            },
                            {
                                title: "校验印花税",
                                name: "checkStampDuty",
                                widget: "checkbox",
                                colStyle: "width:85px",
                            },
                        ],
                    },
                ],
                cast(model) {
                    return model;
                },
            },
        };
    },
    watch : {
        currentTab(){
            this.currentUser = JSON.parse(JSON.stringify($business.getCurrentUser()||{}));
        }
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
    },
    methods: {
        edit(model) {
            if (model.id == "CONFIG_TRANSACTION_KEYS") {
                this.$refs.transactionRelDetail.open();
                this.$refs.transactionRelForm.reset(model);
            } else if (model.id == "CONFIG_TRANSACTION_CATEGORY") {
                this.$refs.transactionCategoryModal.open();
                this.$refs.transactionCategoryForm.reset(model);
            }
        },
        // 搜索
        search(filter) {
            this.$refs.table.search(filter);
        },
        refresh() {
            this.page = "LIST";
            this.$refs.table.refresh();
        },
        // 添加或者编辑确认保存
        save(model) {
            Store.save(model).then(() => {
                //关闭窗口
                this.$refs.transactionRelDetail.close();
                this.$refs.transactionCategoryModal.close();
                //刷新表格
                this.$refs.table.refresh();
                $tip("保存成功", "success");
            });
        },
        // 删除
        remove(data) {
            $confirm(`确定删除？`).then(() => {
                Store.remove(data.id).then((res) => {
                    $tip("删除成功", "success");
                    this.refresh();
                });
            });
        },
        // 导出
        export(template, record) {
            Store.export(template, record).then((res) => {
                $tools.downloadFile(
                    `${templateName[template]}-${record.msssz_b01}.doc`,
                    res
                );
            });
        },
        getTable(data, num) {
            this.totalNum = num;
        },
        cancel() {
            this.$refs.transactionRelDetail.close();
            this.$refs.transactionCategoryModal.close();
        },
        refreshlogo(){
            this.$emit("refreshlogo")
        }
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-SystenConfig {
    .xui-datapage.xui-datapage-style .xui-datapage-footer {
        position: relative;
        bottom: 0;
    }
    .customer-image-info {
        text-align: left;
        p {
            display: inline-block;
            padding: 0px 5px;
        }
    }
}
.transactionRelForm.xui-form > .form-row {
    height: 400px;
    overflow: auto;
}
.transactionCategoryForm.xui-form > .form-row {
    height: 400px;
    overflow: auto;
}
</style>