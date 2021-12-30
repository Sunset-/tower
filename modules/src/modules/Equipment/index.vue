<template>
    <div class="MODULE-CONTAINER MODULE-Equipment">
        <div class="MODULE-LEFT-SIDE">
            <xui-filter class="left_filter" ref="treeFilter" :options="treeFilterOptions" @filter="searchTree">
            </xui-filter>
            <div class="left-tree-container">
                <dag-tree ref="tree" :options="equipmentTree" @inited="treeInited" @selected="onSelected"></dag-tree>
            </div>
        </div>
        <div class="MODULE-RIGHT-MAJOR" v-show="page=='LIST'">
            <!-- 搜索条件 -->
            <div class="PANEL" style="top:0px;">
                <div class="PANEL-BUTTON">
                    <xui-filter class="title_filter" ref="filter" :options="filterOptions" @filter="search">
                    </xui-filter>
                    <div class="toolbar_page" style="float:right;">
                        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
                        <div class="page_total" style="padding-left:10px;">
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
        <!-- 详情 -->
        <equipment-detail v-show="page=='DETAIL'" ref="detail" @close="closeDetail" @refresh="refresh">
        </equipment-detail>
        <!-- 批量 -->
        <!-- <equipment-batchadd v-show="page=='BATCH'" ref="batch" @close="closeDetail" @refresh="refresh">
        </equipment-batchadd> -->
        <!-- 历史 -->
        <equipment-history ref="history" @refresh="refresh"></equipment-history>
        <!-- 参数编辑 -->
        <!-- <equipment-params v-show="page=='PARAMS'" :show="page=='PARAMS'" ref="params" @refresh="refresh"></equipment-params> -->
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $dictionary = $import("dag/common/dictionary");
const $tools = $import("dag/common/tools");

import EquipmentDetail from "./detail.vue";
import EquipmentHistory from "./history.vue";
// import EquipmentBatchadd from "./batchadd.vue";
// import EquipmentParams from "./params.vue";

import Store from "./store";

