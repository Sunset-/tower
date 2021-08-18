<template>
    <div class="xui-triple xui-triple-style">
        <table class="xui-triple-table">
            <thead>
                <tr>
                    <th class="text-center" style="width:60px;">ProductKey</th>
                    <th class="text-center">DeviceName</th>
                    <th class="text-center">DeviceSecret</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">
                        <xui-input style="width:120px;" v-model="v1"></xui-input>
                    </td>
                    <td class="text-center">
                        <xui-input style="width:120px;" v-model="v2"></xui-input>
                    </td>
                    <td class="text-center">
                        <xui-input style="width:120px;" v-model="v3"></xui-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props: {
        options: {
            type: Object,
        },
        value: {},
        model: {},
    },
    data() {
        return {
            v1: "",
            v2: "",
            v3: "",
        };
    },
    methods: {},
    watch: {
        v1() {
            this.$emit("input", `${this.v1},${this.v2},${this.v3}`);
        },
        v2() {
            this.$emit("input", `${this.v1},${this.v2},${this.v3}`);
        },
        v3() {
            this.$emit("input", `${this.v1},${this.v2},${this.v3}`);
        },
        value(v) {
            if (v) {
                try {
                    var vs = v.split(",");
                    this.v1 = vs[0] || "";
                    this.v2 = vs[1] || "";
                    this.v3 = vs[2] || "";
                } catch (e) {
                    this.v1 = "";
                    this.v2 = "";
                    this.v3 = "";
                }
            } else {
                this.v1 = "";
                this.v2 = "";
                this.v3 = "";
            }
        },
    },
};
</script>
<style lang="less">
.xui-triple {
    .xui-triple-table {
        width: 200px;
        border: 1px solid #cdcdcd;
        th {
            height: 30px;
            line-height: 30px;
            font-weight: bold;
        }
        th,
        td {
            border: 1px solid #cdcdcd;
        }
    }
    .widget-td {
        &.invalid {
            background: rgba(red, 0.3);
        }
    }
}
</style>