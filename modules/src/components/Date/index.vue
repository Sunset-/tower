<template>
    <div class="xui-date xui-date-style">
        <el-date-picker v-model="widgetValue" :type="safeOptions.type||'date'" placeholder="选择日期"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
       format="yyyy 年 MM 月 dd 日" value-format="timestamp">
        </el-date-picker>
    </div>
</template>
<script>
import { DatePicker } from "element-ui";

export default {
    components: {
        elementDatePicker: DatePicker,
    },
    model: {
        prop: "value",
        event: "input",
    },
    props: ["value", "options"],
    data() {
        return {
            widgetValue: "",
        };
    },
    computed: {
        safeOptions() {
            return this.options || {};
        },
        pickerOptions(){
            var po = {};
            if(this.safeOptions.shortcuts){
                po.shortcuts = this.safeOptions.shortcuts;
            }
            return po;
        }
    },
    methods: {},
    mounted() {
        this.widgetValue = this.value;
    },
    watch: {
        widgetValue(v) {
            this.$emit("input", v);
        },
        value(v) {
            this.widgetValue = v;
        },
    },
};
</script>
<style lang="less">
.xui-date {
    display: inline-block;
    vertical-align: bottom;
    .el-date-editor {
        .el-input__inner {
            height: 30px;
            line-height: 30px;
            border-color: #cdcdcd;
        }
        .el-input__icon {
            line-height: 30px;
        }
    }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 240px;
}
</style>
