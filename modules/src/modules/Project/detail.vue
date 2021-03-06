<template>
    <xui-modal
        ref="modal"
        width="900"
        :title="isView ? '项目信息' : '项目编辑'"
    >
        <xui-form
            ref="form"
            :view="isView"
            class="project-detail-form"
            :options="formOptions"
            @submit="save"
            @cancel="cancel"
        >
        </xui-form>
    </xui-modal>
</template>
<script>
import Store from "./store";
const $tip = $import("dag/common/tip");

export default {
    data() {
        return {
            isView: false,
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "项目名称",
                        name: "projectName",
                        widget: "input",
                        placeholder: "请输入项目名称",
                        disabled(model) {
                            return !!model.projectId;
                        },
                        validate: {
                            required: true,
                            maxlength: 64,
                        },
                    },
                    {
                        label: "开工时间",
                        name: "startTime",
                        widget: "date",
                        view : "DATE",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "完工时间",
                        name: "endTime",
                        widget: "date",
                        view : "DATE",
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
                        name: "buildParty",
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
                        name: "contactPerson",
                        widget: "input",
                        placeholder: "请输入联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "建设单位联系人电话",
                        name: "contactPhone",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "产权单位",
                        name: "propertyRightParty",
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
                        name: "propertyRightPerson",
                        widget: "input",
                        placeholder: "请输入联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "产权单位联系人电话",
                        name: "propertyRightPhone",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "安监站",
                        name: "safetyStation",
                        newline: true,
                        widget: "input",
                        placeholder: "请输入所属单位",
                        validate: {
                            maxlength: 64,
                        },
                    },
                    ,
                    {
                        label: "安监站联系人",
                        name: "safetyStationPerson",
                        widget: "input",
                        placeholder: "请输入联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "安监站联系人电话",
                        name: "safetyStationPhone",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "施工单位",
                        name: "constructParty",
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
                        name: "constructPerson",
                        widget: "input",
                        placeholder: "请输入联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "施工单位联系人电话",
                        name: "constructPhone",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "监理单位",
                        name: "surveyParty",
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
                        name: "surveyPerson",
                        widget: "input",
                        placeholder: "请输入联系人",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "监理单位联系人电话",
                        name: "surveyPhone",
                        widget: "input",
                        placeholder: "请输入联系方式",
                        validate: {
                            maxlength: 32,
                        },
                    },
                    {
                        label: "项目备注",
                        name: "remark",
                        widget: "textarea",
                        monopolize: true,
                        placeholder: "请输入项目备注",
                        validate: {
                            maxlength: 150,
                        },
                    },
                ],
                format(model) {
                    if (model.lonlat) {
                        var lonlat = model.lonlat.split(",");
                        model.lng = lonlat[0];
                        model.lat = lonlat[1];
                    }
                },
                cast(model) {
                    if (model.lng && model.lat) {
                        model.lonlat = `${model.lng},${model.lat}`;
                    }
                },
                toolbar: {
                    tools: [
                        {
                            label: "取消",
                            signal: "CANCEL",
                            premise: () => {
                                return !this.isView;
                            },
                        },
                        {
                            label: "返回",
                            signal: "CANCEL",
                            premise: () => {
                                return this.isView;
                            },
                        },
                        {
                            label: "保存",
                            color: "success",
                            signal: "SUBMIT",
                            premise: () => {
                                return !this.isView;
                            },
                        },
                    ],
                },
            },
        };
    },
    methods: {
        open(model, view) {
            this.$refs.modal.open();
            this.isView = !!view;
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
    & > .form-row {
        height: 400px;
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