<template>
    <div class="iot-map-container">
        <el-amap ref="map" vid="iot-map" :zooms="zooms" :zoom="zoom" :events="events">
        </el-amap>
    </div>
</template>
<script>
import VueAMap from "vue-amap";
Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
    // 高德的key
    key: "57bcba82e971367ed5372018bf0edf80",
    // 插件集合
    plugin: [
        "AMap.Autocomplete",
        "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        "AMap.ToolBar",
        "AMap.MapType",
        "AMap.PolyEditor",
        "AMap.CircleEditor",
        "AMap.MarkerClusterer",
    ],
    // 高德 sdk 版本，默认为 1.4.4
    v: "1.4.4",
});
export default {
    props: {
        options: {},
    },
    data() {
        return {
            initPromise: null,
            initPromiseResolve: null,
            map: null,
            zoom: 5,
            center: [105.641595, 36.236783],
            cluster: null,
            events: {
                init: (o) => {
                    this.map = o;
                    this.initPromiseResolve && this.initPromiseResolve();
                    this.$emit("inited", o);
                },
                click: (a) => {
                    console.log(a);
                    this.$emit("click", a);
                },
            },
        };
    },
    computed: {
        safaOptions() {
            return this.options || {};
        },
        zooms() {
            return this.safaOptions.zooms || [5, 18];
        },
    },
    methods: {
        inited() {
            if (this.initPromise) {
                return this.initPromise;
            } else {
                return (this.initPromise = new Promise((resolve) => {
                    this.initPromiseResolve = resolve;
                }));
            }
        },
        clear() {
            this.map.clearMap();
        },
        showMarkers(markers, clear) {
            if (clear) {
                this.map.clearMap();
            }
            var markerRegs = markers.map((item) => {
                var m = new AMap.Marker(item);
                if (item.events) {
                    Object.keys(item.events).forEach((ev) => {
                        m.on(ev, item.events[ev], item);
                    });
                }
                return m;
            });
            this.map.add(markerRegs);
            return markerRegs;
        },
        showClusterMarkers(markers, clusterRender) {
            if (this.cluster) {
                this.cluster.setMap(null);
            }
            this.cluster = new AMap.MarkerClusterer(
                this.map,
                this.showMarkers(markers, true),
                {
                    gridSize: 60, // 聚合网格像素大小
                    renderClusterMarker: clusterRender, // 自定义聚合点样式
                }
            );
        },
        openInfoWindow(point, dom) {
            var content = `<div class="iot-map-infowindow">123</div>`;

            // 实现自定义窗体内容，返回拼接后的字符串
            function createInfoWindow(title, content) {
                // 内容拼接 ...
                return content;
            }

            // 创建 infoWindow 实例
            this.map.clearInfoWindow();
            var infoWindow = new AMap.InfoWindow({
                isCustom: true, //使用自定义窗体
                content: createInfoWindow("1234", dom), //传入 dom 对象，或者 html 字符串
                offset: new AMap.Pixel(0, -45),
            });
            infoWindow.open(this.map, point);
        },
        closeInfoWindow() {
            this.map.clearInfoWindow();
        },
    },
    mounted() {
        this.initPromise = new Promise((resolve) => {
            this.initPromiseResolve = resolve;
        });
    },
};
</script>
<style lang="less">
.iot-map-container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    .iot-map-infowindow {
        position: relative;
        min-width: 400px;
        min-height: 200px;
        background: #fff;
        border: 1px solid #dedede;
        &:before {
            content: "";
            position: absolute;
            bottom: -29px;
            left: 50%;
            margin-left: -10px;
            border-style: solid;
            border-width: 15px 10px;
            border-color: transparent;
            border-top-color: #fff;
            z-index: 2;
        }
        &:after {
            content: "";
            position: absolute;
            bottom: -30px;
            left: 50%;
            margin-left: -10px;
            border-style: solid;
            border-width: 15px 10px;
            border-color: transparent;
            border-top-color: #dedede;
            z-index: 1;
        }
    }
}
</style>