<template>
    <div class="iot-chart-container" :style="option.style">
        <div class="iot-chart" ref="chart">
        </div>
        <slot></slot>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
    name: "charts",
    data() {
        return {
            charts: "",
        };
    },
    props: {
        option: {
            type: Object,
        },
    },
    mounted() {
        this.drawPie();
    },
    watch: {
        option: {
            deep: true,
            handler() {
                this.refresh();
            },
        },
    },
    methods: {
        dispose() {
            if (this.charts) {
                this.charts = echarts.dispose(this.$refs.chart);
            }
        },
        drawPie() {
            this.charts = echarts.init(this.$refs.chart);
            this.charts.setOption(this.option.setOption);
            const _this = this;
            this.charts.on("mousemove", function (params) {
                _this.$emit("mousemove", params);
            });
            this.charts.on("legendselectchanged", function (params) {
                _this.$emit("legendselectchanged", params);
            });
            window.addEventListener("resize", function () {
                _this.charts && _this.charts.resize();
            });
        },
        refresh() {
            this.charts.setOption(this.option.setOption, true);
        },
        clear(){
            this.charts&&this.charts.clear();
        }
    },
};
</script>
<style lang="less" scoped>
.iot-chart-container {
    position: relative;
    .iot-chart {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }
}
</style>
