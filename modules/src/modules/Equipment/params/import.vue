<template>
    <div>
        <xui-toolbar style="padding:10px;border-bottom:1px solid #dedede;display:block;" :options="toolbarOptions">
        </xui-toolbar>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");

export default {
    props: {},
    data() {
        return {
            toolbarOptions: {
                tools: [
                    {
                        label: "导入",
                        color: "primary",
                        type: "file",
                        filter: () => {
                            return true;
                        },
                        operate: (a, f) => {
                            f.text().then((res) => {
                                try {
                                    var params = JSON.parse(res);
                                    params = params.filter(
                                        (item) =>
                                            item.paramsType != "PlatPar" &&
                                            item.paramsType != "PlatPar"
                                    );
                                    params.forEach((item) => {
                                        if (item.paramsType == "DevBasePar") {
                                            delete item.params.SN;
                                            delete item.params.DevType;
                                            delete item.params.CCID;
                                            delete item.params.IMEI;
                                            delete item.params.FirmwareVersion;
                                            delete item.params.HardwareVersion;
                                        }
                                    });
                                    this.$emit("params", params);
                                    $tip("导入成功", "success");
                                } catch (e) {
                                    $tip("文件格式错误", "warning");
                                }
                            });
                        },
                    },
                ],
            },
            previewHtml: "",
        };
    },
    watch: {
        rawParams() {
            this.previewHtml = $jsonview(this.rawParams);
        },
    },
};
</script>