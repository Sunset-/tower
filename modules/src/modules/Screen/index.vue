<template>
    <div class="screen-container">
        <div class="screen-title">设备运维大屏</div>
        <div class="screen-major">
            <div class="screen-c1">
                <div class="screen-c1-r1 screen-panel">
                    <div class="panel-title">设备省级分布排名</div>
                    <div class="province-order-item" v-for="(item,index) in chartOptionsLeft1" :key="item.provinceName"
                        :title="item.provinceName+'：'+item.deviceCount" :index="index+1" :count="item.deviceCount">
                        <div :style="'width:'+item.width+'%;'">{{item.provinceName}}</div>
                    </div>
                </div>
                <div class="screen-c1-r2 screen-panel">
                    <div class="panel-title">设备在线率</div>
                    <!-- <iot-chart class="panel-chart" :option="chartOptions2"></iot-chart> -->
                    <xui-progress ref="progress"
                        :value="chartOptionsLeft2.onlineDeviceCount*100.0/chartOptionsLeft2.deviceCount||0"
                        manner="circle" style="text-align:center;padding-bottom:16px;font-size:20px;" start="top"
                        :radius="80" :line-width="10" color="#0a73ff" background-color="#ababab">
                        <template slot-scope="prop">
                            <div style="position:absolute;top:45%;left:50%;margin-left:-15px;">
                                {{(prop.progress*100).toFixed(0)}}%
                            </div>
                        </template>
                    </xui-progress>
                    <div class="screen-chart2-detail">
                        <div>
                            <label>设备总数</label>
                            <span>{{chartOptionsLeft2.deviceCount}}</span>
                        </div>
                        <div>
                            <label>在线设备</label>
                            <span>{{chartOptionsLeft2.onlineDeviceCount}}</span>
                        </div>
                        <div>
                            <label>离线设备</label>
                            <span>{{chartOptionsLeft2.offlineDeviceCount}}</span>
                        </div>
                    </div>
                </div>
                <div class="screen-c1-r3 screen-panel">
                    <div class="panel-title">设备报警量</div>
                    <iot-chart class="panel-chart" :option="chartOptionsLeft3"></iot-chart>
                </div>
            </div>
            <div class="screen-c2">
                <div class="screen-c2-r1 screen-panel">
                    <div class="panel-title" sub="单位：台"></div>
                    <iot-chart class="panel-chart" :option="chartOptionsMap"></iot-chart>
                    <div class="map-chart-summary">
                        <div>
                            <div class="summary-title">设备总数</div>
                            <div>
                                <span class="summary-value">{{chartOptionsLeft2.deviceCount}}</span>
                                <span class="summary-unit">/台</span>
                            </div>
                        </div>
                        <div>
                            <div class="summary-title">设备类型</div>
                            <div>
                                <span class="summary-value">{{chartOptionsLeft2.signalType}}</span>
                                <span class="summary-unit">/种</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screen-c2-r2">
                    <div class="screen-c1-r2-c1 screen-panel">
                        <div class="panel-title" sub="单位：台">日活设备</div>
                        <iot-chart class="panel-chart" :option="chartOptionsBottom1"></iot-chart>
                    </div>
                    <div class="screen-c1-r2-c2 screen-panel">
                        <div class="panel-title" sub="单位：台">每日新增设备</div>
                        <iot-chart class="panel-chart" :option="chartOptionsBottom2"></iot-chart>
                    </div>
                    <div class="screen-c1-r2-c3 screen-panel">
                        <div class="panel-title" sub="单位：台">累计激活设备</div>
                        <iot-chart class="panel-chart" :option="chartOptionsBottom3"></iot-chart>
                    </div>
                </div>
            </div>
            <div class="screen-c3">
                <div class="screen-c3-r1 screen-panel">
                    <div class="panel-title">接入信号类型统计</div>
                    <div class="screen-c3-r1-detail">
                        <div class="screen-c3-r1-c1">
                            <iot-chart class="panel-chart" :option="chartOptionsRight1"></iot-chart>
                        </div>
                        <div class="screen-c3-r1-c2">
                            <div v-for="(item,index) in chartOptionsRight1Items" :key="item.signalType"
                                :title="item.signal+':'+item.signalCount">
                                <div class="item-title" style="font-size:12px;padding-bottom:5px;">
                                    {{index+1}}.{{item.signal}}
                                    <span style="float:right;font-size:16px;">{{item.signalCount}}</span>
                                </div>
                                <xui-progress class="screen-progress" :value="item.signalCount"
                                    :options="{animate: true,total: item.total,color:'#0A73FF'}"
                                    style="width:100%;height:5px;margin-bottom:10px;"></xui-progress>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="screen-c3-r2 screen-panel">
                    <div class="panel-title">总设备日消息量</div>
                    <iot-chart class="panel-chart" :option="chartOptionsRight2"></iot-chart>
                </div>
                <div class="screen-c3-r3 screen-panel">
                    <div class="panel-title">单台设备天消息量TOP10</div>
                    <div class="screen-chart3-detail" style="overflow-y:auto;padding:0px 5px;">
                        <div v-for="(item,index) in chartOptionsRight3" :key="index"
                            :title="item.deviceSN+':'+item.statisticValue">
                            <div class="item-title">
                                {{index+1}}.{{item.deviceSN}}
                                <span style="float:right;font-size:16px;">{{item.statisticValue}}</span>
                            </div>
                            <xui-progress class="screen-progress" :value="item.statisticValue"
                                :options="{animate: true,total: item.total,color:'#0A73FF'}"
                                style="width:100%;height:5px;"></xui-progress>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const $dictionary = $import("dag/common/dictionary");

