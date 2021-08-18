<template>
    <div class="xui-equipmentselector xui-equipmentselector-style">
        <xui-input v-model="inputValue" :options="options" @focus="open"></xui-input>
        <equipment-selector ref="modal" :options="options" @selected="onSelected"></equipment-selector>
    </div>
</template>
<script>
import EquipmentSelector from "./index.vue";

export default {
    components: {
        EquipmentSelector: EquipmentSelector,
    },
    model: {
        prop: "value",
        event: "input",
    },
    props: ["value", "options","model"],
    data() {
        return {
            inputValue: "",
            widgetValue: "",
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
    },
    methods: {
        open() {
            this.$refs.modal.open();
        },
        onSelected(record) {
            this.widgetValue = record.deviceSN;
            this.inputValue = record.deviceSN;
        },
    },
    mounted() {
        this.widgetValue = this.value;
    },
    watch: {
        widgetValue(v) {
            this.$emit("input", v);
        },
        inputValue(v) {
            if (v == "") {
                this.widgetValue = "";
            }
        },
        value(v) {
            var a = this.model;
            this.widgetValue = v;
            if (!v) {
                this.inputValue = "";
            }else{
                this.inputValue = v;
            }
        },
    },
};
</script>
<style lang="less">
</style>