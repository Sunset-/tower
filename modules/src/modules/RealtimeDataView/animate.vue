<template>
    <xui-modal
        ref="modal"
        class="device-animate-modal"
        title="设备动画查看"
        width="1240"
    >
        <div class="device-animate-container">
            <device-circle
                v-for="(item, index) in items"
                :key="index"
                :basePoint="basePoint"
                :data="item"
                :selected="selected"
                @selected="selectEq"
            >
            </device-circle>
        </div>
        <div class="device-animate-info">
            <div>
                <div class="info-header">塔机详参</div>
                <div class="info-item" v-for="info in infos" :key="info.name">
                    <div class="info-item-label">{{ info.name }}</div>
                    <div class="info-item-value">
                        {{ info.value(selected) }}
                    </div>
                </div>
            </div>
        </div>
    </xui-modal>
</template>
<script>
import circle from "./circle.vue";
import Store from "./store";

const $dictionary = $import("dag/common/dictionary");

export default {
    components: {
        DeviceCircle: circle,
    },
    data() {
        return {
            selected: {},
            items: [],
            infos: [
                {
                    name: "塔机名称",
                    value(eq) {
                        return eq.deviceName;
                    },
                },
                {
                    name: "设备编号",
                    value(eq) {
                        return eq.deviceNo;
                    },
                },
                {
                    name: "记录时间",
                    value(eq) {
                        return Sunset.Dates.format(eq.addTime);
                    },
                },
                {
                    name: "在线状态",
                    value(eq) {
                        return $dictionary.transcode(
                            "DEVICE_STATUS",
                            eq.$realData && eq.$realData.deviceStatus
                        );
                    },
                },
                {
                    name: "塔机类型",
                    value(eq) {
                        return $dictionary.transcode(
                            "DEVICE_TYPE",
                            eq.$realData && eq.$realData.deviceType
                        );
                    },
                },
                {
                    name: "ByPass",
                    value(eq) {
                        return 0;
                    },
                },
                {
                    name: "回转角度(°)",
                    value(eq) {
                        return eq.$realData && eq.$realData.gyration;
                    },
                },
                {
                    name: "幅度",
                    value(eq) {
                        return eq.$realData && eq.$realData.amplitude;
                    },
                },
                {
                    name: "吊钩高度(m)",
                    value(eq) {
                        return eq.$realData && eq.$realData.height;
                    },
                },
                {
                    name: "起重臂(m)",
                    value(eq) {
                        return eq.armLength;
                    },
                },
                {
                    name: "平衡臂(m)",
                    value(eq) {
                        return eq.rearBridgeLong;
                    },
                },
                {
                    name: "报警信息",
                    value(eq) {
                        return eq.$realData && eq.$realData.alarmcode;
                    },
                },
            ],
        };
    },
    computed: {
        basePoint() {
            var minX = null,
                minY = null,
                maxX = null,
                maxY = null;
            this.items.forEach((item) => {
                var x1 = item.x - item.l;
                var y1 = item.y - item.l;
                var x2 = item.x + item.l;
                var y2 = item.y + item.l;
                if (minX == null) {
                    minX = x1;
                    minY = y1;
                    maxX = x2;
                    maxY = y2;
                } else {
                    minX = Math.min(minX, x1);
                    minY = Math.min(minY, y1);
                    maxX = Math.max(maxX, x2);
                    maxY = Math.max(maxY, y2);
                }
            });
            return {
                minX,
                minY,
                maxX,
                maxY,
                ratio: Math.max((maxX - minX) / 1200.0, (maxY - minY) / 700.0),
            };
        },
    },
    methods: {
        open(projectId) {
            Promise.all([
                Store.eqList({
                    projectId,
                }),
                Store.list({
                    projectId,
                    pageIndex: 1,
                    pageSize: 9999,
                }),
            ]).then(([eqs, datas]) => {
                var eqMap = {};
                eqs.forEach((item) => {
                    eqMap[item.deviceSN] = item;
                    item.x = item.xLine;
                    item.y = item.yLine;
                    item.l = item.armLength;
                    item.t = item.rearBridgeLong;
                });
                datas.list.forEach((item) => {
                    if (eqMap[item.deviceSN]) {
                        eqMap[item.deviceSN].f = item.amplitude;
                        eqMap[item.deviceSN].r = item.dipAngle || 0;
                        eqMap[item.deviceSN].$realData = item;
                    }
                });
                this.items = eqs;
                if (eqs.length > 0) {
                    this.selectEq(eqs[0]);
                }
                this.$refs.modal.open();
            });
        },
        selectEq(eq) {
            this.selected = eq;
        },
    },
};
</script>
<style lang="less">
.device-animate-modal {
    .xui-modal-content {
        font-size: 0px;
        position: relative;
    }
}
.device-animate-container {
    height: 700px;
    width: calc(100% - 440px);
    position: relative;
    background: #141e27;
    border: 20px solid #141e27;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
}
.device-animate-info {
    position: absolute;
    width: 400px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    font-size: 14px;
    padding: 5px;
    box-sizing: border-box;
    background: #141e27;
    .info-header {
        text-align: center;
        padding: 10px 0px;
        background: #1890ff;
        color: yellow;
        border-radius: 4px 4px 0px 0px;
    }
    .info-item {
        line-height: 35px;
        background: #1c2937;
        color: #fff;
        box-sizing: border-box;

        padding: 0px 10px;
        .info-item-label {
            display: inline-block;
            vertical-align: middle;
            width: 180px;
        }
        .info-item-value {
            display: inline-block;
            vertical-align: middle;
        }
        &:nth-child(odd) {
            background: #1b3548;
        }
        &:not(:last-child) {
            border-bottom: 1px solid #656565;
        }
        &:last-child {
            border-radius: 0px 0px 4px 4px;
        }
    }
}
</style>