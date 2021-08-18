<template>
    <div class="MODULE-CONTAINER MODULE-AlarmAnalysis">
        <div class="MODULE-LEFT-SIDE">
            <xui-filter style="padding-left:10px;" class="left_filter" ref="filter" :options="treeFilterOptions" @filter="searchTree"></xui-filter>
            <div style="padding:10px 10px 10px 10px;border-top:1px solid #dedede;">
                <xui-checkbox v-model="mode" @change="changeMode" :options="{text : '单台设备分析'}"></xui-checkbox>
            </div>
            <div class="left-tree-container">
                <dag-tree ref="tree" :options="equipmentTree" @selected="onSelected" @checked="onChecked"></dag-tree>
            </div>
        </div>
        <div class="MODULE-MAJOR-CONTENT" v-show="page=='LIST'">
            <div style="padding:15px 10px;border-bottom:1px solid #dedede;">{{title}}</div>
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH" style="border-bottom:1px solid #dedede;padding:15px 10px;">
                <xui-filter class="title_filter" ref="filter" :options="filterOptions" @filter="search"></xui-filter>
            </div>
            <div style="position:absolute;left:0px;right:0px;bottom:0px;top:100px;padding:10px;overflow:scroll;">
                <iot-chart ref="chart" class="analysis-chart" :option="chartOptions"></iot-chart>
            </div>
        </div>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");
const $dictionary = $import("dag/common/dictionary");

import Store from "./store";

