<template>
    <div class="MODULE-CONTAINER MODULE-Home">
        <div class="MODULE-MAJOR-CONTENT Home-content">
            <div class="home-charts">
                <div class="head-summary">
                    <div class="summary-icon" style="background:#4C9CFF;">
                        <img src="/images/home/summary_1.png" alt="">
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">设备总数</div>
                        <div class="summary-total" style="color:#4C9CFF;">1</div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>1</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="head-summary">
                    <div class="summary-icon">
                        <img src="/images/home/summary_2.png" alt="">
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">在线总数</div>
                        <div class="summary-total" style="color:#4DD487;">1</div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>1</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="head-summary">
                    <div class="summary-icon">
                        <img src="/images/home/summary_3.png" alt="">
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">今日装载次数</div>
                        <div class="summary-total" style="color:#FFBF00;">1</div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>1</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="head-summary">
                    <div class="summary-icon">
                        <img src="/images/home/summary_4.png" alt="">
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">今日违规次数</div>
                        <div class="summary-total" style="color:#EE5048;">1</div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>1</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home-major">
                <xui-tabs v-model="viewMode" :options="tabOptions"></xui-tabs>
                <xui-filter :options="filterOptions" @filter="search"
                    style="display:block;background:#FFF;padding-left:10px;">
                </xui-filter>
                <div class="home-major-content" v-show="viewMode=='MAP'">
                    <iot-map ref="map" @inited="showMarkers()"></iot-map>
                </div>
                <div class="home-major-content" v-show="viewMode=='TABLE'" style="padding:10px;">
                    <div class="table-title">实时在线设备</div>
                    <xui-table ref="table" :options="tableOptions"></xui-table>
                    <div class="table-title">实时报警设备</div>
                    <xui-table ref="table2" style="width:800px;" :options="tableOptions2"></xui-table>
                </div>
            </div>
        </div>
        <device-card ref="infowindow" v-show="isShowInfoWindow" class="iot-map-infowindow" :closeable="true"
            :data="currentDeviceData" @close="closeInfoWindow()"></device-card>
    </div>
</template>
<script>
const $dictionary = $import("dag/common/dictionary");

import Store from "./store";
import DeviceCard from "./card";

function chartTemplate(options) {
    return {
        style: "width:100%",
        setOption: {
            title: {
                text: options.title,
                textStyle: {
                    color: "#666",
                    fontSize: "16",
                },
            },
            toolbox: {
                show: true,
                right: 90,
                feature: {
                    magicType: { type: ["line", "bar"] },
                },
            },
            color: ["#03A0EE", "#FF8528"],
            legend: {
                data: ["数据", "告警"],
                right: "5%",
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
                    max: options.yAxisMax,
                    axisLabel: {
                        textStyle: {
                            color: "#999999",
                            fontSize: "12",
                        },
                    },
                    axisLabel: options.yAxisLabel,
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
                    name: options.title,
                    data: [0, 0, 0, 0, 0, 0, 0],
                    type: "line",
                    smooth: 0,
                    symbolSize: 6,
                },
            ],
        },
    };
}

