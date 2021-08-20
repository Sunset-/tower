<template>
    <div class="MODULE-MAJOR-CONTENT Equipment-detail">
        <xui-form ref="form" class="equipment-add-form" :options="formOptions" @submit="save" @cancel="cancel">
        </xui-form>
    </div>
</template>
<script>
import Store from "./store";
const $tip = $import("dag/common/tip");

export default {
    data() {
        return {
            formOptions: {
                cols: 1,
                fields: [
                    {
                        group: "设备信息",
                        label: "设备类型",
                        name: "deviceType",
                        widget: "radio",
                        placeholder: "请选择设备类型",
                        defaultFirst: true,
                        enum: "DEVICE_TYPE",
                    },
                    {
                        label: "项目",
                        name: "projectId",
                        widget: "projectselector",
                        placeholder: "请选择项目",
                        type: "1",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "设备名称",
                        name: "deviceName",
                        widget: "input",
                        placeholder: "请输入设备名称",
                        disabled(model) {
                            return !!model.deviceId;
                        },
                        clearable: false,
                        validate: {
                            required: true,
                            maxlength: 64,
                        },
                    },
                    {
                        label: "绑定设备SN",
                        name: "deviceSN",
                        widget: "equipmentselector",
                        bindStatus: 0,
                        placeholder: "请选择设备",
                        readonly: true,
                        watch: [
                            "deviceType",
                            (model, field) => {
                                field.deviceType = model.deviceType;
                                if (!model.deviceSN) {
                                    return;
                                }
                                if (
                                    (model.deviceType == "1" &&
                                        model.deviceSN[0] == "T") ||
                                    (model.deviceType == "2" &&
                                        model.deviceSN[0] == "S")
                                ) {
                                    return;
                                } else if (
                                    model.deviceSN[0] != "T" &&
                                    model.deviceSN[0] != "S"
                                ) {
                                    return;
                                } else {
                                    model.deviceSN = "";
                                }
                            },
                        ],
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "设备编号",
                        name: "deviceNo",
                        widget: "input",
                        placeholder: "请输入设备编号",
                        clearable: false,
                        prepend: "TC",
                        validate: {
                            required: true,
                            maxlength: 64,
                        },
                    },
                    // {
                    //     group: "设备资源",
                    //     label: "服务到期日",
                    //     name: "expireDate",
                    //     widget: "datetime",
                    //     placeholder: "请输入服务到期日",
                    //     valueformat: "timestamp",
                    //     manner: "datetime-single",
                    //     premise(model) {
                    //         return model.deviceId;
                    //     },
                    //     validate: {
                    //         required: true,
                    //     },
                    // },
                    // {
                    //     label: "数据容量（MB）",
                    //     name: "dataCapacity",
                    //     widget: "input",
                    //     placeholder: "请输入数据容量",
                    //     premise(model) {
                    //         return model.deviceId;
                    //     },
                    //     validate: {
                    //         required: true,
                    //     },
                    // },
                ],
                cast(model) {
                    if (model.projectId && model.projectName) {
                        model.projectId = `${model.projectId},${model.projectName}`;
                    }
                },
                format(model) {
                    if (Sunset.isObject(model.expireDate)) {
                        model.expireDate = model.expireDate.getTime();
                    }
                    if (model.projectId && model.projectId.indexOf(",") > 0) {
                        var gid = model.projectId;
                        model.projectId = gid.substring(0, gid.indexOf(","));
                        model.projectName = gid.substring(gid.indexOf(",") + 1);
                    }
                },
            },
        };
    },
    methods: {
        open(model) {
            this.$refs.form.reset(model);
        },
        save(model) {
            Store.save(model).then(() => {
                $tip("保存成功", "success");
                this.$emit("refresh", {
                    id: model.projectId,
                });
            });
        },
        cancel() {
            this.$emit("refresh");
        },
    },
};
</script>
<style lang="less">
.Equipment-detail {
    padding: 10px;
    .equipment-add-form {
        &.xui-form.xui-form-style .xui-toolbar.xui-toolbar-style {
            text-align: center;
            width: 400px;
            float: left;
            padding-top: 20px;
        }
    }
}
</style>