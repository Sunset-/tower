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
                        label: "报警邮件接收邮箱",
                        name: "email",
                        widget: "input",
                        widgetStyle: "width:100%;",
                        placeholder: "请输入报警邮件接收邮箱",
                        validate: {
                            required: true,
                            maxlength: 40,
                        },
                    },
                    {
                        label: "报警短信",
                        name: "receiveAlarm2",
                        widget: "checkbox",
                        widgetStyle: "width:100%;",
                        text: "接收",
                    },
                    {
                        label: "设备周报短信",
                        name: "receiveReport2",
                        widget: "checkbox",
                        widgetStyle: "width:100%;",
                        text: "接收",
                    },
                ],
                toolbar: false,
                cast(model) {
                    model.receiveAlarm2 = (model.receiveAlarm & 2) == 2;
                    model.receiveReport2 = (model.receiveReport & 2) == 2;
                },
                format(model) {
                    model.receiveAlarm = model.receiveAlarm || 0;
                    if (model.receiveAlarm2) {
                        model.receiveAlarm = model.receiveAlarm | 2;
                    } else {
                        model.receiveAlarm = model.receiveAlarm & 5;
                    }
                    if (model.receiveReport2) {
                        model.receiveReport = model.receiveReport | 2;
                    } else {
                        model.receiveReport = model.receiveReport & 5;
                    }
                    delete model.receiveAlarm2;
                    delete model.receiveReport2;
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
                        email: model.email,
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