<template>
    <div class="equipment-params-form">
        <div class="channel-params-box">
            <xui-tabs :options="tabOptions" v-model="channelIndex"></xui-tabs>
            <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
        </div>
        <params-lastcmd :params="params[channel]" :status="paramsStatus[channel]" :workingParams="workingParams[channel]"></params-lastcmd>
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
                this.params[`AIChannelPar_${this.channelIndex}`] &&
                    this.params[`AIChannelPar_${this.channelIndex}`].params
            );
            this.refreshCommitTip();
        },
        channelIndex(v) {
            this.$refs.form.reset(
                this.params[`AIChannelPar_${this.channelIndex}`] &&
                    this.params[`AIChannelPar_${this.channelIndex}`].params
            );
            this.refreshCommitTip();
        },
    },
    computed: {
        channel() {
            return `AIChannelPar_${this.channelIndex}`;
        },
    },
    data() {
        return {
            channelIndex: "0",
            tabOptions: {
                data: [
                    {
                        text: "模拟通道1",
                        value: "0",
                    },
                    {
                        text: "模拟通道2",
                        value: "1",
                    },
                ],
            },
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
                        label: "信号类型",
                        name: "SignalType",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            { text: "电压(0-5v)", value: "0" },
                            { text: "电压(0-2.5v)", value: "1" },
                            { text: "电压(0.5-4.5v)", value: "2" },
                            { text: "电压(0.5-5v)", value: "3" },
                            { text: "电压(0.25-2.25v)", value: "4" },
                            { text: "电流(0-20ma)", value: "5" },
                            { text: "电流(4-20ma)", value: "6" },
                        ],
                    },
                    {
                        label: "数据类型",
                        name: "ChannelDataFormat",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
                        data: [
                            { text: "无类型", value: "0" },
                            { text: "液位-m", value: "1" },
                            { text: "液位-cm", value: "2" },
                            { text: "压力-Mpa", value: "3" },
                            { text: "压力-Kpa", value: "4" },
                            { text: "温度-℃", value: "5" },
                            { text: "温度℉", value: "6" },
                            { text: "湿度-RH%", value: "7" },
                            { text: "流速-m³/h", value: "8" },
                            { text: "流速-cm³/h", value: "9" },
                            { text: "流量-m³", value: "10" },
                            { text: "流量-cm³", value: "11" },
                            { text: "碱度-PH", value: "12" },
                            { text: "频率-Hz", value: "13" },
                            { text: "频率-kHz", value: "14" },
                            { text: "输入-ON/OF", value: "15" },
                        ],
                    },
                    {
                        label: "显示精度",
                        name: "DisplayAccuracy",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            { text: "无小数", value: "0" },
                            { text: "1位小数", value: "1" },
                            { text: "2位小数", value: "2" },
                            { text: "3位小数", value: "3" },
                        ],
                    },
                    {
                        label: "量程下限",
                        placeholder: "请输入量程下限",
                        name: "RangeDown",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                    },

                    ,
                    {
                        label: "量程上限",
                        placeholder: "请输入量程上限",
                        name: "RangeUp",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        validateDependent: "RangeDown",
                        validate: {
                            func: {
                                message: "量程上限必须大于量程下限",
                                rule: (v, m) => {
                                    if (m.RangeDown && +m.RangeDown) {
                                        if (+v <= +m.RangeDown) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        label: "阈值下限",
                        placeholder: "请输入阈值下限",
                        name: "LimitDown",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                    },

                    ,
                    {
                        label: "阈值上限",
                        placeholder: "请输入阈值上限",
                        name: "LimitUp",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        validateDependent: "LimitDown",
                        validate: {
                            func: {
                                message: "阈值上限必须大于阈值下限",
                                rule: (v, m) => {
                                    if (m.LimitDown && +m.LimitDown) {
                                        if (+v <= +m.LimitDown) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        label: "迁移值K",
                        placeholder: "请输入迁移值K",
                        name: "K",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                    },

                    ,
                    {
                        label: "迁移值B",
                        placeholder: "请输入迁移值B",
                        name: "B",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                    },

                    ,
                    {
                        label: "波动阈值",
                        placeholder: "请输入波动阈值",
                        name: "Wave",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
                    },
                    {
                        label: "告警开关",
                        name: "AlarmSwitch",
                        widget: "checkbox",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        manner: "alarm-switch",
                        bit: true,
                        data: [
                            {
                                text: "阈值下限告警",
                                value: "1",
                            },
                            {
                                text: "阈值上限告警",
                                value: "2",
                            },
                            {
                                text: "波动告警",
                                value: "4",
                            },
                            // {
                            //     text: "DI触发告警",
                            //     value: "8",
                            // },
                            // {
                            //     text: "DI翻转告警",
                            //     value: "16",
                            // },
                        ],
                        monopolize: true,
                    },
                    {
                        label: "供电选项",
                        name: "PowerSwitch",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",

                        data: [
                            {
                                text: "不供电",
                                value: "0",
                            },
                            {
                                text: "常供电",
                                value: "1",
                            },
                            {
                                text: "间歇供电",
                                value: "2",
                            },
                        ],
                    },
                    {
                        label: "供电延迟时间",
                        name: "PowerDelayTim",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        append: "S",
                    },
                    {
                        label: "供电电压",
                        name: "PowerSelect",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            {
                                text: "5V",
                                value: "0",
                            },
                            {
                                text: "12V",
                                value: "1",
                            },
                        ],
                    },
                    {
                        label: "通道使能",
                        name: "ChannelSwitch",
                        widget: "switch",
                        size: "small",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                    },
                ],
                cast(model) {
                    Object.keys(model).forEach((k) => {
                        if (!isNaN(model[k])) {
                            model[k] = model[k] + "";
                        }
                    });
                    console.log("model.ChannelSwitch:" + model.ChannelSwitch);
                    model.ChannelSwitch =
                        model.ChannelSwitch == 0 ? false : true;
                },
                format(model) {
                    model.ChannelSwitch = model.ChannelSwitch ? 1 : 0;
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
            model.ChannelIndex = this.channelIndex;
            var type = `AIChannelPar_${this.channelIndex}`;
            this.$emit("submit", {
                paramsId: this.params[type] && this.params[type].paramsId,
                paramsType: type,
                params: model,
            });
        },
        workingTitle(model, options) {
            var v =
                this.workingParams[`AIChannelPar_${this.channelIndex}`] &&
                this.workingParams[`AIChannelPar_${this.channelIndex}`].params[
                    options.name
                ];
            if (options.data) {
                var t = options.data.filter((item) => item.value == v)[0];
                v = t ? t.text : v;
            }
            if (v === "undefined") {
                v = "";
            }
            return "当前值：" + v;
        },
        refreshCommitTip(){
            var workingParams =
                this.workingParams[`AIChannelPar_${this.channelIndex}`] &&
                this.workingParams[`AIChannelPar_${this.channelIndex}`].params||{};
            var commitParams =
                this.params[`AIChannelPar_${this.channelIndex}`] &&
                this.params[`AIChannelPar_${this.channelIndex}`].params||{};
            this.formOptions.fields.forEach(f=>{
                if(workingParams[f.name]!=commitParams[f.name]){
                    f.colClass = "uncommit-tip";
                }else{
                    f.colClass = '';
                }
            })
        }
    },
};
</script>