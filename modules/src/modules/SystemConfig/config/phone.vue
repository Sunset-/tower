<template>
    <div class="equipment-params-form">
        <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");

import Store from "../store";

export default {
    props : {
        user : {}
    },
    watch : {
        user(v){
            this.$refs.form.reset(v);
        }
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
                cols: 1,
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:120px",
                widgetStyle: "min-width:100px",
                fields: [
                    {
                        label: "手机号码",
                        name: "phoneNo",
                        widget: "input",
                        widgetStyle: "width:100%;",
                        placeholder: "请输入手机号码",
                        validate: {
                            required: true,
                            maxlength: 20,
                        },
                    },
                    {
                        label: "报警短信",
                        name: "receiveAlarm4",
                        widget: "checkbox",
                        widgetStyle: "width:100%;",
                        text: "接收",
                    },
                    {
                        label: "设备周报短信",
                        name: "receiveReport4",
                        widget: "checkbox",
                        widgetStyle: "width:100%;",
                        text: "接收",
                    },
                ],
                toolbar: false,
                cast(model) {
                    model.receiveAlarm4 = (model.receiveAlarm & 4) == 4;
                    model.receiveReport4 = (model.receiveReport & 4) == 4;
                },
                format(model) {
                    model.receiveAlarm = model.receiveAlarm || 0;
                    if (model.receiveAlarm4) {
                        model.receiveAlarm = model.receiveAlarm | 4;
                    } else {
                        model.receiveAlarm = model.receiveAlarm & 3;
                    }
                    if (model.receiveReport4) {
                        model.receiveReport = model.receiveReport | 4;
                    } else {
                        model.receiveReport = model.receiveReport & 3;
                    }
                    delete model.receiveAlarm4;
                    delete model.receiveReport4;
                },
            },
        };
    },
    methods: {
        save(model) {
            Store.saveUser(model).then((res) => {
                $tip("修改成功", "success");
                var user = $business.getCurrentUser();
                $business.setCurrentUser(
                    Object.assign(user, {
                        phoneNo: model.phoneNo,
                        receiveAlarm: model.receiveAlarm,
                        receiveReport: model.receiveReport,
                    })
                );
            });
        },
    },
    mounted() {
        this.$refs.form.reset($business.getCurrentUser());
    },
};
</script>