<template>
    <div class="MODULE-CONTAINER MODULE-Home">
        <div class="MODULE-MAJOR-CONTENT Home-content">
            <div class="home-charts">
                <div class="head-summary">
                    <div class="summary-icon" style="background: #4c9cff">
                        <img src="/images/home/summary_1.png" alt="" />
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">设备总数</div>
                        <div class="summary-total" style="color: #4c9cff">
                            {{ summary.deviceCount }}
                        </div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>{{ summary.towerCount }}</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>{{ summary.lifterCount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="head-summary">
                    <div class="summary-icon">
                        <img src="/images/home/summary_2.png" alt="" />
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">在线总数</div>
                        <div class="summary-total" style="color: #4dd487">
                            {{ summary.onlineDeviceCount }}
                        </div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>{{
                                    summary.onlineTowerDeviceCount
                                }}</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>{{
                                    summary.onlineLifterDeviceCount
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="head-summary">
                    <div class="summary-icon">
                        <img src="/images/home/summary_3.png" alt="" />
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">今日装载次数</div>
                        <div class="summary-total" style="color: #ffbf00">
                            {{ summary.loadingCount }}
                        </div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>{{
                                    summary.loadingTowerDeviceCount
                                }}</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>{{
                                    summary.loadingLifterDeviceCount
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="head-summary">
                    <div class="summary-icon">
                        <img src="/images/home/summary_4.png" alt="" />
                    </div>
                    <div class="summary-info">
                        <div class="summary-title">今日违规次数</div>
                        <div class="summary-total" style="color: #ee5048">
                            {{ summary.getOutLineCount }}
                        </div>
                        <div class="summary-detail">
                            <div>
                                <label>塔机</label>
                                <span>{{
                                    summary.getOutLineCountTowerDeviceCount
                                }}</span>
                            </div>
                            <div>
                                <label>升降机</label>
                                <span>{{
                                    summary.getOutLineCountLifterDeviceCount
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home-major">
                <xui-filter
                    :options="filterOptions"
                    @filter="search"
                    style="display: block; background: #fff; padding-left: 10px"
                >
                </xui-filter>
                <div class="home-major-content" v-show="viewMode == 'MAP'">
                    <iot-map ref="map" @inited="showMarkers()"></iot-map>
                </div>
            </div>
        </div>
        <device-card
            ref="infowindow"
            v-show="isShowInfoWindow"
            class="iot-map-infowindow"
            :closeable="true"
            :data="currentDeviceData"
            @close="closeInfoWindow()"
        ></device-card>
    </div>
</template>
<script>
const $dictionary = $import("dag/common/dictionary");

import Store from "./store";
import DeviceCard from "./card";

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
            currentRecords: [],
            summary: {
                deviceCount: 0,
                getOutLineCount: 0,
                getOutLineCountLifterDeviceCount: 0,
                getOutLineCountTowerDeviceCount: 0,
                lifterCount: 0,
                loadingCount: 0,
                loadingLifterDeviceCount: 0,
                loadingTowerDeviceCount: 0,
                onlineDeviceCount: 0,
                onlineLifterDeviceCount: 0,
                onlineTowerDeviceCount: 0,
                towerCount: 0,
            },
        };
    },
    methods: {
        refresh() {
            Store.summary().then((res) => {
                Object.assign(this.summary, res || {});
            });
        },
        search(filter) {
            Store.list(filter).then((res) => {
                this.showMarkers((this.currentRecords = res));
            });
        },
        showMarkers(records) {
            var points = records
                .filter((item) => item.lng && item.lat)
                .map((item) => ({
                    extData: item,
                    position: [item.lng, item.lat],
                    content: `
                    <div class="label-info-marker" title="${item.deviceName}"><i class="device-map-icon xui-icon xui-icon-homepage_fill"></i></div>`,
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
                div {
                    display: inline-block;
                    vertical-align: middle;
                    width: 50%;
                    font-size: 14px;
                }
                label {
                    padding-right: 5px;
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
            top: 50px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            overflow-y: auto;
            background: #fff;
            border-top: 1px solid #dcdcdc;
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
        font-size: 17px;
        position: relative;
        left: -1px;
        top: -1px;
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