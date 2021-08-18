<template>
    <xui-modal ref="modal" :options="modalOptions" :mask-close="false">
        <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
    </xui-modal>
</template>
<script>
const RoleManage = $import("dag/modules/RoleManage");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");

import Store from "./store";

export default {
    data() {
        return {
            //用户编辑
            modalOptions: {
                title: "登录标识信息",
                width: 800,
            },
            //表单的配置
            formOptions: {
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:80px",
                widgetStyle: "min-width:150px",
                cols: 2,
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
                            return $business.getCurrentUser().imgUrl+res;
                        },
                    },
                    {
                        label: "主页标题",
                        name: "title",
                        widget: "input",
                        placeholder: "请输入主页标题",
                    },
                ],
                toolbar: [
                    {
                        label: "确定",
                        color: "primary",
                        signal: "SUBMIT",
                    },
                    {
                        label: "取消",
                        color: "default",
                        operate: () => {
                            this.$refs.modal.close();
                        },
                    },
                ],
            },
            users: [],
        };
    },
    methods: {
        open(records) {
            this.users = records || [];
            this.$refs.form.reset();
            this.$refs.modal.open();
        },
        // 保存
        save(model) {
            model.userIds = this.users.map((item) => item.userId).join(",");
            Store.batchUpdateUserLogo(model).then((res) => {
                $tip("操作成功", "success");
                this.$refs.modal.close();
                this.$emit("refresh");
            });
        },
    },
};
</script>