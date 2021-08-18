<template>
    <div class="equipment-params-form">
        <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
    </div>
</template>
<script>
const $http = $import("dag/common/http");
const $tip = $import("dag/common/tip");

export default {
    data() {
        return {
            editing: false,
            toolbarOptions: [
                // {
                //     label: "修改",
                //     color: "primary",
                //     premise: () => {
                //         return !this.editing;
                //     },
                //     operate: () => {
                //         this.editing = true;
                //     },
                // },
                {
                    label: "保存",
                    color: "success",
                    // premise: () => {
                    //     return this.editing;
                    // },
                    operate: () => {
                        this.$refs.form.submit();
                    },
                },
                // {
                //     label: "取消",
                //     color: "info",
                //     premise: () => {
                //         return this.editing;
                //     },
                //     operate: () => {
                //         this.editing = false;
                //     },
                // },
            ],
            formOptions: {
                cols: 1,
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:120px",
                widgetStyle: "min-width:100px",
                fields: [
                    {
                        label: "旧密码",
                        name: "password",
                        widget: "input",
                        type: "password",
                        widgetStyle: "width:100%;",
                        placeholder: "请输入旧密码",
                        validate: {
                            required: true,
                            maxlength: 20,
                        },
                    },
                    {
                        label: "新密码",
                        name: "passwordNew",
                        widget: "input",
                        widgetStyle: "width:100%;",
                        type: "password",
                        placeholder: "请输入新密码",
                        validate: {
                            required: true,
                            maxlength: 20,
                            password: true,
                        },
                    },
                    {
                        label: "确认密码",
                        name: "passwordNewAgain",
                        widget: "input",
                        widgetStyle: "width:100%;",
                        type: "password",
                        placeholder: "请再次输入新密码",
                        validate: {
                            required: true,
                            password: true,
                            maxlength: 20,
                        },
                    },
                ],
                validate(model) {
                    if (model.passwordNew != model.passwordNewAgain) {
                        $tip("两次密码输入不一致", "warn");
                        throw new Error("两次密码输入不一致");
                    }
                    if (model.password == model.passwordNewAgain) {
                        $tip("原密码与新密码相同", "warn");
                        throw new Error("原密码与新密码相同");
                    }
                },
                toolbar: false,
            },
        };
    },
    methods: {
        save(model) {
            $http({
                url: "/api/m/sys/user/modifyPassword",
                type: "POST",
                data: {
                    password: model.password,
                    passwordNew: model.passwordNew,
                },
            }).then((res) => {
                $tip("修改成功", "success");
                this.$refs.form.reset();
            });
        },
    },
};
</script>