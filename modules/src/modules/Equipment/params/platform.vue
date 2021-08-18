<template>
    <div class="equipment-params-form">
        <xui-form ref="form" style="padding:10px 0px;" :options="formOptions" @submit="save"></xui-form>
        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
    </div>
</template>
<script>
export default {
    props: {
        params: {},
    },
    watch: {
        params(v) {
            this.$refs.form.reset(v.PlatPar && v.PlatPar.params);
        },
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
                fields: [
                    {
                        label: "地理位置",
                        name: "lonlat",
                        widget: "mapmarker",
                    },
                ],
                cast(model) {
                    if (model.lng || model.lat) {
                        model.lonlat = `${model.lng},${model.lat}`;
                    }
                },
                format(model) {
                    if (model.lonlat) {
                        var ll = model.lonlat.split(",");
                        model.lng = ll[0] || "";
                        model.lat = ll[1] || "";
                    } else {
                        model.lng = "";
                        model.lat = "";
                    }
                    delete model.lonlat;
                },
                toolbar : false
            },
        };
    },
    methods: {
        save(model) {
            this.$emit("submit", {
                paramsId : this.params.PlatPar&&this.params.PlatPar.paramsId,
                paramsType: "PlatPar", //参数类型
                params: model,
            });
        },
    },
};
</script>