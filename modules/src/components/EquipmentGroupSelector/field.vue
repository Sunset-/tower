<template>
    <div class="xui-equipmentselector xui-equipmentselector-style">
        <xui-input v-model="inputValue" :options="options" @focus="open"></xui-input>
        <equipment-selector ref="modal" :options="options" @selected="onSelected"></equipment-selector>
    </div>
</template>
<script>
import EquipmentSelector from "./index.vue";
import Store from "./store";

export default {
    components: {
        EquipmentSelector: EquipmentSelector,
    },
    model: {
        prop: "value",
        event: "input",
    },
    props: ["value", "options", "model"],
    data() {
        return {
            inputValue: "",
            widgetValue: "",
            groupMap: {},
            currentSelectGroup: null,
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
            this.currentSelectGroup = record;
            this.widgetValue = `${record.groupId},${record.groupName}`;
            this.inputValue = record.groupName;
        },
        loadData() {
            return Object.keys(this.groupMap) > 0
                ? Promise.resolve(this.groupMap)
                : Store.list({
                      pageIndex: 1,
                      pageSize: 9999,
                  }).then((res) => {
                      this.groupMap =
                          (res &&
                              res.list &&
                              res.list.reduce((res, item) => {
                                  res[item.groupId] = item;
                                  return res;
                              }, {})) ||
                          {};
                      return this.groupMap;
                  });
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
            this.widgetValue = v;
            if (!v) {
                this.inputValue = "";
            } else {
                this.inputValue = this.currentSelectGroup
                    ? this.currentSelectGroup.groupName
                    : this.model.groupName;
            }
        },
    },
};
</script>
<style lang="less">
</style>