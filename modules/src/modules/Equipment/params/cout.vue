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
        paramsStatus:{}
    },
    watch: {
        params(v) {
            this.$refs.form.reset(
                this.params[`DOChannelPar_${this.channelIndex}`] &&
                    this.params[`DOChannelPar_${this.channelIndex}`].params
            );
            this.refreshCommitTip();
        },
        channelIndex(v) {
            this.$refs.form.reset(
                this.params[`DOChannelPar_${this.channelIndex}`] &&
                    this.params[`DOChannelPar_${this.channelIndex}`].params
            );
            this.refreshCommitTip();
        },
    },
    computed: {
        channel() {
            return `DOChannelPar_${this.channelIndex}`;
        },
    },
    data() {
        return {
            editing: false,
            channelIndex: "0",
            tabOptions: {
                data: [
                    {
                        text: "输出通道1",
                        value: "0",
                    },
                    {
                        text: "输出通道2",
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
            model.ChannelIndex = this.channelIndex;
            var type = `DOChannelPar_${this.channelIndex}`;
            this.$emit("submit", {
                paramsId: this.params[type] && this.params[type].paramsId,
                paramsType: type,
                params: model,
            });
        },
        workingTitle(model, options) {
            var v =
                this.workingParams[`DOChannelPar_${this.channelIndex}`] &&
                this.workingParams[`DOChannelPar_${this.channelIndex}`].params[
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
            var workingParams = this.workingParams[`DOChannelPar_${this.channelIndex}`] &&
                this.workingParams[`DOChannelPar_${this.channelIndex}`].params||{};
            var commitParams = this.params[`DOChannelPar_${this.channelIndex}`] &&
                this.params[`DOChannelPar_${this.channelIndex}`].params||{};
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