<template>
    <div class="device-circle" :style="circleStyle">
        <div class="device-circle-hand" :style="handStyle">
            <div class="device-circle-point" :style="pointStyle"></div>
            <div class="device-circle-tail" :style="tailStyle"></div>
        </div>
        <div
            :class="[
                'device-circle-center',
                selected == data ? 'selected' : '',
            ]"
        >
            <div class="device-circle-label" @click="selectEq">
                {{ data.deviceName }}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        basePoint: {},
        data: {},
        selected: {},
    },
    computed: {
        circleStyle() {
            var r = this.data.l;
            var left = this.data.x - this.basePoint.minX;
            var top = this.data.y - this.basePoint.minY;
            return `width:${(r * 2) / this.basePoint.ratio}px;height:${
                (r * 2) / this.basePoint.ratio
            }px;top:${top / this.basePoint.ratio}px;left:${
                left / this.basePoint.ratio
            }px;`;
        },
        handStyle() {
            return `width:${
                this.data.l / this.basePoint.ratio
            }px;transform:translate(0,-1px) rotate(${this.data.r}deg);`;
        },
        pointStyle() {
            return `left:${this.data.f / this.basePoint.ratio}px;`;
        },
        tailStyle() {
            return `width:${this.data.t / this.basePoint.ratio}px;`;
        },
    },
    methods: {
        selectEq() {
            this.$emit("selected", this.data);
        },
    },
};
</script>
<style lang="less">
.device-circle {
    position: absolute;
    border-radius: 10000px;
    border: 2px dashed green;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    .device-circle-hand {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 2px;
        background: #fff;
        transform-origin: left;
        transition: all 0.3s ease;
        .device-circle-point {
            position: absolute;
            height: 4px;
            width: 4px;
            background: red;
            border-radius: 10px;
            margin-left: -1px;
            margin-top: -1px;
            transition: all 0.3s ease;
        }
        .device-circle-tail {
            position: absolute;
            height: 2px;
            right: 100%;
            background: #fff;
        }
    }
    .device-circle-center {
        position: absolute;
        height: 4px;
        width: 4px;
        left: 50%;
        top: 50%;
        border-radius: 10px;
        margin-left: -2px;
        margin-top: -2px;
        background: red;
        .device-circle-label {
            position: absolute;
            top: -20px;
            left: -5px;
            font-size: 12px;
            padding: 4px;
            background: rgba(20, 20, 20, 0.6);
            color: #fff;
            cursor: pointer;
            white-space: nowrap;
            border-radius: 2px;
            z-index: 20;
            &:hover {
                background: rgba(20, 20, 20, 1);
            }
        }
        &.selected {
            .device-circle-label {
                background: rgba(240, 20, 20, 0.6);
            }
        }
    }
}
</style>