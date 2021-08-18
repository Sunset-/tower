<template>
    <div class="MODULE-CONTAINER MODULE-EquipmentGroup">
        <div class="MODULE-MAJOR-CONTENT" v-show="page=='LIST'">
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH-TOOLBAR">
                <xui-filter ref="filter" :options="filterOptions" @filter="search"></xui-filter>
                <xui-toolbar class="RIGHT-TOOLBAR" :options="toolbarOptions"></xui-toolbar>
            </div>
            <xui-scroll class="PANEL-TABLE">
                <div class="PANEL-BUTTON-CONTAINER" @click="tableClick">
                    <xui-table ref="table" :options="tableOptions" @output="getTable">
                        <div slot="empty" style="padding:30px 0px;text-align:center;">无数据</div>
                    </xui-table>
                </div>
            </xui-scroll>
        </div>
        <!-- 详情 -->
        <equipmentgroup-detail ref="detail" @refresh="refresh"></equipmentgroup-detail>
        <!-- 设备参数 -->
        <equipmentgroup-eqs ref="eqs" @refresh="refresh"></equipmentgroup-eqs>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");

import EquipmentgroupDetail from "./detail.vue";
import EquipmentgroupEqs from "./eqs.vue";

import Store from "./store";

export default {
    components: {
        EquipmentgroupDetail,
        EquipmentgroupEqs,
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
                        name: "groupName",
                        widget: "input",
                        placeholder: "请输入项目名称",
                        manner: "search",
                    },
                ],
                searchButton: {
                    color: "primary",
                    icon: "xui-icon xui-icon-search",
                    label: "搜索",
                },
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "新增",
                        icon: "iconfont iconxinzeng",
                        permission : "EquipmentGroup_Add",
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
                        title: "项目名称",
                        name: "groupName",
                        align: "center",
                    },
                    {
                        title: "项目地址",
                        name: "deviceType",
                        align: "center",
                    },
                    {
                        title: "设备数",
                        name: "deviceCount",
                        format(v, record) {
                            if(v==0){
                                return v;
                            }
                            return `<div class="equipment-group-num" data-id="${record.groupId}"  style="color:#1872fe;cursor:pointer;">${v}</div>`;
                        },
                    },
                    {
                        title: "在线设备数",
                        name: "onlineDeviceCount",
                        format(v, record) {
                            if(v==0){
                                return v;
                            }
                            return `<div class="equipment-group-num" data-id="${record.groupId}"  style="color:#1872fe;cursor:pointer;">${v}</div>`;
                        },
                    },
                    {
                        title: "产权单位",
                        name: "ownerUnit",
                        align: "center",
                    },
                    {
                        title: "产权单位联系人",
                        name: "contacts",
                        align: "center",
                    },
                    {
                        title: "操作",
                        style: "width:220px;",
                        toolbar: [
                            {
                                label: "查看",
                                size: "mini",
                                color: "primary-text",
                                permission : "EquipmentGroup_Modify",
                                operate: (record) => {
                                    this.edit(record);
                                },
                            },
                            {
                                label: "编辑",
                                size: "mini",
                                color: "primary-text",
                                permission : "EquipmentGroup_Modify",
                                operate: (record) => {
                                    this.edit(record);
                                },
                            },
                            {
                                label: "设备参数列表",
                                size: "mini",
                                color: "warning-text",
                                permission : "EquipmentGroup_Modify",
                                operate: (record) => {
                                    this.$refs.eqs.open(record);
                                },
                            },
                            {
                                label: "删除",
                                size: "mini",
                                color: "danger-text",
                                permission : "EquipmentGroup_History",
                                operate: (record) => {
                                    this.history(record);
                                },
                            },
                        ],
                    },
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "list",
                    count: "total",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.userId = $business.getCurrentUser()&&$business.getCurrentUser().userId;
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
        tableClick(event) {
            var target = event.target;
            if (target.className == "equipment-group-num") {
                var groupId = target.dataset.id;
                this.$router.push({
                    name : "Equipment",
                    query : {
                        groupId : groupId
                    }
                })
            }
        },
        edit(model) {
            this.$refs.detail.open(model);
        },
        // 搜索
        search(filter) {
            this.$refs.table.search(filter);
        },
        refresh() {
            this.page = "LIST";
            this.$refs.table.refresh();
        },
        history(record) {
            this.$refs.history.open({
                ownerId: record.groupId,
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
        getTable(data, num) {
            this.totalNum = num;
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-EquipmentGroup {
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