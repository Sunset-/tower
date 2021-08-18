<template>
    <div>
        <div class="toolbar_page">
            <xui-filter ref="filter" style="margin-top: -18px;" :options="filterOptions" @filter="search">
            </xui-filter>
            <xui-toolbar style="padding-left:15px;" :options="toolbarOptions"></xui-toolbar>
            <div class="page_total" style="float:right;">
                共&nbsp;
                <span class="page_total_num number-small">{{totalNum}}</span>&nbsp;条
            </div>
        </div>
        <xui-table ref="transactionTable" :options="transactionTableOptions" @checked="tableChecked" @output="getTable"></xui-table>
        <xui-modal ref="modal" title="交易记录修正" width="800">
            <xui-form ref="form" :options="formOptions" @submit="save" @cancel="close"></xui-form>
        </xui-modal>
        <xui-modal ref="importModal" width="800" title="导入交易记录">
            <div>
                <xui-form ref="importForm" :options="importFormOptions" @modelchange="importFormChange"></xui-form>
            </div>
            <div style="text-align:center;padding:10px 0px;">
                <xui-file ref="uploader" :options="uploadOptions" :ctx="uploadModel" @success="uploadSuccess">
                </xui-file>
            </div>
        </xui-modal>
        <xui-modal ref="groupmodal" title="交易记录分组" width="800">
            <div style="height:500px;padding:10px;">
                <xui-toolbar style="padding-bottom:10px;" :options="groupToolOptions"></xui-toolbar>
                <xui-table ref="grouptable" :options="groupTableOptions" @checked="onTableChecked"></xui-table>
            </div>
        </xui-modal>
    </div>
</template>
<script>
import Store from "./store";
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const FileManage = $import("dag/modules/File");
const TransactionTemplate = $import("dag/modules/TransactionTemplate");

