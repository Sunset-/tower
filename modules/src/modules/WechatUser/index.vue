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
        <!-- 接入配置 -->
        <product-detail v-show="page=='DETAIL'" ref="detail" @refresh="refresh"></product-detail>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");

import ProductDetail from "./detail.vue";

import Store from "./store";

export default {
    components: {
        ProductDetail,
    },
    data() {
        return {
            page: "LIST",
            path: [
                {
                    title: "产品列表",
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
                        style: "width:60px;",
                    },
                    {
                        title: "真实姓名",
                        name: "name",
                        align: "center",
                    },
                    {
                        title: "身份证号",
                        name: "identCode",
                        align: "center",
                    },
                    {
                        title: "手机号",
                        name: "phone",
                        align: "center",
                    },
                    {
                        title: "注册时间",
                        name: "creatTime",
                        format: "DATETIME",
                    },
                ],
                lazy: true,
                pageNumberStart: 0,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "list",
                    count: "count",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    return Store.list(filter);
                },
            },
            totalNum: 0,
        };
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
    },
    methods: {
        edit(model) {
            Store.get(model.id).then((res) => {
                this.page = "DETAIL";
                this.$refs.detail.open(res);
            });
        },
        // 搜索
        search(filter) {
            this.$refs.table.search(filter);
        },
        refresh() {
            this.page = "LIST";
            this.$refs.table.refresh();
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
        getTable(data, num) {
            this.totalNum = num;
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