<template>
    <div class="xui-mapmarker xui-mapmarker-style">
        <div class="show-box">{{value}}</div>
        <div class="marker-trigger" @click="openModal">点击修改地图坐标</div>
        <xui-modal ref="modal" class="xui-mapmarker-modal-wrap" title="地图标注" width="800">
            <div class="xui-mapmarker-modal">
                <div class="xui-mapmarer-mapbox">
                    <iot-map ref="map" @click="mapClick"></iot-map>
                </div>
                <div style="padding:5px 5px 0px 5px;">
                    <span
                        style="display:inline-block;padding:6px 0px 0px 10px;font-size:16px;">经纬度：{{markingLonlat}}</span>
                    <xui-toolbar style="float:right;" :options="toolbarOptions"></xui-toolbar>
                </div>
            </div>
        </xui-modal>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");

export default {
    components: {
        IotMap: $import("dag/components/Map").Component,
    },
    model: {
        prop: "value",
        event: "input",
    },
    props: ["value", "options", "model"],
    data() {
        return {
            markingLonlat: "",
            toolbarOptions: {
                tools: [
                    {
                        label: "确定",
                        color: "success",
                        operate: () => {
                            if (this.markingLonlat == "") {
                                $tip("请点击地图标注", "info");
                                return;
                            }
                            this.$emit(
                                "input",
                                this.markingLonlat.replace(/\s/g, "")
                            );
                            this.$refs.modal.close();
                        },
                    },
                    {
                        label: "取消",
                        color: "info",
                        operate: () => {
                            this.$refs.modal.close();
                        },
                    },
                ],
            },
        };
    },
    methods: {
        openModal() {
            this.$refs.modal.open();
            this.$nextTick(() => {
                this.$refs.map.inited().then(() => {
                    if (this.value) {
                        var vs = this.value.split(",");
                        this.$refs.map.showMarkers(
                            [
                                {
                                    position: [+vs[0], +vs[1]],
                                },
                            ],
                            true
                        );
                    } else {
                        this.$refs.map.clear();
                    }
                });
            });
        },
        mapClick(a) {
            this.markingLonlat = `${a.lnglat.lng} , ${a.lnglat.lat}`;
            this.$refs.map.showMarkers(
                [
                    {
                        position: [a.lnglat.lng, a.lnglat.lat],
                    },
                ],
                true
            );
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";

.xui-mapmarker {
    .show-box {
        height: 30px;
        width: 200px;
        border: 1px solid @color-border;
        border-radius: 4px;
        line-height: 30px;
        padding: 0px 5px;
    }
    .marker-trigger {
        margin-top: 5px;
        color: @color-primary;
        cursor: pointer;
        &:hover {
            color: darken(@color-primary, 15%);
        }
    }
}
.xui-mapmarker-modal-wrap {
    z-index: 9999;
}
.xui-mapmarker-modal {
    width: 800px;
    height: 540px;
    .xui-mapmarer-mapbox {
        height: 500px;
        position: relative;
    }
}
</style>