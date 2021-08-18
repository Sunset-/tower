<template>
    <div style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;">
        <xui-toolbar style="padding:10px;border-bottom:1px solid #dedede;display:block;" :options="toolbarOptions"></xui-toolbar>
        <div v-html="previewHtml" style="position:absolute;top:50px;left:0px;right:0px;bottom:0px;overflow-y:auto;">

        </div>
    </div>
</template>
<script>
const $jsonview = $import("dag/common/jsonview");

export default {
    props: {
        rawParams: {},
        params: {},
    },
    data() {
        return {
            toolbarOptions: {
                tools: [
                    {
                        label: "导出",
                        color: "primary",
                        type: "download",
                        name: () => {
                            return "params.json";
                        },
                        data: () => {
                            return (
                                "data:text/plain," +
                                JSON.stringify(this.rawParams)
                            );
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