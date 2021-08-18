<template>
    <div class="equipment-params-form">
        <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
        <params-lastcmd :params="params['NetWorkPar']" :status="paramsStatus['NetWorkPar']" :workingParams="workingParams['NetWorkPar']"></params-lastcmd>
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
            this.$refs.form.reset(v.NetWorkPar && v.NetWorkPar.params);
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
                        label: "服务器地址",
                        placeholder: "请输入服务器地址",
                        name: "ServerAddr",
                        widget: "input",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        validate: {
                            required: true,
                            maxlength: 64,
                        },
                    },
                    {
                        label: "服务器端口",
                        placeholder: "请输入服务器端口",
                        name: "ServerPort",
                        widget: "input",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        validate: {
                            required: true,
                            port: true,
                        },
                    },
                    {
                        label: "用户名",
                        placeholder: "请输入用户名",
                        name: "UserName",
                        widget: "input",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        validate: {
                            required: true,
                            maxlength: 64,
                        },
                    },
                    {
                        label: "密码",
                        placeholder: "请输入密码",
                        name: "PassWord",
                        widget: "input",

                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                    },
                    {
                        label: "客户端ID",
                        placeholder: "请输入客户端ID",
                        name: "ClientID",
                        widget: "input",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        newline: true,
                        validate: {
                            required: true,
                            maxlength: 96,
                        },
                    },
                    {
                        label: "订阅主题",
                        placeholder: "请输入订阅主题",
                        name: "SubTopic",
                        widget: "input",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        newline: true,
                        validate: {
                            required: true,
                            maxlength: 128,
                        },
                    },
                    {
                        label: "发布主题",
                        placeholder: "请输入发布主题",
                        name: "PubTopic",
                        widget: "input",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        newline: true,
                        validate: {
                            required: true,
                            maxlength: 128,
                        },
                    },
                    {
                        label: "服务器类型",
                        name: "ServerType",
                        widget: "select",
                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                        newline: true,
                        data: [
                            { text: "阿里平台", value: "0" },
                            { text: "OneNet", value: "1" },
                            { text: "电信", value: "2" },
                            { text: "华为", value: "3" },
                        ],
                    },
                    {
                        label: "阿里三元组",
                        name: "aliTriple",
                        newline: true,
                        widget: "triple",

                        title: (model, options) => {
                            return (
                                "当前值：" +
                                (this.workingParams[`NetWorkPar`] &&
                                    this.workingParams[`NetWorkPar`].params[
                                        options.name
                                    ])
                            );
                        },
                        colClass : "",
                    },
                ],
                cast(model) {
                    Object.keys(model).forEach(k=>{
                        if(!isNaN(model[k])){
                            model[k] = model[k]+'';
                        }
                    });
                    model.aliTriple = `${model.ProductKey},${model.DeviceName},${model.DeviceSecret}`;
                    delete model.ProductKey;
                    delete model.DeviceName;
                    delete model.DeviceSecret;
                },
                format(model) {
                    if (model.aliTriple) {
                        var vs = model.aliTriple.split(",");
                        model.ProductKey = vs[0] || "";
                        model.DeviceName = vs[1] || "";
                        model.DeviceSecret = vs[2] || "";
                    } else {
                        model.ProductKey = "";
                        model.DeviceName = "";
                        model.DeviceSecret = "";
                    }
                    delete model.aliTriple;
                },
            },
        };
    },
    methods: {
        save(model) {
            this.$emit("submit", {
                paramsId:
                    this.params.NetWorkPar && this.params.NetWorkPar.paramsId,
                paramsType: "NetWorkPar",
                params: model,
            });
        },
        refreshCommitTip(){
            var workingParams = this.workingParams[`NetWorkPar`] &&
                this.workingParams[`NetWorkPar`].params||{};
            var commitParams = this.params[`NetWorkPar`] &&
                this.params[`NetWorkPar`].params||{};
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