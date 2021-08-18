<template>
    <div class="equipment-params-form">
        <div class="channel-params-box" style="width:1130px;">
            <xui-form ref="form" style="width:1100px;" :options="formOptions" @submit="save"></xui-form>
        </div>
        <params-lastcmd :params="params['ChannelPar']" :status="paramsStatus['ChannelPar']" :workingParams="workingParams['ChannelPar']">
        </params-lastcmd>
        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
    </div>
</template>
<script>
import ParamsLastcmd from "./lastcmd.vue";

export default {
    components: {
        ParamsLastcmd,
    },
    props: {
        params: {},
        workingParams: {},
        paramsStatus: {},
    },
    watch: {
        params(v) {
            this.$refs.form.reset(
                this.params[`ChannelPar`] &&
                    this.params[`ChannelPar`].params
            );
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
                cols: 3,
                toolbar: false,
                fields: [
                    {
                        label: "温度下限",
                        placeholder: "请输入温度下限",
                        name: "T_LimitDown",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                    },
                    {
                        label: "温度上限",
                        placeholder: "请输入温度上限",
                        name: "T_LimitUp",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        validateDependent: "T_LimitDown",
                        validate: {
                            func: {
                                message: "温度上限必须大于温度下限",
                                rule: (v, m) => {
                                    if (m.T_LimitDown && +m.T_LimitDown) {
                                        if (+v <= +m.T_LimitDown) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        label: "电流1下限",
                        placeholder: "请输入电流1下限",
                        name: "A1_LimitDown",
                        widget: "input",
                        newline: true,
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                    },
                    {
                        label: "电流1上限",
                        placeholder: "请输入电流1上限",
                        name: "A1_LimitUp",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        validateDependent: "A1_LimitDown",
                        validate: {
                            func: {
                                message: "电流1上限必须大于电流1下限",
                                rule: (v, m) => {
                                    if (m.A1_LimitDown && +m.A1_LimitDown) {
                                        if (+v <= +m.A1_LimitDown) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        label: "电流2下限",
                        placeholder: "请输入电流2下限",
                        name: "A2_LimitDown",
                        widget: "input",
                        newline: true,
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                    },
                    {
                        label: "电流2上限",
                        placeholder: "请输入电流2上限",
                        name: "A2_LimitUp",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        validateDependent: "A2_LimitDown",
                        validate: {
                            func: {
                                message: "电流2上限必须大于电流2下限",
                                rule: (v, m) => {
                                    if (m.A2_LimitDown && +m.A2_LimitDown) {
                                        if (+v <= +m.A2_LimitDown) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },

                    {
                        label: "告警开关",
                        name: "AlarmSwitch",
                        widget: "checkbox",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass: "",
                        manner: "alarm-switch",
                        bit: true,
                        data: [
                            {
                                text: "温度下限告警",
                                value: "1",
                            },
                            {
                                text: "温度上限告警",
                                value: "2",
                            },
                            {
                                text: "电流1下限告警",
                                value: "4",
                            },
                            {
                                text: "电流1上限告警",
                                value: "8",
                            },
                            {
                                text: "电流2下限告警",
                                value: "16",
                            },
                            {
                                text: "电流2上限告警",
                                value: "32",
                            },
                        ],
                        monopolize: true,
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
            Object.keys(model).forEach((k) => {
                if (!isNaN(model[k])) {
                    model[k] = +model[k];
                }
            });
            var type = `ChannelPar`;
            this.$emit("submit", {
                paramsId: this.params[type] && this.params[type].paramsId,
                paramsType: type,
                params: model,
            });
        },
        workingTitle(model, options) {
            var v =
                this.workingParams[`ChannelPar`] &&
                this.workingParams[`ChannelPar`].params[options.name];
            if (options.data) {
                var t = options.data.filter((item) => item.value == v)[0];
                v = t ? t.text : v;
            }
            if (v === "undefined") {
                v = "";
            }
            return "当前值：" + v;
        },
        refreshCommitTip() {
            var workingParams =
                (this.workingParams[`ChannelPar`] &&
                    this.workingParams[`ChannelPar`].params) ||
                {};
            var commitParams =
                (this.params[`ChannelPar`] &&
                    this.params[`ChannelPar`].params) ||
                {};
            this.formOptions.fields.forEach((f) => {
                if (workingParams[f.name] != commitParams[f.name]) {
                    f.colClass = "uncommit-tip";
                } else {
                    f.colClass = "";
                }
            });
        },
    },
};
</script>