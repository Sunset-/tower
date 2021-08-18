<template>
    <div class="equipment-params-form">
        <div class="channel-params-box" style="width:1130px;">
            <xui-form ref="form" style="width:1100px;" :options="formOptions" @submit="save"></xui-form>
        </div>
        <params-lastcmd :params="params['485ChannelPowerPar']" :status="paramsStatus['485ChannelPowerPar']" :workingParams="workingParams['485ChannelPowerPar']">
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
        paramsStatus:{}
    },
    watch: {
        params(v) {
            this.$refs.form.reset(
                this.params[`485ChannelPowerPar`] &&
                    this.params[`485ChannelPowerPar`].params
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
                        label: "供电选项",
                        name: "PowerSwitch",
                        widget: "select",
                        title: (model, options) => {
                            return this.workingTitle(model, options);
                        },
                        colClass : "",
                        newline: true,
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
                        newline: true,
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
                ],
                cast(model){
                    Object.keys(model).forEach(k=>{
                        if(!isNaN(model[k])){
                            model[k] = model[k]+'';
                        }
                    })
                }
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
            var type = `485ChannelPowerPar`;
            this.$emit("submit", {
                paramsId: this.params[type] && this.params[type].paramsId,
                paramsType: type,
                params: model,
            });
        },
        workingTitle(model, options) {
            var v =
                this.workingParams[`485ChannelPowerPar`] &&
                this.workingParams[`485ChannelPowerPar`].params[options.name];
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
            var workingParams = this.workingParams[`485ChannelPowerPar`] &&
                this.workingParams[`485ChannelPowerPar`].params||{};
            var commitParams = this.params[`485ChannelPowerPar`] &&
                this.params[`485ChannelPowerPar`].params||{};
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