export default {
    components: {
        EquipmentDetail,
        EquipmentHistory,
        // EquipmentBatchadd,
        // EquipmentParams,
        DagTree: $import("dag/components/Tree").Component,
    },
    data() {
        return {
            currentRecord: {},
            page: "LIST",
            path: [
                {
                    title: "产品列表",
                    name: "AccessManage",
                },
            ],
            loading: false,
            currentGroup: null,
            equipmentTree: {
                treeType: "EQUIPMENT",
                selectedRoot: true,
                isParent(node) {
                    return node.type == "group";
                },
                select: {
                    enable: function (n) {
                        return n.type == "group";
                    },
                },
                filter: {
                    groupQueryFrom: 1,
                },
            },
            // 搜索条件的配置
            treeFilterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        name: "keyword",
                        widget: "input",
                        placeholder: "请输入关键字",
                        changeFilter: true,
                        manner: "search",
                    },
                ],
            },
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        name: "deviceName",
                        widget: "input",
                        placeholder: "请输入设备备注",
                    },
                    {
                        name: "deviceStatus",
                        widget: "select",
                        placeholder: "请选择设备状态",
                        clearable: false,
                        prependData: [
                            {
                                text: "全部",
                                value: "ALL",
                            },
                        ],
                        enum: "DEVICE_STATUS",
                    },
                ],
                format(filter) {
                    if (filter.deviceStatus == "ALL") {
                        delete filter.deviceStatus;
                    }
                },
                searchButton: {
                    color: "primary",
                    icon: "xui-icon xui-icon-search",
                    label: "搜索",
                },
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "添加",
                        icon: "iconfont iconxinzeng",
                        color: "primary",
                        permission: "Equipment_Add",
                        operate: () => {
                            this.edit();
                        },
                    },
                    // {
                    //     label: "批量添加",
                    //     icon: "xui-icon xui-icon-flashlight_fill",
                    //     color: "success",
                    //     permission: "Equipment_Add",
                    //     operate: () => {
                    //         this.page = "BATCH";
                    //     },
                    // },
                ],
            },
            tableOptions: {
                columns: [
                    {
                        title: "设备SN",
                        name: "deviceSN",
                        align: "center",
                    },
                    {
                        title: "设备编号",
                        name: "deviceNo",
                        align: "center",
                    },
                    {
                        title: "设备备注",
                        name: "deviceName",
                        align: "center",
                    },
                    {
                        title: "设备类型",
                        name: "deviceType",
                        enum: "DEVICE_TYPE",
                    },
                    {
                        title: "状态",
                        name: "deviceStatus",
                        innerStyle:
                            "display:inline-block;width:120px;text-align:left;",
                        format(v, record) {
                            return $tools.generateDevicestatusDom(
                                record.deviceStatus
                            );
                            var status = record.deviceStatus;
                            return `
                                <div class="color-${
                                    {
                                        2: "success",
                                        4: "danger",
                                    }[v]
                                }">${$dictionary.transcode(
                                "DEVICE_STATUS",
                                v
                            )}</div>
                                `;
                        },
                    },
                    {
                        title: "启用状态",
                        name: "deviceStatus",
                        toolbar: [
                            {
                                size: "mini",
                                type: "switch",
                                color: "primary",
                                default(record) {
                                    return record.deviceStatus != "3";
                                },
                                disabled() {
                                    return !$business.checkPermission(
                                        "Equipment_Status"
                                    );
                                },
                                operate: (record) => {
                                    var p = JSON.parse(JSON.stringify(record));
                                    p.deviceStatus =
                                        p.deviceStatus == "3" ? "1" : "3";
                                    return Store.save(p).then(() => {
                                        $tip("修改成功", "success");
                                        record.deviceStatus = p.deviceStatus;
                                    });
                                },
                            },
                        ],
                    },
                    {
                        title: "最后上线时间",
                        name: "lastTime",
                        format: "DATETIME",
                    },
                    {
                        title: "操作",
                        style: "width:290px;",
                        toolbar: [
                            {
                                label: "删除",
                                size: "mini",
                                color: "danger-text",
                                permission: "Equipment_Delete",
                                operate: (record) => {
                                    if (
                                        record.deviceStatus != "3" &&
                                        record.deviceStatus != "5"
                                    ) {
                                        $tip("仅允许删除禁用设备", "warning");
                                        return;
                                    }
                                    this.remove(record);
                                },
                            },
                            {
                                label: "编辑",
                                size: "mini",
                                color: "primary-text",
                                permission: "Equipment_Modify",
                                operate: (record) => {
                                    if (record.deviceStatus == "3") {
                                        $tip("设备已禁用", "warning");
                                        return;
                                    }
                                    this.edit(record);
                                },
                            },
                            {
                                label: "编辑记录",
                                size: "mini",
                                color: "success-text",
                                permission: "Equipment_History",
                                premise(record) {
                                    return record.deviceStatus != "5";
                                },
                                operate: (record) => {
                                    if (record.deviceStatus == "3") {
                                        $tip("设备已禁用", "warning");
                                        return;
                                    }
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
                    filter.projectId =
                        this.currentGroup && this.currentGroup.projectId;
                    if (!filter.projectId) {
                        return {
                            total: 0,
                            list: [],
                        };
                    }
                    this.loading = false;
                    return Store.list(filter, this.currentGroup.projectName);
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
        treeInited(at) {
            if (this.$route.query.projectId) {
                this.$refs.tree.clearSelected();
                this.$refs.tree.selectNode(this.$route.query.projectId, true);
            }
        },
        onSelected(n) {
            this.currentGroup = n;
            this.$refs.filter.search();
            this.page = "LIST";
        },
        edit(model) {
            this.page = "DETAIL";
            this.$refs.detail.open(model);
        },
        history(record) {
            this.$refs.history.open({
                ownerId: record.deviceId,
            });
        },
        searchTree(filter) {
            this.$refs.tree.search(filter.keyword);
        },
        // 搜索
        search(filter) {
            this.$refs.table.search(filter);
        },
        refresh(refreshGroup) {
            this.page = "LIST";
            this.$refs.table.refresh();
            if (refreshGroup) {
                refreshGroup.type = "group";
                this.$refs.tree.refreshNode(refreshGroup);
            }
        },
        // 删除
        remove(data) {
            $confirm(`确定删除[${data.deviceName}]？`).then(() => {
                Store.remove(data.deviceId).then((res) => {
                    $tip("删除成功", "success");
                    this.refresh();
                });
            });
        },
        editParams(record) {
            this.currentRecord = record;
            // if (record.deviceType == 1) {
            this.page = "PARAMS";
            this.$refs.params.open(record);
            // } else {
            //     $tip("智能互感设备暂无配置");
            // }
        },
        closeDetail() {
            this.page = "LIST";
        },
        getTable(data, num) {
            this.totalNum = num;
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-Equipment {
    @side-width: 260px;
    .left_filter {
        background: #fff;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 10px;
        padding-left: 10px;
        width: auto;
    }
    .left-tree-container {
        background: #fff;
        position: absolute;
        top: 50px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }
    .MODULE-MAJOR-CONTENT {
        position: absolute;
        top: 0px;
        left: @side-width+10px;
        right: 0px;
        bottom: 0px;
    }
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
.left-tree-container {
    background: #fff;
    position: absolute;
    top: 50px;
    left: 0px;
    right: 0px;
    bottom: 0px;
}
</style>