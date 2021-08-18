<template>
    <div class="equipment-params-form">
        <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
        <params-lastcmd :params="params.DevBasePar" :status="paramsStatus['DevBasePar']"
            :workingParams="workingParams.DevBasePar"></params-lastcmd>
        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
    </div>
</template>
<script>
import ParamsLastcmd from "./lastcmd.vue";
const $dictionary = $import("dag/common/dictionary");

export default {
    components: {
        ParamsLastcmd,
    },
    props: {
        params: {},
        workingParams: {},
        beforeImportParams: {},
        paramsStatus: {},
    },
    watch: {
        params(v) {
            this.$refs.form.reset(v.DevBasePar && v.DevBasePar.params);
            this.refreshCommitTip();
        },
    },
    data() {
        return {
            toolbarOptions: [
                {
                    label: "保存",
                    color: "success",
                    operate: () => {
                        this.$refs.form.submit();
                    },
                },
            ],
            formOptions: {
                cols: 2,
                toolbar: false,
                fields: [
                    {
                        label: "设备SN",
                        name: "SN",
                        widget: "input",
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        disabled: true,
                    },
                    {
                        label: "设备类型",
                        name: "DevType",
                        widget: "select",
                        data: [
                            {
                                text: "网关",
                                value: "0",
                            },
                            {
                                text: "智能互感器",
                                value: "1",
                            },
                        ],
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        disabled: true,
                    },
                    {
                        label: "CCID",
                        name: "CCID",
                        widget: "input",
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        disabled: true,
                    },
                    {
                        label: "IMEI",
                        name: "IMEI",
                        widget: "input",
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        disabled: true,
                    },
                    {
                        label: "软件版本",
                        name: "FirmwareVersion",
                        widget: "input",
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        disabled: true,
                    },
                    {
                        label: "硬件版本",
                        name: "HardwareVersion",
                        widget: "input",
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        disabled: true,
                    },
                    {
                        label: "数据格式",
                        name: "DataFormat",
                        widget: "select",
                        tip: (v, model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        data: [
                            { text: "Ali_Json", value: "0" },
                            { text: "LWM2M", value: "1" },
                            { text: "Http", value: "2" },
                        ],
                    },
                    {
                        label: "采样频率",
                        name: "SamplingInterval",
                        widget: "select",
                        tip: (v, model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        newline: true,
                        data: [
                            { text: "1分钟", value: "0" },
                            { text: "5分钟", value: "1" },
                            { text: "10分钟", value: "2" },
                            { text: "15分钟", value: "3" },
                            { text: "30分钟", value: "4" },
                            { text: "1小时", value: "5" },
                            { text: "2小时", value: "6" },
                            { text: "6小时", value: "7" },
                            { text: "24小时", value: "8" },
                            { text: "48小时", value: "9" },
                            { text: "72小时", value: "10" },
                        ],
                        validateDependent: "SendingInterval",
                        validate: {
                            func: {
                                message: "采样频率必须大于等于发送频率",
                                rule: (v, m) => {
                                    if (m.SendingInterval) {
                                        if (+v > +m.SendingInterval) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        label: "发送频率",
                        name: "SendingInterval",
                        widget: "select",
                        tip: (v, model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        data: [
                            { text: "1分钟", value: "0" },
                            { text: "5分钟", value: "1" },
                            { text: "10分钟", value: "2" },
                            { text: "15分钟", value: "3" },
                            { text: "30分钟", value: "4" },
                            { text: "1小时", value: "5" },
                            { text: "2小时", value: "6" },
                            { text: "6小时", value: "7" },
                            { text: "24小时", value: "8" },
                            { text: "48小时", value: "9" },
                            { text: "72小时", value: "10" },
                        ],
                    },
                    {
                        label: "本地历史记录",
                        name: "LocalRecord",
                        widget: "radio",
                        tip: (model, options) => {
                            return this.tipChange(model, options);
                        },
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        data: [
                            { text: "不保存", value: "0" },
                            { text: "保存", value: "1" },
                        ],
                    },
                ],
                cast(model) {
                    Object.keys(model).forEach((k) => {
                        if (!isNaN(model[k])) {
                            model[k] = model[k] + "";
                        }
                    });
                },
            },
        };
    },
    methods: {
        save(model) {
            this.$emit("submit", {
                paramsId:
                    this.params.DevBasePar && this.params.DevBasePar.paramsId,
                paramsType: "DevBasePar",
                params: model,
            });
        },
        workingTitle(model, options) {
            var v =
                this.workingParams[`DevBasePar`] &&
                this.workingParams[`DevBasePar`].params[options.name];
            if (options.data) {
                var t = options.data.filter((item) => item.value == v)[0];
                v = t ? t.text : v;
            }
            return "当前值：" + (v || "");
        },
        refreshCommitTip() {
            var workingParams =
                (this.workingParams[`DevBasePar`] &&
                    this.workingParams[`DevBasePar`].params) ||
                {};
            var commitParams =
                (this.params[`DevBasePar`] &&
                    this.params[`DevBasePar`].params) ||
                {};
            this.formOptions.fields.forEach((f) => {
                if (workingParams[f.name] != commitParams[f.name]) {
                    f.colClass = "uncommit-tip";
                } else {
                    f.colClass = "";
                }
            });
        },
        tipChange(model, options) {
            if (!this.beforeImportParams) {
                return "";
            }
            var v =
                this.beforeImportParams[`DevBasePar`] &&
                this.beforeImportParams[`DevBasePar`].params[options.name];
            var cv =
                this.params[`DevBasePar`] &&
                this.params[`DevBasePar`].params[options.name];
            if (v === cv) {
                return "";
            }
            if (options.enum) {
                v = $dictionary.trancode(options.enum, v);
                cv = $dictionary.trancode(options.enum, cv);
            }
            if (options.data) {
                var dm = options.data.reduce((res, item) => {
                    res[item.value] = item.text;
                    return res;
                }, {});
                v = dm[v];
                cv = dm[cv];
            }
            return `*${v || ""}--->${cv || ""}`;
        },
    },
};
</script>