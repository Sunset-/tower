<template>
    <div class="MODULE-CONTAINER MODULE-Company">
        <div class="MODULE-MAJOR-CONTENT" v-show="page=='LIST'">
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH" v-if="false">
                <xui-filter class="title_filter" ref="filter" :options="filterOptions" @filter="search"></xui-filter>
            </div>
            <div class="PANEL" style="top:0px;">
                <!-- <xui-toolbar style="padding:10px 0px 5px 10px;border-bottom:1px solid #dedede;display:block;" :options="topToolbarOptions"></xui-toolbar> -->
                <div class="equipment-regist-wrap">
                    <div class="regist-tables">
                        <xui-form ref="form" :options="formOptions" @submit="save" @cancel="cancel">
                        </xui-form>
                    </div>
                    <xui-toolbar :options="toolbarOptions"></xui-toolbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");
const $loading = $import("dag/common/loading");

import Store from "./store";

export default {
    components: {},
    data() {
        return {
            page: "LIST",
            loading: false,
            topToolbarOptions: {
                tools: [
                    {
                        label: "从文件导入",
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
                                    if (vs.length != 3) {
                                        return;
                                    }
                                    if (
                                        vs[0].trim() == "" &&
                                        vs[1].trim() == "" &&
                                        vs[2].trim() == ""
                                    ) {
                                        return;
                                    }
                                    records.push({
                                        deviceSN: vs[0].trim(),
                                        termService: vs[1].trim(),
                                    });
                                });
                                if (records.length == 0) {
                                    $tip(
                                        "未识别出设备信息，请检查文件",
                                        "warning"
                                    );
                                    return;
                                }
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
                                rawRecords = rawRecords.concat(records);
                                model.equipments = JSON.stringify(rawRecords);
                                this.$refs.form.reset(model);
                            });
                        },
                    },
                ],
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "确认登记",
                        color: "success",
                        operate: () => {
                            this.$refs.form.submit();
                        },
                    },
                    {
                        label: "清空",
                        color: "info",
                        operate: () => {
                            var m = this.$refs.form.getModel();
                            this.$refs.form.reset({
                                deviceType: m.deviceType,
                            });
                        },
                    },
                ],
            },
            formOptions: {
                cols: 2,
                toolbar: false,
                fields: [
                    {
                        name: "deviceType",
                        widget: "radio",
                        enum: "DEVICE_TYPE",
                        defaultFirst: true,
                    },
                    {
                        name: "equipments",
                        widget: "edittable",
                        newline: true,
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
                                title: "SN",
                                name: "deviceSN",
                                widget: "input",
                                placeholder: "请输入SN",
                                colStyle: "width:200px;",
                                maxlength: 8,
                                validate(v, record, records, model) {
                                    v += "";
                                    return (
                                        v &&
                                        v.length == 8 &&
                                        ((v[0] == "S" &&
                                            model.deviceType == "2") ||
                                            (v[0] == "T" &&
                                                model.deviceType == "1")) &&
                                        records.filter(
                                            (item) => item.deviceSN == v
                                        ).length == 1
                                    );
                                },
                            },
                            {
                                title: "服务期限（天）",
                                name: "termService",
                                widget: "input",
                                placeholder: "请输入服务期限",
                                colStyle: "width:160px;",
                                validate(v) {
                                    return v && !isNaN(v) && v > 0;
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
    computed: {
        currentRoute() {
            return this.$route.name;
        },
    },
    methods: {
        open(model) {
            this.$refs.modal.open();
            this.$refs.form.reset(model);
        },
        save(model) {
            this.validate(model)
                .then(() => {
                    $loading(true);
                    Store.save(model)
                        .then(() => {
                            $tip("保存成功", "success");
                            $loading(false);
                            this.$refs.form.reset();
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
                Store.checkDeviceSN(
                    equipments.map((item) => item.deviceSN)
                ).then((res) => {
                    var hasError = false;
                    equipments.forEach((item) => {
                        if (res[item.deviceSN] == "1") {
                            hasError = true;
                            item.error = `${item.deviceSN},SN已登记`;
                        } else {
                            item.error = "";
                        }
                    });
                    if (hasError) {
                        model.equipments = JSON.stringify(equipments);
                        $tip("部分SN已登记，请检查", "warning");
                        reject(model);
                    } else {
                        resolve(model);
                    }
                });
            });
        },
        syncValidate(item, records, deviceType) {
            if (!item.deviceSN) {
                return "SN不能为空";
            }
            if (item.deviceSN.length != 8) {
                return "SN长度应为8";
            }
            if (records.filter((t) => t.deviceSN == item.deviceSN).length > 1) {
                return "SN重复";
            }
            if (
                (deviceType == "1" && item.deviceSN[0] == "T") ||
                (deviceType == "2" && item.deviceSN[0] == "S")
            ) {
            } else {
                return "SN类型不正确";
            }
            if (
                !Sunset.isNumber(item.termService) ||
                String(item.termService).indexOf(".") != -1 ||
                +item.termService <= 0
            ) {
                return "服务期限应为正整数";
            }
            return "";
        },
        cancel() {
            this.$refs.modal.close();
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-Company {
    .xui-datapage.xui-datapage-style .xui-datapage-footer {
        position: relative;
        bottom: 0;
    }
    .customer-image-info {
        text-align: left;
        p {
            display: inline-block;
            padding: 0px 5px;
        }
    }
}
.xui-form .xui-form-field.company-edit-table {
    .xui-field-label {
        vertical-align: top;
        padding-top: 26px;
    }
    .xui-field-widget {
        overflow-y: auto;
        height: 300px;
        width: 100%;
        display: inline-block;
        vertical-align: top;
        table {
            width: 700px;
        }
    }
}

.equipment-regist-wrap {
    height: 500px;
    display: flex;
    flex-direction: column;
    .regist-tables {
        flex-grow: 1;
        overflow-y: scroll;
        padding: 5px 10px;
        .xui-datatable-table {
            width: 775px;
        }
    }
    .xui-toolbar {
        text-align: left;
        padding: 10px 15px;
        border-top: 1px solid #d1d1d1;
    }
}
</style>