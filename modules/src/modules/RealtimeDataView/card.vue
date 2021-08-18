<template>
    <div class="device-data-card">
        <div class="card-title">
            <span v-if="closeable">设备名称：{{data.deviceName}}</span>
            <span v-if="!closeable">{{data.deviceName}}({{data.deviceSN}})</span>
            <div :class="['device-card-status-wrap',closeable?'closeable':'']" v-html="statusDom">
            </div>
            <i v-if="closeable" class="xui-icon xui-icon-close card-closer" @click="$emit('close')"></i>
        </div>
        <div class="card-content">
            <div v-for="cd in channelData" :key="cd.id" class="card-channel-data" :title="cd.title">
                <span>{{cd.name}}：{{cd.value}}{{cd.unit}}
                    <i :class="`xui-icon xui-icon-arrow-${
                        cd.change == -1? 'down': 'up'
                    } device-datachange-arrow change-${cd.change}`"></i>
                </span>
                <span>{{isNaN(cd.channel)?({
                        "T" :"温度", 
                        "A1" :"电流1", 
                        "A2" :"电流2"
                    }[cd.channel])||cd.channel:`CH${cd.channel}`}}</span>
            </div>
        </div>
        <div class="card-foot">{{data.addTime | time}}
            <span v-if="closeable" :title="`项目：${data.groupName}`" style="float:right;width:250px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">项目：{{data.groupName}}</span>
            <div v-if="!closeable" style="float:right;width:100px;">报警码：
                <i v-if="data.alarmcode==0" :class="{'color-primary':data.alarmcode!='0'}">{{data.alarmcode}}</i>
                <div v-if="data.alarmcode!=0" class="device-alarm-num" :data-alarm="alarmCode" :data-sn="data.deviceSN" :data-name="data.deviceName" style="color:#4487F1;cursor:pointer;display:inline-block;">
                    {{data.alarmcode}}</div>
            </div>
        </div>
    </div>
</template>
<script>
const $tools = $import("dag/common/tools");
const $dictionary = $import("dag/common/dictionary");

var CHANNEL_NAME = [];

export default {
    props: {
        data: {},
        closeable: {},
    },
    computed: {
        statusDom() {
            return `
                ${$tools.generateElectricityDom(this.data.powerpercent)}
                ${$tools.generateCsqDom(this.data.csq)}
            `;
        },
        alarmCode() {
            var alarm = Object.keys(this.data.$showData)
                .filter((k) => k.indexOf("alarmcode") == 0)
                .reduce((res, k) => {
                    res.push(
                        k.replace("alarmcode", "") +
                            ":" +
                            this.data.$showData[k]
                    );
                    return res;
                }, [])
                .join(";");
            return alarm;
        },
        channelData() {
            var data = [];
            var sd = this.data.$showData;
            var channels =
                this.data.deviceType == 2
                    ? ["T", "A1", "A2"]
                    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            if (sd) {
                channels.forEach((i) => {
                    if (sd.hasOwnProperty(`value${i}`)) {
                        var unit = $dictionary.transcode(
                            "CHANNEL_DATA_TYPE_UNIT",
                            sd[`measure${i}`]
                        );

                        var preV = sd[`valuePre${i}`] || "";
                        var curV = sd[`value${i}`] || "";
                        if (unit == "ON/OFF") {
                            unit = "";
                            preV = preV == "1" ? "ON" : "OFF";
                            curV = curV == "1" ? "ON" : "OFF";
                        }

                        data.push({
                            name:
                                $dictionary.transcode(
                                    "CHANNEL_DATA_TYPE_LABEL",
                                    sd[`measure${i}`]
                                ) || "未知参数",
                            channel: i,
                            value: curV,
                            valuePre: sd[`valuePre${i}`],
                            unit: unit,
                            change: sd[`change${i}`],
                            title: `上报时间：${Sunset.Dates.format(
                                +sd[`addTime${i}`]
                            )} 上次值：${preV}${unit}`,
                        });
                    }
                });
            }
            return data;
        },
    },
};
</script>
<style lang="less">
.device-data-card {
    margin: 5px;
    width: calc(25% - 30px);
    min-width: 300px;
    background: #f3f3f3;
    border-radius: 10px;
    padding: 0px 10px;
    color: #555;
    .card-title {
        position: relative;
        padding: 10px 0px;
        border-bottom: 1px solid #d2d2d2;
    }
    .device-card-status-wrap {
        position: absolute;
        right: 0px;
        top: 3px;
        &.closeable {
            right: 25px;
        }
        & > div {
            display: inline-block;
            vertical-align: bottom;
        }
        .device-electricity-icon {
            transform: rotate(90deg);
            margin-right: 5px;
            margin-bottom: -3px;
        }
        .device-csq-icon {
            height: 20px;
        }
    }
    .card-closer {
        position: absolute;
        top: 7px;
        right: 2px;
        cursor: pointer;
        &:hover {
            color: #aaa;
        }
    }
    .card-content {
        height: 200px;
        overflow-y: auto;
        padding: 10px;
        .card-channel-data {
            display: flex;
            justify-content: space-between;
            &:not(:last-child) {
                margin-bottom: 10px;
            }
        }
    }
    .card-foot {
        padding: 10px 0px;
        border-top: 1px solid #d2d2d2;
    }
}
</style>