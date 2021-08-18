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
                title: "用户信息",
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
                        label: "登录名",
                        name: "loginName",
                        widget: "input",
                        placeholder: "请输入登录名",
                        validate: {
                            required: true,
                            maxlength: 64,
                            userName: true,
                        },
                    },
                    {
                        label: "真实姓名",
                        name: "userName",
                        widget: "input",
                        placeholder: "请输入真实姓名",
                        validate: {
                            required: true,
                            maxlength: 128,
                        },
                    },
                    {
                        label: "邮箱",
                        name: "email",
                        widget: "input",
                        placeholder: "请输入邮箱",
                        validate: {
                            email: true,
                            maxlength: 36,
                        },
                    },
                    {
                        label: "电话号码",
                        name: "phoneNo",
                        widget: "input",
                        placeholder: "请输入电话号码",
                        validate: {
                            phone: true,
                            maxlength: 11,
                        },
                    },
                    {
                        label: "备注",
                        name: "remark",
                        widget: "textarea",
                        monopolize: true,
                        placeholder: "请输入备注",
                        validate: {
                            maxlength: 128,
                        },
                    },
                    {
                        label: "角色",
                        name: "roleId",
                        widget: "select",
                        placeholder: "请选择角色",
                        data: RoleManage.GetRoles({
                            pageIndex: 1,
                            pageSize: 9999,
                        }).then((res) => {
                            return (
                                (res &&
                                    res.list.map((item) => ({
                                        text: item.roleName,
                                        value: item.roleId,
                                    }))) ||
                                []
                            );
                        }),
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "状态",
                        name: "isActive",
                        widget: "radio",
                        defaultFirst: true,
                        data: [
                            {
                                text: "启用",
                                value: "1",
                            },
                            {
                                text: "禁用",
                                value: "0",
                            },
                        ],
                        validate: {
                            required: true,
                        },
                    },
                    // {
                    //     label: "主页logo",
                    //     name: "logoPath",
                    //     widget: "fileuploader",
                    //     placeholder: "请输入主页logo",
                    //     url: "/api/m/sys/common/upload",
                    //     filename: "photos",
                    //     formData: {
                    //         uploadType: 0,
                    //     },
                    //     max: 1,
                    //     format(res) {
                    //         return JSON.parse(res).data.path;
                    //     },
                    //     thumbnail(res) {
                    //         return $business.getCurrentUser().imgUrl+res;
                    //     },
                    // },
                    // {
                    //     label: "主页标题",
                    //     name: "title",
                    //     widget: "input",
                    //     placeholder: "请输入主页标题",
                    // },
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
                format(model) {
                    model.isActive = +model.isActive;
                },
            },
        };
    },
    methods: {
        open(record) {
            this.$refs.form.reset(record);
            this.$refs.modal.open();
        },
        // 保存
        save(model) {
            Store.save(model).then(() => {
                //关闭窗口
                this.$refs.modal.close();
                //刷新表格
                this.$emit("refresh");
                $tip("保存成功", "success");
            });
        },
    },
};
</script>