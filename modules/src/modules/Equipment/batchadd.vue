<template>
    <div class="MODULE-MAJOR-CONTENT Equipment-detail">
        <div>
            <xui-toolbar :options="toolbarOptions"></xui-toolbar>
        </div>
        <xui-form ref="form" class="equipment-add-form" :options="formOptions" @submit="save" @cancel="cancel">
        </xui-form>
        <xui-modal ref="namemodal" width="800" title="名称前缀批量添加">
            <xui-form ref="nameform" :options="nameFormOptions" @submit="addByPrefix" @cancel="cancelName"></xui-form>
        </xui-modal>
        <equipment-selector ref="batchbindmodal" :options="{bindStatus:0,deviceType :deviceType}" multiple="true" @selected="selectSn">
        </equipment-selector>
    </div>
</template>
<script>
import Store from "./store";
import RegistStore from "../EquipmentRegist/store";
const $tip = $import("dag/common/tip");
const $loading = $import("dag/common/loading");

export default {
    components: {
        EquipmentSelector: $import("dag/components/EquipmentSelector")
            .Component,
    },
    data() {
        return {
            deviceType: "",
            toolbarOptions: {
                tools: [
                    {
                        label: "设备备注前缀批量添加",
                        color: "primary",
                        operate: () => {
                            this.$refs.namemodal.open();
                            this.$refs.nameform.reset();
                        },
                    },
                    {
                        label: "文件导入",
                        color: "primary",
                        type: "file",
                        filter: () => {
                            return true;
                        },
                        operate: (a, f) => {
                            f.text().then((res) => {
                                var records = [];
                                res.split("\n").map((item) => {
                                    var vs = item.split(",");
                                    if (vs.length == 0) {
                                        return;
                                    }
                                    var name = vs[0].trim();
                                    var sn = vs[1] ? vs[1].trim() : "";
                                    if (name == "" && sn == "") {
                                        return;
                                    }
                                    records.push({
                                        deviceName: name,
                                        deviceSN: sn,
                                    });
                                });
                                if (records.length == 0) {
                                    $tip("未识别出信息，请检查文件", "warning");
                                    return;
                                }
                                this.addBatch(records);
                            });
                        },
                    },
                    {
                        label: "批量绑定设备",
                        color: "warning",
                        operate: () => {
                            this.deviceType = this.$refs.form.getModel().deviceType;
                            this.$refs.batchbindmodal.open();
                        },
                    },
                ],
            },
            nameFormOptions: {
                cols: 1,
                fields: [
                    {
                        label: "设备数量",
                        name: "count",
                        widget: "input",
                        placeholder: "请输入设备数量,1-50",
                        style: "width:500px;",
                        validate: {
                            required: true,
                            func: {
                                message: "请输入整数1-50",
                                rule: function (v) {
                                    if (isNaN(v)) {
                                        return false;
                                    }
                                    v = +v;
                                    return v >= 1 && v <= 50;
                                },
                            },
                        },
                    },
                    {
                        label: "名称前缀",
                        name: "prefix",
                        widget: "input",
                        placeholder: "名称前缀最长60个字符，一旦确认不可修改",
                        style: "width:500px;",
                        validate: {
                            required: true,
                            maxlength: 60,
                        },
                    },
                ],
            },
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "设备类型",
                        name: "deviceType",
                        widget: "radio",
                        placeholder: "请选择设备类型",
                        newline: true,
                        defaultFirst: true,
                        data: [
                            {
                                text: "网关",
                                value: "1",
                            },
                            {
                                text: "智能互感器",
                                value: "2",
                            },
                        ],
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "所属项目",
                        name: "groupId",
                        widget: "projectselector",
                        placeholder: "请选择项目",
                        type: "1",
                        watch: [
                            "deviceType",
                            (model, options) => {
                                options.type = model.deviceType;
                                model.groupId = "";
                            },
                        ],
                        readonly: true,
                        newline: true,
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "设备映射",
                        name: "equipments",
                        widget: "edittable",
                        newline: true,
                        widgetStyle:
                            "width:700px;max-height:500px;overflow-y:scroll;",
                        view: (v) => {
                            if (!v) {
                                return "";
                            }
                            v = JSON.parse(v);
                            return [
                                "<div class='xui-edittable xui-edittable-style xui-datatable xui-datatable-style xui-datapage xui-datapage-style'><table class='xui-datatable-table table table-bordered table-striped'>",
                                `<thead>
                                    <tr>
                                        <th class="text-center" style="width:80px;">序号</th>
                                        <th class="text-center">证券公司</th>
                                        <th class="text-center">营业部</th>
                                    </tr>
                                </thead>`,
                                v.map(
                                    (item, i) =>
                                        `<tr><td class="text-center">${
                                            i + 1
                                        }</td><td>${item.company}</td><td>${
                                            item.dept
                                        }</td></tr>`
                                ),
                                "</table></div>",
                            ].join("");
                        },
                        cols: [
                            {
                                title: "设备备注",
                                name: "deviceName",
                                widget: "input",
                                placeholder: "请输入设备备注",
                                colStyle: "width:200px;",
                                maxlength: 64,
                                validate(v, record, records, model) {
                                    return (
                                        !!v &&
                                        records.filter(
                                            (item) => item.deviceName == v
                                        ).length == 1
                                    );
                                },
                            },
                            {
                                title: "设备SN",
                                name: "deviceSN",
                                widget: "input",
                                colStyle: "width:200px;",
                                placeholder: "未绑定SN",
                                maxlength: 8,
                                validate(v, record, records, model) {
                                    v += "";
                                    return (
                                        v &&
                                        v.length == 8 &&
                                        ((v[0] == "H" &&
                                            model.deviceType == "2") ||
                                            (v[0] == "W" &&
                                                model.deviceType == "1"))
                                    );
                                },
                            },
                        ],
                        showValidate: {
                            title: "校验信息",
                            colStyle: "width:200px;",
                            error: (record, records, model) => {
                                if (record.error) {
                                    var ers = record.error.split(",");
                                    if (record.deviceSN == ers[0]) {
                                        return `<span class="color-danger">${ers[1]}</span>`;
                                    }
                                }
                                var err = this.syncValidate(
                                    record,
                                    records,
                                    model.deviceType
                                );
                                return err
                                    ? `<span class="color-warning">${err}</span>`
                                    : '<span class="color-success">正确</span>';
                            },
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
            var equipments = JSON.parse(model.equipments);
            //同步校验
            for (var i = 0, item; (item = equipments[i++]); ) {
                item.error = "";
                if (
                    this.syncValidate(item, equipments, model.deviceType) != ""
                ) {
                    return;
                }
            }
            var gid = model.groupId.split(",");

            this.validate(model, equipments)
                .then(() => {
                    $loading(true);
                    Store.saveBatch({
                        deviceType: model.deviceType,
                        groupId: gid[0],
                        list: equipments.map((item) => ({
                            deviceName: item.deviceName,
                            deviceSN: item.deviceSN,
                        })),
                    })
                        .then(() => {
                            $tip("保存成功", "success");
                            $loading(false);
                            this.$emit("refresh", {
                                id: model.groupId,
                            });
                        })
                        .catch(() => {
                            $loading(false);
                        });
                })
                .catch((m) => {
                    this.$refs.form.reset(m);
                });
        },
        validate(model) {
            return new Promise((resolve, reject) => {
                var equipments = JSON.parse(model.equipments);
                //同步校验
                for (var i = 0, item; (item = equipments[i++]); ) {
                    item.error = "";
                    if (
                        this.syncValidate(item, equipments, model.deviceType) !=
                        ""
                    ) {
                        reject(model);
                        return;
                    }
                }
                // //异步校验sn是否占用
                RegistStore.checkDeviceSN(
                    equipments.map((item) => item.deviceSN)
                ).then((res) => {
                    var hasError = false;
                    equipments.forEach((item) => {
                        if (res[item.deviceSN] == "0") {
                            hasError = true;
                            item.error = `${item.deviceSN},SN未登记`;
                        } else {
                            item.error = "";
                        }
                    });
                    if (hasError) {
                        model.equipments = JSON.stringify(equipments);
                        $tip("部分SN未登记，请检查", "warning");
                        reject(model);
                    } else {
                        resolve(model);
                    }
                });
            });
        },
        syncValidate(item, records, deviceType) {
            if (!item.deviceName) {
                return "设备备注不能为空";
            }
            if (
                records.filter((t) => t.deviceName == item.deviceName).length >
                1
            ) {
                return "设备备注重复";
            }
            if (item.deviceSN.length != 8) {
                return "SN长度应为8";
            }
            if (!item.deviceSN) {
                return "SN不能为空";
            }
            if (
                (deviceType == "1" && item.deviceSN[0] == "W") ||
                (deviceType == "2" && item.deviceSN[0] == "H")
            ) {
            } else {
                return "SN类型不正确";
            }
            if (records.filter((t) => t.deviceSN == item.deviceSN).length > 1) {
                return "SN重复";
            }
            return "";
        },
        cancel() {
            this.$emit("refresh");
        },
        addByPrefix(model) {
            var eqs = [];
            var l = +model.count;
            for (var i = 1; i <= l; i++) {
                eqs.push({
                    deviceName: `${model.prefix}${
                        i < 10 ? "00" : i < 100 ? "0" : ""
                    }${i}`,
                    deviceSN: "",
                });
            }
            this.addBatch(eqs);
            this.$refs.namemodal.close();
        },
        selectSn(records) {
            var model = this.$refs.form.getModel();
            var rawRecords = [];
            try {
                rawRecords = model.equipments
                    ? JSON.parse(model.equipments)
                    : [];
            } catch (e) {
                console.error(e);
                rawRecords = [];
            }
            rawRecords.forEach((item) => {
                if (item.deviceSN != "") {
                    return;
                }
                if (records.length) {
                    item.deviceSN = records.shift().deviceSN;
                }
            });
            if (records.length) {
                rawRecords = rawRecords.concat(
                    records.map((item) => ({
                        name: "",
                        deviceSN: item.deviceSN,
                    }))
                );
            }
            model.equipments = JSON.stringify(rawRecords);
            this.$refs.form.reset(model);
        },
        addBatch(batch) {
            var model = this.$refs.form.getModel();
            var rawRecords = [];
            try {
                rawRecords = model.equipments
                    ? JSON.parse(model.equipments)
                    : [];
            } catch (e) {
                console.error(e);
                rawRecords = [];
            }
            rawRecords = rawRecords.concat(batch);
            model.equipments = JSON.stringify(rawRecords);
            this.$refs.form.reset(model);
        },
        cancelName() {
            this.$refs.namemodal.close();
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