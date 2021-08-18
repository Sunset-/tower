<template>
    <xui-modal ref="modal" title="设备动画查看" width="1200">
        <div class="device-animate-container">
            <device-circle v-for="(item,index) in items" :key="index" :basePoint="basePoint" :data="item">
            </device-circle>
        </div>
    </xui-modal>
</template>
<script>
import circle from "./circle.vue";

export default {
    components: {
        DeviceCircle: circle,
    },
    data() {
        return {
            items: [
                {
                    x: 50,
                    y: 50,
                    l: 80,
                    t: 10,
                    f: 40,
                    r: 90,
                },
                {
                    x: 250,
                    y: 250,
                    l: 120,
                    t: 30,
                    f: 70,
                    r: 30,
                },
                {
                    x: 340,
                    y: 140,
                    l: 90,
                    t: 10,
                    f: 40,
                    r: 50,
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
        open() {
            this.$refs.modal.open();
        },
    },
};
</script>
<style lang="less">
.device-animate-container {
    height: 700px;
    position: relative;
    background: #141e27;
    border: 20px solid #141e27;
}
</style>