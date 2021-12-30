<template>
    <div class="MODULE-CONTAINER MODULE-EquipmentHistoryData">
        <div class="MODULE-LEFT-SIDE">
            <xui-filter
                style="padding-left: 10px"
                class="left_filter"
                ref="tree_filter"
                :options="treeFilterOptions"
                @filter="searchTree"
            ></xui-filter>
            <div class="left-tree-container">
                <dag-tree
                    ref="tree"
                    :options="equipmentTree"
                    @selected="onSelected"
                ></dag-tree>
            </div>
        </div>
        <div class="MODULE-MAJOR-CONTENT" v-show="page == 'LIST'">
            <div style="padding: 15px 10px; border-bottom: 1px solid #dedede">
                {{ title }}
                <span
                    v-if="unLocalRecord"
                    class="color-danger"
                    style="display: inline-block; padding-left: 10px"
                    >当前设备未打开本地历史记录存储功能！</span
                >
            </div>
            <!-- 搜索条件 -->
            <div
                class="PANEL-SEARCH"
                style="
                    border-bottom: 1px solid #dedede;
                    padding: 15px 10px;
                    justify-content: space-between;
                "
            >
                <xui-filter
                    class="title_filter"
                    ref="filter"
                    :options="filterOptions"
                    @filter="search"
                ></xui-filter>
                <div>
                    <xui-button color="primary" style="" @click="exportData"
                        >导出</xui-button
                    >
                </div>
            </div>
            <div
                style="
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    top: 100px;
                    padding: 10px;
                    overflow: scroll;
                "
                @click="tableClick"
            >
                <xui-datapage
                    ref="datapage"
                    :options="dataPageOptions"
                    @output="getTable"
                >
                    <xui-table
                        v-show="viewMode == 'TABLE'"
                        ref="table"
                        :options="tableOptions"
                    >
                    </xui-table>
                </xui-datapage>
            </div>
        </div>
        <xui-modal ref="alarmmodal" title="报警详情" width="500">
            <div style="padding: 15px; max-height: 400px; overflow-y: auto">
                <div style="padding: 10px">
                    设备SN：{{ alarmDevice.deviceSN }}&nbsp;&nbsp;设备备注：{{
                        alarmDevice.deviceName
                    }}
                </div>
                <div
                    style="padding: 10px"
                    v-for="c in alarmDevice.channels"
                    :key="c.index"
                >
                    通道{{ c.index }}：<span
                        :class="{ 'color-primary': c.alarmText != '-' }"
                        >{{ c.alarmText }}</span
                    >
                </div>
            </div>
        </xui-modal>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");
const $dictionary = $import("dag/common/dictionary");

import Store from "./store";

const ALARM_CODE = [
    "阈值下限报警",
    "阈值上限报警",
    "波动报警",
    "DI触发报警",
    "DI翻转报警",
];
const ALARM_CODE_CGQ = [
    "温度下限报警",
    "温度上限报警",
    "电流1下限报警",
    "电流1上限报警",
    "电流2下限报警",
    "电流2上限报警",
];

