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
            prjectMap: {},
            currentSelectProject: null,
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
            this.currentSelectProject = record;
            this.widgetValue = `${record.projectId},${record.projectName}`;
            this.inputValue = record.projectName;
        },
        loadData() {
            return Object.keys(this.prjectMap) > 0
                ? Promise.resolve(this.prjectMap)
                : Store.list({
                      pageIndex: 1,
                      pageSize: 9999,
                  }).then((res) => {
                      this.prjectMap =
                          (res &&
                              res.list &&
                              res.list.reduce((res, item) => {
                                  res[item.projectId] = item;
                                  return res;
                              }, {})) ||
                          {};
                      return this.prjectMap;
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
                this.inputValue = this.currentSelectProject
                    ? this.currentSelectProject.projectName
                    : this.model.projectName;
            }
        },
    },
};
</script>
<style lang="less">
</style>