export default {
    props: {
        currentModel: {},
    },
    data() {
        return {
            totalNum: 0,
            checkedRecords: [],
            uploadModel: {},
            checkedAccounts: [],
            filterOptions: {
                fields: [
                    {
                        label: "状态",
                        name: "effective",
                        widget: "multiselect",
                        placeholder: "请选择状态",
                        changeFilter: true,
                        data: [
                            {
                                text: "正常",
                                value: "1",
                            },
                            {
                                text: "异常",
                                value: "2",
                            },
                            {
                                text: "无效",
                                value: "3",
                            },
                        ],
                    },
                ],
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "导入",
                        color: "primary",
                        operate: () => {
                            this.$refs.importModal.open();
                            this.$refs.importForm.reset();
                        },
                    },
                    {
                        label: "资金账号分组",
                        color: "primary",
                        operate: () => {
                            this.groupManage();
                        },
                    },
                    {
                        label: "批量删除",
                        color: "danger",
                        operate: () => {
                            this.batchDelete();
                        },
                    },
                ],
            },
            uploadOptions: {
                label: "上传",
                size: "small",
                color: "primary",
                multiple: true,
                directory: false,
                disabled: false,
                method: "post",
                filename: "file",
                thumbnail: true,
                wait: false,
                max: 10,
                drop: true,
                url: "/api/transaction/import",
                className: "my-uploader-trigger",
                filter(f) {
                    return true;
                },
                headers: {},
                formData: {
                    customerId: "",
                    templateId: "",
                    company: "",
                    sort: "",
                },
                singleSuccess: (res, b) => {
                    if (res && res.result && res.result.code != 200) {
                        $tip("导入异常：" + res.result.msg, "warning");
                    } else {
                        $tip("导入成功");
                        this.$refs.transactionTable.refresh();
                        this.$refs.importModal.close();
                    }
                    this.loading = false;
                },
                singleError: (res, b) => {
                    if (res && res.result && res.result.code != 200) {
                        $tip("导入异常：" + res.result.msg, "warning");
                    } else {
                        $tip("导入成功");
                        this.$refs.transactionTable.refresh();
                        this.$refs.importModal.close();
                    }
                },
                progress(v) {
                    console.log(v);
                },
            },
            importFormOptions: {
                cols: 2,
                fields: [
                    {
                        label: "识别模板",
                        widget: "cascader",
                        name: "templateId",
                        placeholder: "请选择识别模板",
                        spliter: ":",
                        root: "0",
                        level: false,
                        onlyLeaf: true,
                        premise() {
                            return false;
                        },
                        data: () => {
                            return TransactionTemplate.Query({
                                private: 1,
                                type: "TRANSACTION_TEMPLATE",
                            }).then((res) => {
                                var companys = {},
                                    versions = [];
                                res &&
                                    res.forEach((item) => {
                                        companys[item.name] = true;
                                        versions.push({
                                            text: item.category,
                                            value: item.id,
                                            parent: item.name,
                                        });
                                    });
                                var res = Object.keys(companys)
                                    .map((item) => ({
                                        parent: "0",
                                        text: item,
                                        value: item,
                                    }))
                                    .concat(versions);
                                return res;
                            });
                        },
                    },
                    {
                        label: "营业部名称",
                        widget: "input",
                        name: "company",
                        premise() {
                            return false;
                        },
                        placeholder: "请输入营业部名称",
                    },
                    {
                        label: "资金账号",
                        widget: "input",
                        name: "capitalAccount",
                        placeholder: "请输入资金账号",
                    },
                    {
                        label: "记录排序",
                        widget: "radio",
                        name: "sort",
                        default: "ASC",
                        data: [
                            {
                                text: "正序",
                                value: "ASC",
                            },
                            {
                                text: "倒序",
                                value: "DESC",
                            },
                        ],
                    },
                    {
                        label: "起始文件编号",
                        widget: "input",
                        name: "startNo",
                        default: "1",
                        placeholder: "请输入起始文件编号",
                    },
                ],
                toolbar: false,
            },
            transactionTableOptions: {
                checked: {
                    key: "id",
                },
                columns: [
                    {
                        title: "证券代码",
                        name: "securitiesCode",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "证券简称",
                        name: "securitiesComment",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "业务类别(识别)",
                        name: "businessCategory",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "交易类别",
                        name: "rawBusinessCategory",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "成交日期",
                        name: "transactionDate",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "成交价格",
                        name: "dealPrice",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col, true);
                        },
                    },
                    {
                        title: "成交数量",
                        name: "dealQuantity",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "成交金额",
                        name: "dealAmount",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col, true);
                        },
                    },
                    {
                        title: "印花税",
                        name: "stampDuty",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "库存数",
                        name: "stockNumber",
                        style: (v, record, col) => {
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            return this.cell(v, record, col);
                        },
                    },
                    {
                        title: "校验结果",
                        name: "validate",
                        style: (v, record, col) => {
                            if (record.$errors.validate) {
                                return "background:#ffa4a4;";
                            } else {
                                return "";
                            }
                            return this.cellStyle(v, record, col);
                        },
                        format: (v, record, col) => {
                            if (record.$errors.validate) {
                                return record.$errors.validate
                                    .split(";")
                                    .join("<br/>");
                            } else {
                                return "-";
                            }
                        },
                    },
                    {
                        title: "操作",
                        style: "width:180px;",
                        toolbar: {
                            size: "mini",
                            tools: [
                                {
                                    label: "原图",
                                    color: "primary",
                                    operate: (record) => {
                                        if (!record.fileId) {
                                            $tip("未关联文件");
                                            return;
                                        }
                                        FileManage.Get({
                                            id: record.fileId,
                                            cascade: "true",
                                        }).then((res) => {
                                            var opened = false;
                                            res &&
                                                res.forEach((item) => {
                                                    if (item.type == "IMAGE") {
                                                        this.$emit(
                                                            "view",
                                                            item,
                                                            [item]
                                                        );
                                                        opened = true;
                                                    }
                                                });
                                            if (!opened) {
                                                $tip("未关联文件");
                                            }
                                        });
                                    },
                                },
                                {
                                    label: "修正",
                                    color: "warning",
                                    operate: (record) => {
                                        this.edit(record);
                                    },
                                },
                            ],
                        },
                    },
                ],
                lazy: true,
                pageNumberStart: 0,
                pageSize: 15,
                format: {
                    list: "list",
                    count: "count",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.identCode = this.currentModel.id;
                    if (!filter.identCode) {
                        return { list: [], count: 0 };
                    }
                    return Store.listTransaction(filter);
                },
            },
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "证券代码",
                        name: "securitiesCode",
                        widget: "input",
                    },
                    {
                        label: "证券简称",
                        name: "securitiesComment",
                        widget: "input",
                    },
                    {
                        label: "业务类别",
                        name: "businessCategory",
                        widget: "input",
                    },
                    {
                        label: "成交日期",
                        name: "transactionDate",
                        widget: "input",
                    },
                    {
                        label: "成交价格",
                        name: "dealPrice",
                        widget: "input",
                    },
                    {
                        label: "成交数量",
                        name: "dealQuantity",
                        widget: "input",
                    },
                    {
                        label: "成交金额",
                        name: "dealAmount",
                        widget: "input",
                    },
                    {
                        label: "印花税",
                        name: "stampDuty",
                        widget: "input",
                    },
                ],
            },
            groupToolOptions: {
                tools: [
                    {
                        label: "合并",
                        color: "primary",
                        operate: () => {
                            var acs = JSON.parse(
                                JSON.stringify(this.checkedAccounts)
                            );
                            if (acs.length == 0) {
                                $tip("请选择资金账号");
                                return;
                            }
                            var acNames = acs.map(
                                (item) => item.capitalAccount
                            );
                            acNames.sort((a, b) => {
                                return a < b ? -1 : a > b ? 1 : 0;
                            });
                            acs.forEach((ac) => {
                                ac.group = acNames.join(",");
                            });
                            this.saveGroups(acs);
                        },
                    },
                    {
                        label: "拆分",
                        color: "primary",
                        operate: () => {
                            var acs = JSON.parse(
                                JSON.stringify(this.checkedAccounts)
                            );
                            if (acs.length == 0) {
                                $tip("请选择资金账号");
                                return;
                            }
                            acs.forEach((ac) => {
                                ac.group = ac.capitalAccount;
                            });
                            this.saveGroups(acs);
                        },
                    },
                ],
            },
            groupTableOptions: {
                checked: {
                    key: "capitalAccount",
                },
                columns: [
                    {
                        headAlign: "center",
                        title: "资金帐号",
                        name: "capitalAccount",
                    },
                    {
                        title: "分组",
                        name: "group",
                    },
                ],
                lazy: true,
                pageNumberStart: 0,
                pageSize: 100,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource() {
                    return [];
                },
            },
        };
    },
    watch: {
        currentModel(v) {
            if (v && v.id) {
                this.uploadOptions.formData.customerId = v.id;
                this.$refs.filter.reset();
            }
        },
    },
    methods: {
        search(filter) {
            this.$refs.transactionTable.search(filter);
        },
        cellStyle(v, record) {
            if (record.effective == 3) {
                return "background:#ababab;";
            }
            return "";
        },
        cell(v, record, col, isMoney) {
            if (isMoney) {
                v = v || 0;
                v = (Math.round(v * 100) / 100.0).toFixed(2);
            }
            if (record.effective == 3) {
                return v;
            }
            var style = "";
            if (record.$errors.hasOwnProperty(col.title)) {
                style = "background:#ffa4a4;";
            }
            var html = [
                `
            <div style="${style}">
                ${v}
            </div>
            `,
            ];
            if (record.$errors.hasOwnProperty(col.title)) {
                html.push(`
                    <div style="background:#cdcdcd;">
                    原值：${record.$errors[col.title]}
                    </div>
                `);
            }
            return html.join("");
        },
        getTable(data, num) {
            this.totalNum = num;
        },
        edit(record) {
            this.$refs.form.reset(record);
            this.$refs.modal.open();
        },
        save(record) {
            Store.correct(record).then(() => {
                this.$refs.transactionTable.refresh();
                $tip("修正成功", "success");
                this.$refs.modal.close();
            });
        },
        tableChecked(items) {
            this.checkedRecords = items || [];
        },
        batchDelete() {
            var ids = this.checkedRecords.map((item) => item.id);
            if (ids.length == 0) {
                $tip("请选择条目");
                return;
            }
            $confirm(`确定删除？`).then(() => {
                Store.removeTransactions(ids).then((res) => {
                    $tip("删除成功", "success");
                    this.$refs.transactionTable.refresh();
                });
            });
        },
        importFormChange() {
            var m = this.$refs.importForm.getModel();
            this.uploadOptions.formData.templateId = m.templateId || "";
            this.uploadOptions.formData.company = m.company || "";
            this.uploadOptions.formData.capitalAccount = m.capitalAccount || "";
            this.uploadOptions.formData.fileStart = m.startNo || "";
            this.uploadOptions.formData.sort = m.sort || "";
        },
        uploadSuccess() {
            this.$emit("refresh");
        },
        close() {
            this.$refs.modal.close();
        },
        groupManage() {
            Store.getGroups(this.currentModel.id).then((res) => {
                res &&
                    res.forEach((item) => {
                        if (item.group == "") {
                            item.group = item.capitalAccount;
                        }
                    });
                this.$refs.grouptable.setData(res);
                this.$refs.groupmodal.open();
            });
        },
        saveGroups(acs) {
            var saveGroups = [];
            var saveMap = {};
            var rawGroups = this.$refs.grouptable.getData();
            acs.forEach((ac) => {
                if (saveMap.hasOwnProperty(ac.capitalAccount)) {
                    return;
                }
                saveMap[ac.capitalAccount] = true;
                saveGroups.push(ac);
            });
            rawGroups.forEach((ac) => {
                if (saveMap.hasOwnProperty(ac.capitalAccount)) {
                    return;
                }
                saveMap[ac.capitalAccount] = true;
                saveGroups.push(ac);
            });
            Store.saveGroups(saveGroups, this.currentModel.id).then((res) => {
                this.$refs.groupmodal.close();
                $tip("保存成功", "success");
            });
        },
        onTableChecked(acs) {
            this.checkedAccounts = acs;
        },
    },
};
</script>
<style>
</style>