import chart1 from "./chart1";
import chart2 from "./chart2";
import chart3 from "./chart3";
import chartMap from "./chartMap";

import Store from "./store";

export default {
    components: {
        IotChart: $import("dag/components/Charts").Component,
    },
    data() {
        return {
            chartOptionsLeft1: [],
            chartOptionsLeft2: {
                alarmDeviceCount: 0,
                deviceCount: 0,
                offlineDeviceCount: 0,
                onlineDeviceCount: 0,
                signalType: 0,
            },
            chartOptionsLeft3: chart3(this, { title: "设备报警量" }),
            chartOptionsBottom1: chart3(this, { title: "日活设备" }),
            chartOptionsBottom2: chart3(this, { title: "每日新增设备" }),
            chartOptionsBottom3: chart3(this, { title: "累计激活设备" }),
            chartOptionsRight1: chart2(this, { title: "接入信号类型" }),
            chartOptionsRight1Items: [],
            chartOptionsRight2: chart3(this, { title: "总设备消息总量" }),
            chartOptionsRight3: [],
            chartOptions1: chart1(this, { title: "日活设备" }),
            chartOptions2: chart2(this, { title: "日活设备" }),
            chartOptions3: chart3(this, { title: "日活设备" }),
            chartOptionsMap: chartMap(this, { title: "日活设备" }),
        };
    },
    methods: {
        refresh() {
            this.refresh_left();
            // this.refresh_left_1();
            // this.refresh_left_2();
            // this.refresh_left_3();

            this.refresh_bottom();
            // this.refresh_bottom_1();
            // this.refresh_bottom_2();
            // this.refresh_bottom_3();

            this.refresh_right();
            // this.refresh_right_1();
            // this.refresh_right_2();
            // this.refresh_right_3();
        },
        refresh_left() {
            Store.statistics("CHART_LEFT").then((res) => {
                this.refresh_left_1(res.left1);
                this.refresh_left_2(res.left2);
                this.refresh_left_3(res.left3);
            });
        },
        refresh_left_1(res) {
            var total = 0;
            if (res.length > 0) {
                total = res[0].deviceCount;
                res.forEach((item) => {
                    item.width = 0;
                });
            }
            if (res.length > 5) {
                res = res.slice(0, 5);
            }
            this.chartOptionsLeft1 = res;
            setTimeout(() => {
                res.forEach((item) => {
                    item.width = (item.deviceCount * 100.0) / total;
                });
            }, 0);
            //地图
            this.chartOptionsMap.setOption.series[0].data = res.map(item=>({
                name :  item.provinceName.replace("省",""),
                value : item.deviceCount
            }));
        },
        refresh_left_2(res) {
            this.chartOptionsLeft2 = res;
            this.chartOptions2.setOption.series[0].data = [
                {
                    value: res.deviceCount - res.onlineDeviceCount,
                    name: "离线",
                    color: "#dedede",
                },
                {
                    value: res.onlineDeviceCount,
                    name: "在线",
                    color: "#0A73FF",
                },
            ];
        },
        refresh_left_3(res) {
            this.chartOptionsLeft3.setOption.xAxis.data = res.map((item) =>
                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
            );
            this.chartOptionsLeft3.setOption.series[0].data = res.map(
                (item) => item.statisticValue
            );
        },
        refresh_bottom() {
            Store.statistics("CHART_BOTTOM").then((res) => {
                this.refresh_bottom_1(res.bottom1);
                this.refresh_bottom_2(res.bottom2);
                this.refresh_bottom_3(res.bottom3);
            });
        },
        refresh_bottom_1(res) {
            this.chartOptionsBottom1.setOption.xAxis.data = res.map((item) =>
                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
            );
            this.chartOptionsBottom1.setOption.series[0].data = res.map(
                (item) => item.statisticValue
            );
        },
        refresh_bottom_2(res) {
            this.chartOptionsBottom2.setOption.xAxis.data = res.map((item) =>
                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
            );
            this.chartOptionsBottom2.setOption.series[0].data = res.map(
                (item) => item.deviceCount
            );
        },
        refresh_bottom_3(res) {
            this.chartOptionsBottom3.setOption.xAxis.data = res.map((item) =>
                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
            );
            this.chartOptionsBottom3.setOption.series[0].data = res.map(
                (item) => item.statisticValue
            );
        },
        refresh_right() {
            Store.statistics("CHART_RIGHT").then((res) => {
                this.refresh_right_1(res.right1);
                this.refresh_right_2(res.right2);
                this.refresh_right_3(res.right3);
            });
        },
        refresh_right_1(res) {
            var total = 0;
            if (res.length > 0) {
                total = res[0].signalCount;
                res.forEach((item) => {
                    item.total = total;
                    item.signal = $dictionary.transcode(
                        "CHANNEL_DATA_TYPE_LABEL",
                        item.signalType
                    );
                });
            }
            this.chartOptionsRight1Items = res;
            var r = 0,
                g = 7 * 16 - 7,
                b = 255;
            this.chartOptionsRight1.setOption.series[0].data = res.map(
                (item) => {
                    r += 25;
                    g += 25;
                    return {
                        value: item.signalCount,
                        name: $dictionary.transcode(
                            "CHANNEL_DATA_TYPE_LABEL",
                            item.signalType
                        ),
                        itemStyle: {
                            color: `#${this.toHex(r)}${this.toHex(
                                g
                            )}${this.toHex(b)}`,
                        },
                    };
                }
            );
        },
        refresh_right_2(res) {
            this.chartOptionsRight2.setOption.xAxis.data = res.map((item) =>
                Sunset.Dates.format(item.addTime, "yyyy-MM-dd")
            );
            this.chartOptionsRight2.setOption.series[0].data = res.map(
                (item) => item.statisticValue
            );
        },
        refresh_right_3(res) {
            var total = 0;
            if (res.length > 0) {
                total = res[0].statisticValue;
                res.forEach((item) => {
                    item.total = total;
                });
            }
            this.chartOptionsRight3 = res;
        },
        toHex(v) {
            v = +v;
            if (v > 255) {
                v = 255;
            }
            v = v.toString(16);
            if (v.length == 1) {
                v = "0" + v;
            }
            return v;
        },
    },
    mounted() {
        this.refresh();
    },
};
</script>
<style lang="less">
.screen-container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    background: #000;
    color: #fff;
    .screen-title {
        line-height: 50px;
        font-size: 24px;
        text-align: center;
        flex: 0 0 50px;
        color: #fff;
        background: #000;
    }
    .screen-major {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        & > div {
            box-sizing: border-box;
        }
    }
    .screen-c1 {
        flex: 0 0 24%;
        display: flex;
        flex-direction: column;
        & > div {
            flex-grow: 1;
            height: 33%;
        }
    }
    .screen-c2 {
        flex: 1;
        display: flex;
        flex-direction: column;
        .screen-c2-r1 {
            position: relative;
            flex-grow: 1;
            // background: url(/images/space.png);
            // background-size: cover;
        }
        .screen-c2-r2 {
            flex: 0 0 25%;
            display: flex;
            flex-direction: row;
            & > div {
                flex-grow: 1;
                width: 33.3%;
            }
        }
    }
    .screen-c3 {
        flex: 0 0 19%;
        display: flex;
        flex-direction: column;
        & > div {
            flex-grow: 1;
            height: 25%;
        }
    }
    .screen-panel {
        background: rgba(#0f1418, 1);
        border: 5px solid #000;
        padding: 10px;
        display: flex;
        flex-direction: column;
        .panel-title {
            font-size: 16px;
            color: #fff;
            flex: 0 0 30px;
            &:after {
                content: attr(sub);
                float: right;
                font-size: 12px;
                color: #999;
            }
        }
        .panel-chart {
            flex-grow: 1;
        }
    }
    .screen-chart2-detail {
        flex: 0 0 50px;
        text-align: center;
        & > div {
            display: inline-block;
            padding: 5px 10px;
        }
        label {
            display: block;
            color: #7acdef;
        }
        span {
            padding-top: 5px;
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #0a73ff;
        }
    }
    .screen-progress.xui-progress.xui-progress-line {
        background-color: #272c31;
    }
    .screen-chart3-detail {
        .item-title {
            color: #fff;
            padding: 10px 0px;
        }
    }

    .province-order-item {
        position: relative;
        height: 35px;
        width: calc(100% - 100px);
        margin-left: 50px;
        margin-bottom: 10px;
        line-height: 35px;
        & > div {
            width: 0px;
            transition: width 0.4s ease-in-out;
            height: 100%;
            padding-left: 10px;
            box-sizing: border-box;
            background: linear-gradient(to right, #0a73ff, #75d9fe);
            overflow: visible;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &:before {
            content: attr(index);
            position: absolute;
            top: 0px;
            left: -45px;
            width: 35px;
            height: 35px;
            background: #0a73ff;
            font-size: 18px;
            text-align: center;
            line-height: 35px;
        }
        &:after {
            content: attr(count);
            position: absolute;
            top: 0px;
            right: -60px;
            width: 50px;
            height: 35px;
            font-size: 16px;
            text-align: left;
            line-height: 35px;
        }
    }

    .screen-c3-r1 {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .screen-c3-r1-detail {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
        }
        .screen-c3-r1-c1 {
            display: flex;
            flex-direction: row;
            flex: 0 0 40%;
        }
        .screen-c3-r1-c2 {
            flex-grow: 1;
        }
    }

    .map-chart-summary {
        position: absolute;
        top: 20px;
        left: 10px;
        z-index: 10;
        font-size: 16px;
        & > div {
            border-left: 4px solid #0a73ff;
            padding: 5px 15px;
            margin-bottom:20px;
        }
        color: #72d6fe;
        .summary-title {
            padding-bottom: 10px;
        }
        .summary-value {
            font-size: 30px;
            color: #fff;
            font-weight: bold;
        }
        .summary-unit {
        }
    }
}
</style>