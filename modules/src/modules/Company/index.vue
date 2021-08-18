<template>
    <div class="MODULE-CONTAINER MODULE-Company">
        <div class="MODULE-MAJOR-CONTENT" v-show="page=='LIST'">
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH">
                <xui-filter class="title_filter" ref="filter" :options="filterOptions" @filter="search"></xui-filter>
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
                        <xui-table ref="table" :options="tableOptions" @output="getTable">
                            <div slot="empty" style="padding:30px 0px;text-align:center;">无数据</div>
                        </xui-table>
                    </div>
                </xui-scroll>
            </div>
        </div>
        <xui-modal ref="detail" width="900" title="证券公司信息">
            <xui-form ref="form" :options="formOptions" @submit="save" @cancel="cancel"></xui-form>
        </xui-modal>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");

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
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
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
                        style: "text-align:center;max-width:50px",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                        style: "width:100px;",
                    },
                    {
                        title: "证券公司名称",
                        name: "name",
                        align: "center",
                        style: "width:300px;",
                    },
                    {
                        title: "营业部",
                        name: "offices",
                        align: "left",
                        innerStyle: "white-space: normal;",
                        format(v) {
                            v = v || [];
                            return v
                                .map((sub) => {
                                    return `<span>${sub.name}</span>`;
                                })
                                .join(",");
                        },
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
            formOptions: {
                fields: [
                    {
                        label: "证券公司名称",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入证券公司名称",
                    },
                    {
                        label: "营业部",
                        name: "offices",
                        widget: "edittable",
                        fieldClass: "company-edit-table",
                        monopolize: true,
                        cols: [
                            {
                                title: "营业部名称",
                                name: "name",
                                widget: "input",
                                placeholder: "请输入营业部名称",
                            },
                        ],
                    },
                ],
                cast(model) {
                    if (model.offices) {
                        model.offices = JSON.stringify(model.offices);
                    }
                },
                format(model) {
                    if (model.offices) {
                        model.offices = JSON.parse(model.offices);
                        model.offices = model.offices.filter(
                            (item) => item.name && item.name.trim().length > 0
                        );
                    }
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
            this.$refs.detail.open();
            this.$refs.form.reset(model);
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
                this.$refs.detail.close();
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
            this.$refs.detail.close();
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
.xui-form .xui-form-field.company-edit-table {
    .xui-field-label {
        vertical-align: top;
        padding-top: 26px;
    }
    .xui-field-widget {
        overflow-y: auto;
        height: 300px;
        width: 100%;
        display: inline-block;
        vertical-align: top;
        table {
            width: 700px;
        }
    }
}
</style>