export default {
    components: {
        DagTree: $import("dag/components/Tree").Component,
        IotChart: $import("dag/components/Charts").Component,
    },
    data() {
        return {
            page: "LIST",
            mode: true,
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
                    enable: (n) => {
                        return this.mode == true && n.type != "group";
                    },
                },
                check: {
                    enable: (n) => {
                        return this.mode === false && n.type != "group";
                    },
                    cascade: "",

                    type: "multiple",
                },
                filter : {
                    groupQueryFrom : 5
                }
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
                lazy: true,

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
                            new Date(new Date().getTime() - 86400000 * 2),
                            new Date(),
                        ],
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
                                    start.setDate(start.getDate() - 2);
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
                                    start.setDate(start.getDate() - 29);
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
                                    start.setDate(start.getDate() - 89);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
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
                },
                searchButton: {
                    label: "查询",
                    color: "primary",
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

            chartOptions: {
                style: "width:100%",
                setOption: {
                    color: [
                        "#03A0EE",
                        "#FF8528",
                        "#dd6b66",
                        "#759aa0",
                        "#e69d87",
                        "#8dc1a9",
                        "#ea7e53",
                        "#eedd78",
                        "#73a373",
                        "#73b9bc",
                        "#7289ab",
                        "#91ca8c",
                        "#f49f42",
                        "#37A2DA",
                        "#32C5E9",
                        "#67E0E3",
                        "#9FE6B8",
                        "#FFDB5C",
                        "#ff9f7f",
                        "#fb7293",
                        "#E062AE",
                        "#E690D1",
                        "#e7bcf3",
                        "#9d96f5",
                        "#8378EA",
                        "#96BFFF",
                    ],
                    legend: {
                        data: [],
                        left: "5%",
                        top: 10,
                        textStyle: {
                            color: "#000",
                            fontSize: 14,
                        },
                    },
                    grid: {
                        left: "5%",
                        right: "10%",
                        bottom: "5%",
                        top: "20%",
                        containLabel: true,
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: "none",
                            },
                            dataView: { readOnly: false },
                            magicType: { type: ["line", "bar"] },
                            restore: {},
                            saveAsImage: {},
                        },
                    },
                    dataZoom: [
                        {
                            type: "inside",
                            throttle: 50,
                        },
                    ],
                    tooltip: {
                        trigger: "axis",
                        backgroundColor: "#fff",
                        // formatter: "{a0}<br/>【{b0}】: {c0}",
                        borderWidth: 3,
                        padding: 10,
                        borderColor: "rgba(227,234,236,0.3)",
                        textStyle: {
                            color: "#333",
                        },
                        axisPointer: {
                            type: "line",
                            lineStyle: {
                                color: "#DEDEDE",
                            },
                        },
                    },
                    xAxis: {
                        type: "category",
                        data: [],
                        boundaryGap: false,
                        axisTick: {
                            //y轴刻度线
                            show: false,
                        },
                        axisLabel: {
                            textStyle: {
                                color: "##999999",
                                fontSize: "12",
                            },
                        },
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#DEDEDE",
                            },
                        },
                    },
                    yAxis: [
                        {
                            type: "value",
                            // name: "近期转出数据",
                            min: 0,
                            axisLabel: {
                                textStyle: {
                                    color: "#999999",
                                    fontSize: "12",
                                },
                            },
                            // nameTextStyle: {
                            //   color: "#fff",
                            //   fontSize: "16"
                            // },
                            axisTick: {
                                //y轴刻度线
                                show: false,
                            },
                            axisLine: {
                                show: false,
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: "#DEDEDE",
                                    type: "dashed",
                                },
                            },
                        },
                    ],
                    series: [],
                    optionToContent: function (opt) {
                        let axisData = opt.xAxis[0].data; //坐标数据
                        let series = opt.series; //折线图数据
                        let tdHeads = "<td  >时间</td>"; //表头
                        let tdBodys = ""; //数据
                        series.forEach(function (item) {
                            //组装表头
                            tdHeads += `<td >${item.name}</td>`;
                        });
                        let table = `<table class="echarts-dataview-table" border="1" ><tbody><tr>${tdHeads} </tr>`;
                        for (let i = 0, l = axisData.length; i < l; i++) {
                            for (let j = 0; j < series.length; j++) {
                                //组装表数据
                                tdBodys += `<td>${
                                    series[j].data[i] === void 0
                                        ? ""
                                        : series[j].data[i]
                                }</td>`;
                            }
                            table += `<tr><td >${axisData[i]}</td>${tdBodys}</tr>`;
                            tdBodys = "";
                        }
                        table += "</tbody></table>";
                        return table;
                    },
                },
            },
            totalNum: 0,
            currentDevice: {},
            checkedDevices: [],
            list: [],
            waitingFilter: null,
        };
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
        title() {
            if (this.mode) {
                if (this.currentDevice.deviceName) {
                    return `${this.currentDevice.groupName} > ${this.currentDevice.deviceName}`;
                }
            } else {
                return this.checkedDevices
                    .map((item) => `${item.groupName} > ${item.deviceName}`)
                    .join(" , ");
            }
            return "-";
        },
    },
    methods: {
        onSelected(n) {
            this.currentDevice = n;
            this.$refs.filter.search();
        },
        onChecked(nodes) {
            var newNode = nodes[nodes.length - 1];
            if (
                nodes.length > 1 &&
                (newNode.deviceType == "2" ||
                    newNode.deviceType != nodes[nodes.length - 2].deviceType)
            ) {
                this.$refs.tree.checkNodes([newNode.id]);
                return;
            }
            this.checkedDevices = nodes;
            this.$refs.filter.search();
        },
        changeMode() {
            this.$refs.tree.init();
            this.currentDevice = {};
            this.checkedDevices = [];
            this.$refs.chart.clear();
        },
        edit(model) {
            this.page = "DETAIL";
            this.$refs.detail.open(model);
        },
        searchTree(filter) {
            this.$refs.tree.search(filter.keyword);
        },
        // 搜索
        search(filter) {
            this.waitingFilter = filter;
            var devices = [];
            if (this.mode) {
                devices = [this.currentDevice];
            } else {
                devices = this.checkedDevices;
            }
            Store[devices[0].deviceType==2?'listCgq':'list']({
                deviceSN: devices.map((d) => d.deviceSN).join(","),
                queryStartTime: filter.queryStartTime,
                queryEndTime: filter.queryEndTime,
            }).then((res) => {
                if (filter != this.waitingFilter) {
                    return;
                }
                var dates = this.getDates(filter);
                var dateMap = dates.reduce((res, d, index) => {
                    res[d] = index;
                    return res;
                }, {});
                if (devices.length == 1) {
                    var channelAlarms = res.reduce((res, item) => {
                        if (!res[item.channelNum]) {
                            res[item.channelNum] = dates.map((d) => 0);
                        }
                        res[item.channelNum][
                            dateMap[
                                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
                            ]
                        ] = item.alarmCount;
                        return res;
                    }, {});
                    this.chartOptions.setOption.series = Object.keys(
                        channelAlarms
                    ).map((c) => ({
                        name: `通道${c}`,
                        data: channelAlarms[c],
                        type: "line",
                        smooth: 0,
                        symbolSize: 6,
                    }));
                    this.chartOptions.setOption.legend.data = this.chartOptions.setOption.series.map(
                        (item) => item.name
                    );
                } else {
                    var deviceAlarms = res.reduce((res, item) => {
                        if (!res[item.deviceName]) {
                            res[item.deviceName] = dates.map((d) => 0);
                        }
                        res[item.deviceName][
                            dateMap[
                                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
                            ]
                        ] = item.alarmCount;
                        return res;
                    }, {});
                    this.chartOptions.setOption.series = Object.keys(
                        deviceAlarms
                    ).map((c) => ({
                        name: `${c}`,
                        data: deviceAlarms[c],
                        type: "line",
                        smooth: 0,
                        symbolSize: 6,
                    }));
                    this.chartOptions.setOption.legend.data = devices.map(
                        (item) => item.deviceName
                    );
                }

                this.chartOptions.setOption.xAxis.data = dates;
                this.$refs.chart.refresh();
            });
        },
        getDates(filter) {
            var dates = [];
            var date = new Date(filter.queryStartTime);
            var end = filter.queryEndTime.split(" ")[0];
            dates.push(Sunset.Dates.format(date, "yyyy-MM-dd"));
            var index = 100;
            while (true) {
                date.setDate(date.getDate() + 1);
                var d = Sunset.Dates.format(date, "yyyy-MM-dd");
                dates.push(d);
                if (d == end) {
                    break;
                }
                index--;
                if (index < 0) {
                    break;
                }
            }
            return dates;
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-AlarmAnalysis {
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
    }
    .left-tree-container {
        background: #fff;
        position: absolute;
        top: 75px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        padding: 10px;
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

    .analysis-chart {
        width: 600px;
        height: 400px;
    }
}
</style>