<template>
    <xui-modal ref="modal" width="900" title="项目编辑">
        <xui-form ref="form" class="project-detail-form" :options="formOptions" @submit="save" @cancel="cancel">
        </xui-form>
    </xui-modal>
</template>
<script>
import Store from "./store";
const $tip = $import("dag/common/tip");

export default {
    data() {
        return {
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "项目名称",
                        name: "groupName",
                        widget: "input",
                        placeholder: "请输入项目名称",
                        disabled(model) {
                            return !!model.groupId;
                        },
                        validate: {
                            required: true,
                            maxlength: 64,
                        },
                    },
                    {
                        label: "项目地址",
                        name: "deviceAddress",
                        widget: "input",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "开工时间",
                        name: "startTime",
                        widget: "date",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "完工时间",
                        name: "endTime",
                        widget: "date",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "地理位置",
                        name: "lonlat",
                        widget: "mapmarker",
                    },
                    {
                        label: "建设单位",
                        name: "ownerUnit",
                        newline: true,
                        widget: "input",
                        placeholder: "请输入所属单位",
                        validate: {
                            maxlength: 64,
                        },
                    },
                    ,
                    {
                        label: "建设单位联系人",
                        name: "contacts",
                        widget: "input",
                        placeholder: "请输入项目联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "建设单位联系人电话",
                        name: "contactWay",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "产权单位",
                        name: "ownerUnit",
                        newline: true,
                        widget: "input",
                        placeholder: "请输入所属单位",
                        validate: {
                            maxlength: 64,
                        },
                    },
                    ,
                    {
                        label: "产权单位联系人",
                        name: "contacts",
                        widget: "input",
                        placeholder: "请输入项目联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "产权单位联系人电话",
                        name: "contactWay",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "安全站",
                        name: "ownerUnit",
                        newline: true,
                        widget: "input",
                        placeholder: "请输入所属单位",
                        validate: {
                            maxlength: 64,
                        },
                    },
                    ,
                    {
                        label: "安全站联系人",
                        name: "contacts",
                        widget: "input",
                        placeholder: "请输入项目联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "安全站联系人电话",
                        name: "contactWay",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "施工单位",
                        name: "ownerUnit",
                        newline: true,
                        widget: "input",
                        placeholder: "请输入所属单位",
                        validate: {
                            maxlength: 64,
                        },
                    },
                    ,
                    {
                        label: "施工单位联系人",
                        name: "contacts",
                        widget: "input",
                        placeholder: "请输入项目联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "施工单位联系人电话",
                        name: "contactWay",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "监理单位",
                        name: "ownerUnit",
                        newline: true,
                        widget: "input",
                        placeholder: "请输入所属单位",
                        validate: {
                            maxlength: 64,
                        },
                    },
                    ,
                    {
                        label: "监理单位联系人",
                        name: "contacts",
                        widget: "input",
                        placeholder: "请输入项目联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "监理单位联系人电话",
                        name: "contactWay",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "项目备注",
                        name: "contactWay",
                        widget: "textarea",
                        monopolize : true,
                        placeholder: "请输入项目备注",
                        validate: {
                            maxlength: 150,
                        },
                    },
                ],
            },
        };
    },
    methods: {
        open(model) {
            this.$refs.modal.open();
            this.$refs.form.reset(model);
        },
        save(model) {
            Store.save(model).then(() => {
                $tip("保存成功", "success");
                this.cancel();
                this.$emit("refresh");
            });
        },
        cancel() {
            this.$refs.modal.close();
        },
    },
};
</script>
<style lang="less">
.project-detail-form {
    &>.form-row{
        height:400px;
        overflow-y: scroll;
    }
    &.xui-form.xui-form-style .xui-form-field .xui-field-label {
        width: 130px;
        text-align: right;
        display: inline-block;
        line-height: 34px;
    }
}
</style>