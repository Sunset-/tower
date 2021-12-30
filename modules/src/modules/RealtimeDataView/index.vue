<template>
    <div class="MODULE-CONTAINER MODULE-Equipment">
        <div class="MODULE-LEFT-SIDE">
            <xui-filter
                class="left_filter"
                ref="filter"
                :options="treeFilterOptions"
                @filter="searchTree"
            ></xui-filter>
            <div class="left-tree-container">
                <dag-tree
                    ref="tree"
                    :options="equipmentTree"
                    @selected="onSelected"
                    @inited="treeInited"
                ></dag-tree>
            </div>
        </div>
        <div class="MODULE-MAJOR-CONTENT" v-show="page == 'LIST'">
            <!-- <xui-tabs v-model="viewMode" :options="tabOptions"></xui-tabs> -->
            <!-- 搜索条件 -->
            <div
                class="PANEL-SEARCH"
                style="
                    border-bottom: 1px solid #dedede;
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
                    <div style="display: inline-block; padding-right: 30px">
                        <label>实时刷新</label>
                        <xui-switch v-model="autoRefresh"></xui-switch>
                    </div>
                    <xui-button color="primary" style="" @click="refresh"
                        >刷新数据</xui-button
                    >
                    <xui-button color="success" style="" @click="showAnimate"
                        >动画查看</xui-button
                    >
                </div>
            </div>
            <div
                style="
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    top: 45px;
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
                        :style="
                            currentGroup.deviceType == '2'
                                ? ''
                                : 'min-width:1200px;'
                        "
                        ref="table"
                        :options="tableOptions"
                    >
                    </xui-table>
                    <!-- <div v-show="viewMode=='CARD'" class="device-data-cards">
                        <device-card v-for="item in list" :key="item.deviceSN" :data="item"></device-card>
                    </div> -->
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
        <device-animate ref="animate"></device-animate>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");
const $dictionary = $import("dag/common/dictionary");

const ALARM_CODE = [
    "碰撞预警",
    "力矩超载预警",
    "起重量超载预警",
    "风速预警",
    "变幅进限位预警",
    "变幅出限位预警",
    "高度上限位预警",
    "高度下限位预警",
    "防倾翻预警",
    "限制区预警",
    "角度限位预警",
    "防倾翻预警",
    "12预留",
    "13预留",
    "14预留",
    "15预留",
    "碰撞报警",
    "力矩超载报警",
    "起重量超载报警",
    "风速报警",
    "变幅进限位报警",
    "变幅出限位报警",
    "高度上限位报警",
    "高度下限位报警",
    "防倾翻报警",
    "限制区报警",
    "角度限位报警",
    "防倾翻报警",
    "28预留",
    "29预留",
    "30预留",
    "31预留",
];

const ALARM_CODE_CGQ = [
    "温度下限报警",
    "温度上限报警",
    "电流1下限报警",
    "电流1上限报警",
    "电流2下限报警",
    "电流2上限报警",
];

const ZD_CODE_CGQ = [
    "小车进高速",
    "小车进低速",
    "小车出高速",
    "小车出低速",
    "吊钩上高速",
    "吊钩上低速",
    "吊钩下高速",
    "吊钩下低速",
    "左转高速",
    "左转低速",
    "右转高速",
    "右转低速",
];

import Store from "./store";
// import DeviceCard from "./card";
import DeviceAnimate from "./animate";

