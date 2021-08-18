<template>
    <div class="MODULE-CONTAINER MODULE-Company">
        <div class="MODULE-MAJOR-CONTENT" v-show="page=='LIST'">
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH">
                <xui-filter class="title_filter" ref="filter" :options="filterOptions" @filter="searchDebounce">
                </xui-filter>
            </div>
            <div class="PANEL">
                <div class="PANEL-BUTTON">
                    <div class="toolbar_page">
                        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
                        <div class="page_total">
                            共&nbsp;
                            <span class="page_total_num number-small">{{totalNum}}</span>&nbsp;条
                        </div>
                    </div>
                </div>
                <xui-scroll class="PANEL-TABLE">
                    <div class="PANEL-BUTTON-CONTAINER">
                        <xui-table ref="table" :options="tableOptions" @checked="tableChecked" @output="getTable">
                            <div slot="empty" style="padding:30px 0px;text-align:center;">无数据</div>
                        </xui-table>
                    </div>
                </xui-scroll>
            </div>
        </div>
        <xui-modal ref="transactionRelDetail" width="900" title="交易记录识别映射">
            <xui-form ref="transactionRelForm" class="transactionRelForm" :options="transactionRelDetailFormOptions" @submit="save" @cancel="cancel"></xui-form>
        </xui-modal>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");

const CONFIG_TYPE = "TRANSACTION_TEMPLATE";

import Store from "./store";

export default {
    data() {
        return {
            page: "LIST",
            path: [
                {
                    title: "客户文书",
                    name: "AccessManage",
                },
            ],
            loading: false,
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        // label: "请选择节点",
                        name: "keyword",
                        widget: "input",
                        placeholder: "请输入关键字",
                        manner: "search",
                        changeFilter: true,
                    },
                ],
            },
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
                        align: "center",
                        style: "width:50px;",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                    },
                    {
                        title: "营业部名称",
                        name: "name",
                        align: "center",
                    },
                    {
                        title: "模板文件",
                        name: "category",
                        align: "center",
                        style: "width:300px;",
                    },
                    {
                        title: "操作",
                        style: "width:140px;",
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
                pageSize: 9999,
                localPageSize: 10,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.private = 1;
                    filter.type = CONFIG_TYPE;
                    return Store.list(filter);
                },
            },
            totalNum: 0,
            transactionRelDetailFormOptions: {
                fields: [
                    {
                        label: "营业部名称",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入营业部名称",
                    },
                    {
                        label: "模板文件",
                        name: "category",
                        widget: "input",
                        placeholder: "请输入模板文件",
                    },
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
                                title: "列号",
                                name: "order",
                                widget: "input",
                                placeholder: "请输入列号,从1开始",
                            },
                            {
                                title: "匹配规则",
                                name: "match",
                                widget: "input",
                                placeholder: "请输入值匹配规则",
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
        };
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
    },
    methods: {
        edit(model) {
            this.$refs.transactionRelDetail.open();
            this.$refs.transactionRelForm.reset(
                model || {
                    private: 1,
                    type: CONFIG_TYPE,
                }
            );
        },
        // 搜索
        
        // 搜索
        searchDebounce(filter) {
            if (this.searchDebounceTimer !== null) {
                clearTimeout(this.searchDebounceTimer);
            }
            this.searchDebounceTimer = setTimeout(() => {
                this.search(filter);
            }, 300);
        },
        search(filter) {
            this.$refs.table.search(filter);
        },
        refresh() {
            this.page = "LIST";
            this.$refs.table.refresh();
        },
        // 添加或者编辑确认保存
        save(model) {
            model.id =
                model.id ||
                $tools.md5(
                    model.type + "_" + model.name + "_" + model.category
                );
            Store.save(model).then(() => {
                //关闭窗口
                this.$refs.transactionRelDetail.close();
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
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-Company {
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
</style>