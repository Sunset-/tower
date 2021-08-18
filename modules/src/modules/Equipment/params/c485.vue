<template>
    <div class="equipment-params-form">
        <div class="channel-params-box" style="width:1130px;">
            <xui-tabs :options="tabOptions" v-model="channelIndex"></xui-tabs>
            <xui-form ref="form" style="width:1100px;" :options="formOptions" @submit="save"></xui-form>
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
        paramsStatus:{}
    },
    watch: {
        params(v) {
            this.$refs.form.reset(
                this.params[`485ChannelPar_${this.channelIndex}`] &&
                    this.params[`485ChannelPar_${this.channelIndex}`].params
            );
            this.refreshCommitTip();
        },
        channelIndex(v) {
            this.$refs.form.reset(
                this.params[`485ChannelPar_${this.channelIndex}`] &&
                    this.params[`485ChannelPar_${this.channelIndex}`].params
            );
            this.refreshCommitTip();
        },
    },
    computed: {
        channel() {
            return `485ChannelPar_${this.channelIndex}`;
        },
    },
    data() {
        return {
            channelIndex: "0",
            tabOptions: {
                data: [
                    {
                        text: "485通道1",
                        value: "0",
                    },
                    {
                        text: "485通道2",
                        value: "1",
                    },
                    {
                        text: "485通道3",
                        value: "2",
                    },
                    {
                        text: "485通道4",
                        value: "3",
                    },
                    {
                        text: "485通道5",
                        value: "4",
                    },
                    {
                        text: "485通道6",
                        value: "5",
                    },
                    {
                        text: "485通道7",
                        value: "6",
                    },
                    {
                        text: "485通道8",
                        value: "7",
                    },
                    {
                        text: "485通道9",
                        value: "8",
                    },
                    {
                        text: "485通道10",
                        value: "9",
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
                cols: 3,
                toolbar: false,
                fields: [
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
                        label: "通信协议",
                        name: "ComProtocol",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
                        data: [{ text: "ModbusRTU", value: "0" }],
                    },
                    {
                        label: "波特率",
                        name: "BaudRate",
                        newline: true,
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            { text: "1200", value: "0" },
                            { text: "2400", value: "1" },
                            { text: "4800", value: "2" },
                            { text: "9600", value: "3" },
                            { text: "19200", value: "4" },
                            { text: "38400", value: "5" },
                            { text: "115200", value: "6" },
                        ],
                    },
                    {
                        label: "数据位",
                        name: "WordLen",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            { text: "7", value: "0" },
                            { text: "8", value: "1" },
                        ],
                    },
                    {
                        label: "校验位",
                        name: "Parity",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            { text: "None", value: "0" },
                            { text: "Odd", value: "1" },
                            { text: "Even", value: "2" },
                        ],
                    },
                    {
                        label: "停止位",
                        name: "StopBits",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
                        data: [
                            { text: "1", value: "0" },
                            { text: "2", value: "1" },
                        ],
                    },
                    {
                        label: "从机地址",
                        placeholder: "从机地址",
                        name: "SlaveAddr",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
                    },
                    {
                        label: "功能码",
                        name: "FunCode",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        data: [
                            { text: "01", value: "0" },
                            { text: "02", value: "1" },
                            { text: "03", value: "2" },
                        ],
                    },
                    {
                        label: "寄存器地址",
                        name: "RegisterAddr",
                        widget: "input",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                    },

                    {
                        label: "寄存器类型",
                        name: "RegisterType",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
                        data: [
                            { text: "Long AB CD", value: "0" },
                            { text: "Long CD AB", value: "1" },
                            { text: "Long BA DC", value: "2" },
                            { text: "Long DC BA", value: "3" },
                            { text: "Float AB CD", value: "4" },
                            { text: "Float CD AB", value: "5" },
                            { text: "Float BA DC", value: "6" },
                            { text: "Float DC BA", value: "7" },
                            { text: "Short AB", value: "8" },
                            { text: "Short BA", value: "9" },
                        ],
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
                        newline: true,
                    },
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
            var type = `485ChannelPar_${this.channelIndex}`;
            this.$emit("submit", {
                paramsId: this.params[type] && this.params[type].paramsId,
                paramsType: type,
                params: model,
            });
        },
        workingTitle(model, options) {
            var v =
                this.workingParams[`485ChannelPar_${this.channelIndex}`] &&
                this.workingParams[`485ChannelPar_${this.channelIndex}`].params[
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
            var workingParams = this.workingParams[`485ChannelPar_${this.channelIndex}`] &&
                this.workingParams[`485ChannelPar_${this.channelIndex}`].params||{};
            var commitParams = this.params[`485ChannelPar_${this.channelIndex}`] &&
                this.params[`485ChannelPar_${this.channelIndex}`].params||{};
            this.formOptions.fields.forEach(f=>{
                if(workingParams[f.name]!=commitParams[f.name]){
                    f.colClass = "uncommit-tip";
                }else{
                    f.colClass = '';
                }
            })
        },
    },
};
</script>