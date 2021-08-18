<template>
    <div class="MODULE-CONTAINER MODULE-HistoryDataAnalysis">
        <div class="MODULE-LEFT-SIDE">
            <xui-filter style="padding-left:10px;" class="left_filter" ref="filter" :options="treeFilterOptions" @filter="searchTree"></xui-filter>
            <div style="padding:10px 10px 10px 10px;border-top:1px solid #dedede;">
                <xui-button color="primary" size="mini" @click="clearSelected">清空选择</xui-button>
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
        var randomeFunc = `historyAnalysis${Date.now()}`;
        window[randomeFunc] = (ev) => {
            var sn = ev.dataset.sn;
            this.$set(this.channels, ev.dataset.sn, ev.value);
            if (
                this.checkedDevices.filter((item) => item.deviceSN == sn)
                    .length > 0
            ) {
                this.$refs.filter.search();
            }
        };
        return {
            page: "LIST",
            mode: false,
            path: [
                {
                    title: "产品列表",
                    name: "AccessManage",
                },
            ],
            loading: false,
            channels: {},
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
                filter: {
                    groupQueryFrom: 4,
                },
                template: (node) => {
                    var icon;
                    if (node.type == "group") {
                        icon = "iconfont iconzuzhijigouzong";
                    } else if (node.type == "device") {
                        icon =
                            node.deviceType == 1
                                ? "iconfont iconmenjin"
                                : "iconfont iconwifitanzhen";
                    }
                    return `<div class="dag-tree-node">
                    <i  style="font-weight:600;font-size:14px;${
                        node.isLive ? "color:#4CAF50" : ""
                    }" class="dag-tree-node-icon ${icon}"></i>
                    <span style="${
                        node.isLive ? "color:#4CAF50" : ""
                    }" class="dag-tree-node-label">${node.name}</span>
                    ${
                        node.type == "group"
                            ? ""
                            : `<select class="xui-fasttree-operate" data-sn="${
                                  node.deviceSN
                              }" onChange="${randomeFunc}(this)">
                        ${
                            node.channels.length == 0
                                ? '<option value="">无通道</option>'
                                : node.channels.map(
                                      (c) =>
                                          `<option value="${c.channelNum}" ${
                                              this.channels[node.deviceSN] ==
                                              c.channelNum
                                                  ? "selected"
                                                  : ""
                                          }>${c.text}</option>`
                                  )
                        }
                    </select>`
                    }
                    </div>`;
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
                            new Date(new Date().getTime() - 86400000 * 3),
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
                                formatter: "{value}",
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
                    series: [
                        {
                            name: "",
                            data: [0, 0, 0, 0, 0, 0, 0],
                            type: "line",
                            smooth: 0,
                            symbolSize: 6,
                        },
                    ],
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
        clearSelected() {
            this.$refs.tree.clearChecked();
        },
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
            var channels = this.checkedDevices.map((d) => {
                var selectedNum =
                    this.channels[d.deviceSN] ||
                    (d.channels && d.channels[0] && d.channels[0].channelNum) ||
                    "1";
                return (
                    d.channels.filter((c) => c.channelNum == selectedNum)[0] ||
                    {}
                );
            });
            var mMap = channels.reduce((res, c) => {
                res[c.measure] = true;
                return res;
            }, {});
            var diff = Object.keys(mMap).length > 1;
            var checkedDevices = this.checkedDevices;
            Promise.all(
                this.checkedDevices.map((d) =>
                    Store[
                        checkedDevices[0].deviceType == 2 ? "listCgq" : "list"
                    ]({
                        deviceSN: d.deviceSN,
                        channelNum:
                            this.channels[d.deviceSN] ||
                            (d.channels &&
                                d.channels[0] &&
                                d.channels[0].channelNum) ||
                            "1",
                        queryStartTime: filter.queryStartTime,
                        queryEndTime: filter.queryEndTime,
                    })
                )
            ).then((res) => {
                if (filter != this.waitingFilter) {
                    return;
                }
                var times = res.filter((item) => item.length > 0)[0] || [];
                times &&
                    times.sort((a, b) => {
                        return a.addTime < b.addTime
                            ? -1
                            : a.addTime > b.addTime
                            ? 1
                            : 0;
                    });
                if (!res) {
                    this.chartOptions.setOption.series = [
                        {
                            name: "",
                            data: [],
                            type: "line",
                            smooth: 0,
                            symbolSize: 6,
                        },
                    ];
                } else if (checkedDevices[0].deviceType == 2) {
                    this.chartOptions.setOption.series = [
                        {
                            name: "温度",
                            data: [],
                            type: "line",
                            smooth: 0,
                            symbolSize: 6,
                        },
                        {
                            name: "电流1",
                            data: [],
                            type: "line",
                            smooth: 0,
                            symbolSize: 6,
                            yAxisIndex: 1,
                        },
                        {
                            name: "电流2",
                            data: [],
                            type: "line",
                            smooth: 0,
                            symbolSize: 6,
                            yAxisIndex: 1,
                        },
                    ];
                    res[0].forEach((item) => {
                        this.chartOptions.setOption.series[0].data.push(item.t);
                        this.chartOptions.setOption.series[1].data.push(
                            item.a1
                        );
                        this.chartOptions.setOption.series[2].data.push(
                            item.a2
                        );
                    });
                } else {
                    this.chartOptions.setOption.series = res.map(
                        (list, index) => {
                            return list && list.length > 0
                                ? list.reduce(
                                      (res, item) => {
                                          res.data.push(item.channelValue);
                                          return res;
                                      },
                                      {
                                          name: list[0] && list[0].deviceName,
                                          data: [],
                                          type: "line",
                                          smooth: 0,
                                          symbolSize: 6,
                                      }
                                  )
                                : {
                                      name: checkedDevices[index].deviceName,
                                      data: [],
                                      type: "line",
                                      smooth: 0,
                                      symbolSize: 6,
                                  };
                        }
                    );
                }

                this.chartOptions.setOption.xAxis.data = times.map((item) =>
                    Sunset.Dates.format(item.addTime, "yyyy-MM-dd HH:mm:ss")
                );
                this.chartOptions.setOption.legend.data = this.checkedDevices.map(
                    (item) => item.deviceName
                );

                if (checkedDevices[0].deviceType == "1") {
                    this.chartOptions.setOption.yAxis[0].axisLabel.formatter = diff
                        ? "{value}"
                        : `{value} ${$dictionary.transcode(
                              "CHANNEL_DATA_TYPE_UNIT",
                              channels[0] && channels[0].measure
                          )}`;
                    this.chartOptions.setOption.yAxis.length = 1;
                } else {
                    this.chartOptions.setOption.yAxis = [
                        {
                            type: "value",
                            min: 0,
                            axisLabel: {
                                formatter: "{value} ℃",
                                textStyle: {
                                    color: "#999999",
                                    fontSize: "12",
                                },
                            },
                            axisTick: {
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
                        {
                            type: "value",
                            min: 0,
                            position: "right",
                            axisLabel: {
                                formatter: "{value} mA",
                                textStyle: {
                                    color: "#999999",
                                    fontSize: "12",
                                },
                            },
                            axisTick: {
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
                    ];
                    this.chartOptions.setOption.legend.data = [
                        "温度",
                        "电流1",
                        "电流2",
                    ];
                }
                this.$refs.chart.refresh();
            });
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-HistoryDataAnalysis {
    @side-width: 360px;
    .MODULE-LEFT-SIDE {
        position: absolute;
        top: 0px;
        left: 0px;
        width: @side-width;
        bottom: 0px;
    }
    .left-tree-container {
        background: #fff;
        position: absolute;
        top: 85px;
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