export default {
    components: {
        DagTree: $import("dag/components/Tree").Component,
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
            equipmentTree: {
                treeType: "EQUIPMENT",
                selectedRoot: false,
                isParent(node) {
                    return node.type == "group";
                },
                select: {
                    enable: function (n) {
                        return n.type != "group";
                    },
                },
                filter: {
                    groupQueryFrom: 3,
                },
            },
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
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        name: "time",
                        widget: "datetime",
                        startPlaceholder: "开始时间",
                        endPlaceholder: "结束时间",
                        type: "daterange",
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        default: [
                            new Date(new Date().getTime() - 86400000 * 3),
                            new Date(),
                        ],
                        changeFilter: true,
                        shortcuts: [
                            {
                                label: "1天",
                                value() {
                                    var now = new Date();
                                    return [
                                        new Date(now.getTime() - 86400000),
                                        now,
                                    ];
                                },
                            },
                            {
                                label: "3天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 3);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                            {
                                label: "7天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 6);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                            {
                                label: "30天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 30);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                            {
                                label: "90天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 90);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                        ],
                    },
                    {
                        label: "通道编号",
                        name: "channelNum",
                        widget: "select",
                        defaultFirst: true,
                        changeFilter: true,
                        placeholder: "请选择通道",
                        style: "width:120px;",
                        clearable: false,
                        premise: () => {
                            return (
                                this.currentDevice &&
                                this.currentDevice.deviceType == "1"
                            );
                        },
                        data() {
                            var items = [
                                {
                                    text: "全部",
                                    value: "ALL",
                                },
                            ];
                            for (var i = 1; i <= 16; i++) {
                                items.push({
                                    text: `通道${i}`,
                                    value: `${i}`,
                                });
                            }
                            return items;
                        },
                    },
                    {
                        name: "alarmcode",
                        widget: "radio",
                        changeFilter: true,
                        defaultFirst: true,
                        placeholder: "请选择状态",
                        data: [
                            {
                                text: "全部",
                                value: "ALL",
                            },
                            {
                                text: "只看报警",
                                value: "0",
                            },
                        ],
                    },
                ],
                format(filter) {
                    if (filter.time && filter.time.length == 2) {
                        filter.queryStartTime = filter.time[0] + " 00:00:00";
                        filter.queryEndTime = filter.time[1] + " 23:59:59";
                    }
                    delete filter.time;
                    if (filter.alarmcode == "ALL") {
                        delete filter.alarmcode;
                    }
                    if (filter.channelNum == "ALL") {
                        delete filter.channelNum;
                    }
                    delete filter.date;
                },
            },
            tabOptions: {
                data: [
                    {
                        text: "列表查看",
                        value: "TABLE",
                    },
                    {
                        text: "卡片查看",
                        value: "CARD",
                    },
                ],
            },
            viewMode: "TABLE",
            dataPageOptions: {
                lazy: true,
                pageNumberStart: 1,
                pageSize: 20,
                localPageSize: 20,
                format: {
                    list: "list",
                    count: "total",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.deviceSN = this.currentDevice.deviceSN;
                    if (filter.deviceStatus == "ALL") {
                        delete filter.deviceStatus;
                    }
                    return Store[
                        this.currentDevice && this.currentDevice.deviceType == 2
                            ? "listCgq"
                            : "list"
                    ](filter);
                },
            },
            tableOptions: {
                columns: [
                    {
                        title: "上线时间",
                        name: "onlineTime",
                        align: "center",
                        format: "DATETIME",
                    },
                    {
                        title: "离线时间",
                        name: "offlineTime",
                        align: "center",
                        format: "DATETIME",
                    },
                    {
                        title: "在线时长",
                        name: "onlineTimeLength",
                        align: "center",
                    },
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 20,
                localPageSize: 20,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    return [];
                },
            },
            totalNum: 0,
            currentDevice: {},
            list: [],
            alarmDevice: {
                deviceSN: "",
                deviceName: "",
                channels: [],
            },
            currentFilter: {},
            unLocalRecord: false,
        };
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
        title() {
            if (this.currentDevice.deviceName) {
                return `${this.currentDevice.projectName} > ${this.currentDevice.deviceName}（${this.currentDevice.deviceSN}）`;
            }
            return "-";
        },
    },
    methods: {
        onSelected(n) {
            this.currentDevice = n;
            this.unLocalRecord = false;
            if (n.deviceType == "1") {
                Store.getEquipmentParams(n.deviceId).then((res) => {
                    var baseParams = res.filter(
                        (item) => item.paramsType == "DevBasePar"
                    )[0];
                    if (baseParams) {
                        try {
                            baseParams = JSON.parse(baseParams.params);
                        } catch (e) {
                            baseParams = {};
                        }
                    }
                    if (
                        baseParams.LocalRecord === 0 ||
                        baseParams.LocalRecord === "0"
                    ) {
                        this.unLocalRecord = true;
                    }
                });
            }
            this.$refs.filter.search();
        },
        edit(model) {
            this.page = "DETAIL";
            this.$refs.detail.open(model);
        },
        history(record) {
            this.$refs.history.open(record);
        },
        searchTree(filter) {
            this.$refs.tree.search(filter.keyword);
        },
        // 搜索
        search(filter) {
            if (!this.currentDevice.deviceSN) {
                return;
            }
            this.currentFilter = filter;
            this.$refs.datapage.search(filter);
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
        closeDetail() {
            this.page = "LIST";
        },
        getTable(data, num) {
            this.list = data;
            this.$refs.table.setData(data);
            this.totalNum = num;
        },
        renderCell(channel, record) {
            if (record.$showData[`value${channel}`] === void 0) {
                return "-";
            }
            return `
                <div title="${Sunset.Dates.format(
                    +record.$showData[`addTime${channel}`]
                )}">
                    ${record.$showData[`value${channel}`]}
                    ${record.$showData[`measure${channel}`]}
                    <i class="xui-icon xui-icon-arrow-${
                        record.$showData[`change${channel}`] == -1
                            ? "down"
                            : "up"
                    } device-datachange-arrow change-${
                record.$showData[`change${channel}`]
            }"></i>
                </div>
            `;
        },
        tableClick(event) {
            var target = event.target;
            if (target.className == "device-alarm-num") {
                var deviceSN = target.dataset.sn;
                var deviceName = target.dataset.name;
                var deviceType = target.dataset.type;
                var alarm = target.dataset.alarm;
                var CODES = deviceType == "1" ? ALARM_CODE : ALARM_CODE_CGQ;
                this.alarmDevice = {
                    deviceSN,
                    deviceName,
                    channels: alarm.split(";").map((a) => {
                        var index_alarmCode = a.split(":");
                        var code = +index_alarmCode[1];
                        var texts = [];
                        CODES.forEach((codeText, index) => {
                            var k = 1;
                            k = k << index;
                            if ((code & k) == k) {
                                texts.push(codeText);
                            }
                        });
                        return {
                            index: index_alarmCode[0],
                            alarmText: texts.join(",") || "-",
                        };
                    }),
                };
                this.$refs.alarmmodal.open();
            }
        },
        exportData() {
            var device = this.currentDevice;
            if (!device) {
                return;
            }
            Store[
                device.deviceType == 2 ? "exportHistoryCgq" : "exportHistory"
            ](
                Object.assign(
                    {
                        deviceSN: device.deviceSN,
                    },
                    this.currentFilter
                ),
                device.deviceName
            );
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-EquipmentHistoryData {
    @side-width: 260px;
    .MODULE-left-side {
        position: absolute;
        top: 0px;
        left: 0px;
        width: @side-width;
        bottom: 0px;
        border-right: 1px solid #898989;
        .left_filter {
            margin-top: -10px;
        }
        .left-tree-container {
            background: #fff;
            position: absolute;
            top: 40px;
            left: 0px;
            right: 10px;
            bottom: 0px;
            padding: 10px;
        }
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

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 350px;
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
.device-data-cards {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.device-status-wrap {
    & > div {
        display: inline-block;
        vertical-align: bottom;
    }
}
</style>z``