export default {
    components: {
        IotMap: $import("dag/components/Map").Component,
        IotChart: $import("dag/components/Charts").Component,
        DeviceCard,
    },
    data() {
        return {
            viewMode: "MAP",
            isShowInfoWindow: false,
            currentDeviceData: {},
            tabOptions: {
                data: [
                    {
                        text: "地图模式",
                        value: "MAP",
                    },
                    {
                        text: "图表模式",
                        value: "TABLE",
                    },
                ],
            },
            datSelectOptions: {
                clearable: false,
                data: [
                    {
                        text: "三天",
                        value: "3",
                    },
                    {
                        text: "七天",
                        value: "7",
                    },
                    {
                        text: "十五天",
                        value: "15",
                    },
                    {
                        text: "三十天",
                        value: "30",
                    },
                ],
            },
            filterOptions: {
                fields: [
                    {
                        label: "项目名称",
                        name: "groupName",
                        widget: "input",
                        placeholder: "请输入",
                    },
                    {
                        label: "设备名称",
                        name: "deviceName",
                        widget: "input",
                        placeholder: "请输入",
                    },
                ],
                searchButton: {
                    color: "primary",
                    label: "查找",
                },
            },
            chartOptions: [
                chartTemplate({
                    title: "在线率",
                    yAxisMax: 1,
                    yAxisLabel: {
                        formatter: function (value, index) {
                            return (+value * 100).toFixed(0) + "%";
                        },
                    },
                }),
                chartTemplate({
                    title: "在线量",
                    yAxisLabel: {
                        formatter: function (value, index) {
                            return value;
                        },
                    },
                }),
                chartTemplate({
                    title: "报警率",
                    yAxisMax: 1,
                    yAxisLabel: {
                        formatter: function (value, index) {
                            return (+value * 100).toFixed(0) + "%";
                        },
                    },
                }),
                chartTemplate({
                    title: "报警量",
                    yAxisLabel: {
                        formatter: function (value, index) {
                            return value;
                        },
                    },
                }),
            ],
            tableOptions: {
                columns: [
                    {
                        title: "项目",
                        name: "groupName",
                        align: "center",
                    },
                    {
                        title: "设备名称",
                        name: "deviceName",
                        align: "center",
                    },
                    {
                        title: "通道1",
                        name: "$showData.value1",
                        format: (v, record) => {
                            return this.renderCell(1, record);
                        },
                    },
                    {
                        title: "通道2",
                        name: "$showData.value2",
                        format: (v, record) => {
                            return this.renderCell(2, record);
                        },
                    },
                    {
                        title: "通道3",
                        name: "$showData.value3",
                        format: (v, record) => {
                            return this.renderCell(3, record);
                        },
                    },
                    {
                        title: "通道4",
                        name: "$showData.value4",
                        format: (v, record) => {
                            return this.renderCell(4, record);
                        },
                    },
                    {
                        title: "通道5",
                        name: "$showData.value5",
                        format: (v, record) => {
                            return this.renderCell(5, record);
                        },
                    },
                    {
                        title: "通道6",
                        name: "$showData.value6",
                        format: (v, record) => {
                            return this.renderCell(6, record);
                        },
                    },
                    {
                        title: "通道7",
                        name: "$showData.value7",
                        format: (v, record) => {
                            return this.renderCell(7, record);
                        },
                    },
                    {
                        title: "通道8",
                        name: "$showData.value8",
                        format: (v, record) => {
                            return this.renderCell(8, record);
                        },
                    },
                    {
                        title: "通道9",
                        name: "$showData.value9",
                        format: (v, record) => {
                            return this.renderCell(9, record);
                        },
                    },
                    {
                        title: "通道10",
                        name: "$showData.value10",
                        format: (v, record) => {
                            return this.renderCell(10, record);
                        },
                    },
                    {
                        title: "通道11",
                        name: "$showData.value11",
                        format: (v, record) => {
                            return this.renderCell(11, record);
                        },
                    },
                    {
                        title: "通道12",
                        name: "$showData.value12",
                        format: (v, record) => {
                            return this.renderCell(12, record);
                        },
                    },
                    {
                        title: "通道13",
                        name: "$showData.value13",
                        format: (v, record) => {
                            return this.renderCell(13, record);
                        },
                    },
                    {
                        title: "通道14",
                        name: "$showData.value14",
                        format: (v, record) => {
                            return this.renderCell(14, record);
                        },
                    },
                    {
                        title: "通道15",
                        name: "$showData.value15",
                        format: (v, record) => {
                            return this.renderCell(15, record);
                        },
                    },
                    {
                        title: "输出通道1",
                        name: "outCh1",
                    },
                    {
                        title: "输出通道2",
                        name: "outCh2",
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
                    return Store.list(filter).then((res) => {
                        this.currentRecords = res.list;
                        this.showMarkers();
                        return res;
                    });
                },
            },
            currentRecords: [],
            tableOptions2: {
                columns: [
                    {
                        title: "项目",
                        name: "groupName",
                        align: "center",
                    },
                    {
                        title: "设备名称",
                        name: "deviceName",
                        align: "center",
                    },
                    {
                        title: "报警详情",
                        name: "alarmcode",
                    },
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 50,
                localPageSize: 50,
                format: {
                    list: "list",
                    count: "total",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    return Store.alarm(filter);
                },
            },
            summary: {
                alarmDeviceCount: 0,
                deviceCount: 0,
                offlineDeviceCount: 0,
                onlineDeviceCount: 0,
            },
            chartFilters: [
                {
                    statisticType: 1,
                    dayCount: "7",
                },
                {
                    statisticType: 2,
                    dayCount: "7",
                },
                {
                    statisticType: 3,
                    dayCount: "7",
                },
                {
                    statisticType: 4,
                    dayCount: "7",
                },
            ],
        };
    },
    methods: {
        refresh() {
            Store.summary().then((res) => {
                Object.assign(this.summary, res || {});
            });
            // this.refreshChart(0);
            // this.refreshChart(1);
            // this.refreshChart(2);
            // this.refreshChart(3);
        },
        // refreshChart(index) {
        //     Store.statistics(this.chartFilters[index]).then((res) => {
        //         res.reverse();
        //         var chartOptions = this.chartOptions[index];
        //         chartOptions.setOption.series[0].data = res.map(
        //             (item) => item.statisticValue
        //         );
        //         chartOptions.setOption.xAxis.data = res.map(
        //             (item) => item.statisticDate
        //         );
        //         this.$nextTick(() => {
        //             this.$refs[`chart${index}`].refresh();
        //         });
        //     });
        // },
        search(filter) {
            this.$refs.table.search(filter);
            this.$refs.table2.search(filter);
        },
        showMarkers() {
            var points = this.currentRecords
                .filter((item) => item.lng && item.lat)
                .map((item) => ({
                    extData: item,
                    position: [item.lng, item.lat],
                    content: `
                    <div class="label-info-marker" title="${
                        item.deviceName
                    }"><i class="device-map-icon iconfont ${
                        item.deviceType == 1 ? "iconmenjin" : "iconwifitanzhen"
                    }"></i></div>`,
                    clickable: true,
                    events: {
                        click: (marker) => {
                            this.currentDeviceData = item;
                            this.$nextTick(() => {
                                this.isShowInfoWindow = true;
                                this.$refs.map.openInfoWindow(
                                    marker.target.getPosition(),
                                    this.$refs.infowindow.$el
                                );
                            });
                        },
                    },
                }));
            this.$refs.map.inited().then(() => {
                this.$refs.map.showMarkers(points, true);
            });
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
                    ${$dictionary.transcode(
                        "CHANNEL_DATA_TYPE_UNIT",
                        record.$showData[`measure${channel}`]
                    )}
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
        bigScreen() {
            window.open(
                `${location.protocol}//${location.host}${location.pathname}#/Screen/page`,
                "_blank"
            );
        },
        closeInfoWindow() {
            this.isShowInfoWindow = false;
            this.$refs.map.closeInfoWindow();
        },
    },
    mounted() {
        this.refresh();
    },
};
</script>
<style lang="less">
.MODULE-CONTAINER .MODULE-MAJOR-CONTENT.Home-content {
    background: transparent;
    .chart-day-select {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 80px;
        font-size: 12px;
        .xui-select-inputwrap {
            font-size: 12px;
            height: 24px;
            line-height: 22px;
            min-height: auto;
        }
    }
}
.Home-content {
    display: flex;
    flex-direction: column;
    background: transparent;
    .home-top-bar {
        height: 40px;
        background: #fff;
        margin-bottom: 5px;
        line-height: 40px;
        padding-left: 10px;
        & > div {
            display: inline-block;
            vertical-align: top;
            font-size: 18px;
            padding-right: 50px;
        }
    }
    .home-charts {
        height: 106px;
        margin-bottom: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .home-chart {
            background: #fff;
            height: 100%;
            margin-right: 5px;
        }
        .head-summary {
            width: 24.6%;
            background: #fff;
            display: flex;
            flex-direction: row;
            .summary-icon {
                width: 96px;
                overflow: hidden;
                text-align: center;
            }
            .summary-info {
                flex-grow: 1;
                padding: 10px 15px;
            }
            .summary-title {
                font-size: 18px;
            }
            .summary-total {
                padding: 10px 0px;
                font-size: 26px;
                color: #2f72f4;
                border-bottom: 1px solid #ededed;
            }
            .summary-detail {
                padding-top: 10px;
                font-size: 0px;
                div{
                    display: inline-block;
                    vertical-align: middle;
                    width:50%;
                    font-size: 14px;
                }
                label{
                    padding-right:5px;
                }
                span {
                    text-decoration: underline;
                    font-weight: bold;
                }
            }
        }
    }
    .home-major {
        flex-grow: 1;
        position: relative;
        .home-major-content {
            position: absolute;
            top: 95px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            overflow-y: auto;
            background: #fff;
        }
    }
    .table-title {
        font-size: 18px;
        padding: 10px;
        text-align: center;
    }
}

.label-info-marker {
    position: relative;
    padding: 5px 5px;
    background: #2f72f4;
    border-radius: 20px;
    color: #fff;
    display: block;
    font-size: 0px;
    width: 14px;
    height: 14px;
    text-align: center;
    top: -34px;
    left: -3px;
    .device-map-icon {
        font-size: 12px;
    }
    &:after {
        content: "";
        border: 10px solid transparent;
        display: block;
        width: 0;
        height: 0;
        transition: all 0.15s ease-in-out;
        position: absolute;
        top: 80%;
        border-top-color: #3072f6 !important;
        left: calc(50% - 10px);
    }
}

.iot-cluster-marker {
    position: relative;
    top: -45px;
    left: -45px;
    background: rgba(#2f72f4, 0.95);
    border-radius: 100px;
    width: 90px;
    height: 90px;
    line-height: 90px;
    color: #fff;
    font-size: 14px;
    text-align: center;
}
</style>