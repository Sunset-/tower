<template>
    <div>
        <xui-form ref="form" :view="view" :options="formOptions" @submit="save"></xui-form>
        <xui-toolbar :options="toolbarOptions" style="padding:20px;display:block;text-align:center;"></xui-toolbar>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const Dictioanry = $import("dag/modules/Dictionary");

export default {
    props: {
        currentModel: {},
    },
    data() {
        return {
            view: true,
            rawModel: {},
            formOptions: {
                cols: 4,
                fields: [
                    {
                        group: "证券信息",
                        label: "股票代码",
                        name: "code",
                        widget: "input",
                        placeholder: "请输入股票代码",
                    },
                    {
                        label: "股票简称",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入股票简称",
                    },
                    {
                        label: "揭露日",
                        name: "disclosureDate",
                        widget: "input",
                        placeholder: "请输入揭露日",
                    },
                    {
                        label: "揭露时间",
                        name: "disclosureTime",
                        widget: "input",
                        placeholder: "请输入揭露时间",
                    },
                    {
                        label: "实施日",
                        name: "implementationDate",
                        widget: "input",
                        placeholder: "请输入实施日",
                    },
                    {
                        label: "基准日",
                        name: "baseDate",
                        widget: "input",
                        placeholder: "请输入基准日",
                    },
                    {
                        label: "基准价",
                        name: "basePrice",
                        widget: "input",
                        placeholder: "请输入基准价",
                    },
                    {
                        label: "诉讼时效",
                        name: "actionLimitation",
                        widget: "input",
                        placeholder: "请输入诉讼时效",
                    },
                    {
                        label: "历史简称",
                        name: "historyNames",
                        widget: "textarea",
                        monopolize: true,
                        placeholder: "请输入历史简称，多个用逗号分隔",
                    },
                    {
                        label: "备注",
                        name: "remark",
                        widget: "textarea",
                        monopolize: true,
                        placeholder: "请输入备注",
                    },
                    {
                        group: "诉讼信息",
                        label: "受理法院",
                        name: "court",
                        widget: "input",
                        placeholder: "请输入受理法院名称",
                    },
                    {
                        label: "损失计算方法",
                        name: "calculateStrategy",
                        widget: "select",
                        placeholder: "请选择损失计算方法",
                        enum: "SECURITIE_CALCULATE_STRATEGY",
                    },
                ],
                format(model) {
                    if (model.historyNames) {
                        model.historyNames = model.historyNames
                            .replace(/，/g, ",")
                            .trim();
                    }
                },
                toolbar: false,
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "编辑",
                        color: "primary",
                        premise: () => {
                            return this.view;
                        },
                        operate: () => {
                            this.$refs.form.reset(this.currentModel);
                            this.view = false;
                        },
                    },
                    {
                        label: "保存",
                        color: "primary",
                        premise: () => {
                            return !this.view;
                        },
                        operate: () => {
                            this.$refs.form.submit();
                        },
                    },
                    {
                        label: "取消",
                        color: "",
                        premise: () => {
                            return !this.view;
                        },
                        operate: () => {
                            this.$refs.form.reset(this.currentModel);
                            this.view = true;
                        },
                    },
                ],
            },
        };
    },
    watch: {
        currentModel(model) {
            this.initModel(model);
        },
    },
    methods: {
        initModel(model) {
            this.$refs.form.reset(model);
            this.view = true;
        },
        save(model) {
            Store.save(model).then((res) => {
                $tip("保存成功", "success");
                this.$emit("refresh");
            });
        },
    },
};
</script>