export default {
    components: {
        DagTree: $import("dag/components/Tree").Component,
        DeviceAnimate,
    },
    data() {
        return {
            page: "LIST",
            autoRefresh: false,
            path: [
                {
                    title: "产品列表",
                    name: "AccessManage",
                },
            ],
            loading: false,
            equipmentTree: {
                treeType: "EQUIPMENT",
                selectedRoot: !this.$route.query.id,
                isParent(node) {
                    return node.type == "group";
                },
                select: {
                    enable: function (n) {
                        return n.type == "group";
                    },
                },
                filter: {
                    groupQueryFrom: 2,
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
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                filterEmpty: true,
                lazy: true,
                fields: [
                    {
                        name: "deviceSN",
                        widget: "input",
                        placeholder: "搜索设备",
                        manner: "search",
                        changeFilter: true,
                    },
                    {
                        name: "deviceStatus",
                        widget: "radio",
                        changeFilter: true,
                        data: [
                            {
                                text: "全部",
                                value: "ALL",
                            },
                            {
                                text: "在线",
                                value: "2",
                            },
                            {
                                text: "离线",
                                value: "1",
                            },
                            {
                                text: "设备数据出错",
                                value: "4",
                            },
                            {
                                text: "设备授权已过期",
                                value: "5",
                            },
                        ],
                        defaultFirst: true,
                        placeholder: "请选择状态",
                    },
                ],
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
                pageSize: 50,
                localPageSize: 50,
                format: {
                    list: "list",
                    count: "count",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.projectId = this.currentProjectId;
                    if (filter.deviceStatus == "ALL") {
                        delete filter.deviceStatus;
                    }
                    return Store.list(filter);
                },
            },
            tableOptions: {
                columns: [
                    {
                        title: "设备SN",
                        name: "deviceSN",
                        align: "center",
                        style: "width:120px;",
                    },
                    {
                        title: "状态",
                        name: "deviceStatus",
                        align: "center",
                        style: "width:80px;",
                        format(v, record) {
                            var status = record.deviceStatus;
                            var electricity = record.powerpercent;
                            var csq = record.csq;
                            return `
                            <div class="device-status-wrap">
                                ${$tools.generateDevicestatusDom(status)}
                            </div>
                            `;
                        },
                    },
                    {
                        title: "最后数据刷新时间",
                        name: "addTime",
                        style: "width:140px;",
                        format: "DATETIME",
                    },
                    {
                        title: "设备编号",
                        name: "deviceNo",
                        align: "center",
                    },
                    {
                        title: "变幅",
                        name: "amplitude",
                        align: "center",
                        style: "width:50px;",
                    },
                    {
                        title: "高度",
                        name: "height",
                        align: "center",
                        style: "width:50px;",
                    },
                    {
                        title: "吊重",
                        name: "suspendWeight",
                        align: "center",
                        style: "width:50px;",
                    },
                    {
                        title: "回转",
                        name: "gyration",
                        align: "center",
                        style: "width:50px;",
                    },
                    {
                        title: "风速",
                        name: "windSpeed",
                        align: "center",
                        style: "width:50px;",
                    },
                    {
                        title: "倾角",
                        name: "dipAngle",
                        align: "center",
                        style: "width:50px;",
                        format(v,record){
                            return `(${isNaN(record.dipAngleX)?'-':record.dipAngleX},${isNaN(record.dipAngleY)?'-':record.dipAngleY})`
                        }
                    },
                    {
                        title: "力矩百分比",
                        name: "torquePercent",
                        align: "center",
                        style: "width:90px;",
                    },
                    {
                        title: "吊重百分比",
                        name: "suspendWeightPercent",
                        align: "center",
                        style: "width:90px;",
                    },
                    {
                        title: "倾斜百分比",
                        name: "dipAnglePercent",
                        align: "center",
                        style: "width:90px;",
                    },
                    {
                        title: "风速百分比",
                        name: "windSpeedPercent",
                        align: "center",
                        style: "width:90px;",
                    },
                    // {
                    //     title: "报警状态",
                    //     name: "alarmcode",
                    //     format(v, record) {
                    //         if (v == 0) {
                    //             return v;
                    //         } else {
                    //             var alarm = Object.keys(record.$showData)
                    //                 .filter((k) => k.indexOf("alarmcode") == 0)
                    //                 .reduce((res, k) => {
                    //                     res.push(
                    //                         k.replace("alarmcode", "") +
                    //                             ":" +
                    //                             record.$showData[k]
                    //                     );
                    //                     return res;
                    //                 }, [])
                    //                 .join(";");
                    //             return `<div class="device-alarm-num"
                    //              data-alarm="${alarm}"
                    //               data-sn="${record.deviceSN}"
                    //                data-name="${record.deviceName}"
                    //                 data-type="${record.deviceType}" style="color:#4487F1;cursor:pointer;">${v}</div>`;
                    //         }
                    //     },
                    // },
                    {
                        title: "制动状态",
                        name: "brakingCode",
                        align: "center",
                        style: "width:90px;",
                    },
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 50,
                localPageSize: 50,
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
            currentProjectId: "",
            currentGroup: {},
            list: [],
            alarmDevice: {
                deviceSN: "",
                deviceName: "",
                channels: [],
            },
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
        onSelected(n) {
            n.deviceType = n.deviceType || "1";

            this.currentGroup = n;
            this.currentProjectId = n.id;
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
            this.$refs.datapage.search(filter);
        },
        refresh() {
            this.page = "LIST";
            this.$refs.datapage.refresh();
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
            if (record.$showData[`switch${channel}`] != "1") {
                return "--";
            }
            if (
                record.$showData[`value${channel}`] === void 0 ||
                record.$showData[`value${channel}`] === ""
            ) {
                return "-";
            }
            var unit = $dictionary.transcode(
                "CHANNEL_DATA_TYPE_UNIT",
                record.$showData[`measure${channel}`] || ""
            );
            var preV = record.$showData[`valuePre${channel}`] || "";
            var curV = record.$showData[`value${channel}`] || "";
            if (unit == "ON/OFF") {
                unit = "";
                preV = preV == "1" ? "ON" : "OFF";
                curV = curV == "1" ? "ON" : "OFF";
            }
            return `
                <div title="上报时间：${Sunset.Dates.format(
                    +record.$showData[`addTime${channel}`]
                )} 上次值：${preV}${unit}">
                    ${curV}${unit}
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
        endLoopStatus() {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        },
        showAnimate() {
            this.$refs.animate.open(this.currentProjectId);
        },
        treeInited() {
            if (this.$route.query.id) {
                this.$refs.tree.selectNode(this.$route.query.id);
            }
        },
    },
    mounted() {
        this.refreshTimer = setInterval(() => {
            if (this.autoRefresh) {
                this.refresh();
            }
        }, 10000);
    },
    destroyed() {
        this.endLoopStatus();
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-Equipment {
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
</style>