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
                        label: "主页logo",
                        name: "logoPath",
                        widget: "fileuploader",
                        placeholder: "请输入主页logo",
                        url: "/api/m/sys/common/upload",
                        filename: "photos",
                        formData: {
                            uploadType: 0,
                        },
                        max: 1,
                        format(res) {
                            return JSON.parse(res).data.path;
                        },
                        thumbnail(res) {
                            return $business.getCurrentUser().imgUrl + res;
                        },
                    },
                    {
                        label: "主页标题",
                        name: "title",
                        widget: "input",
                        placeholder: "请输入主页标题",
                    },
                ],
                toolbar: false,
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
                        logoPath: model.logoPath,
                        title: model.title,
                    })
                );
                this.$emit("refreshlogo");
            });
        },
    },
    mounted() {
        this.$refs.form.reset($business.getCurrentUser());
    },
};
</script>