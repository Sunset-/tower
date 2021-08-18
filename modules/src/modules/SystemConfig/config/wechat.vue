<template>
    <div class="equipment-params-form">
        <div style="padding:30px 0px;">
            <div style="float:left;text-align:right;width:130px;">扫一扫绑定</div>
            <div style="float:left;padding:0px 0px 10px 25px;">
                <img :src="appCodePath" alt="" style="width:180px;height:180px;border:1px solid #dedede;">
            </div>
            <div style="float:left;padding:0px 0px 10px 25px;position:relative;">
                <img :src="appGzhCodePath" alt="" style="width:220px;height:240px;border:1px solid #dedede;">
                <div style="position:absolute;bottom:28px;left:88px;font-size:18px;">绑定公众号</div>
            </div>
        </div>
        <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");
const $http = $import("dag/common/http");
const $business = $import("dag/common/business");

import Store from "../store";

export default {
    props: {
        user: {},
    },
    watch: {
        user(v) {
            this.$refs.form.reset(v);
        },
    },
    data() {
        return {
            appCodePath: "",
            appGzhCodePath: "",
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
                cols: 1,
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:120px",
                widgetStyle: "min-width:100px",
                fields: [
                    {
                        label: "报警短信",
                        name: "receiveAlarm1",
                        widget: "checkbox",
                        widgetStyle: "width:100%;",
                        text: "接收",
                    },
                    {
                        label: "设备周报短信",
                        name: "receiveReport1",
                        widget: "checkbox",
                        widgetStyle: "width:100%;",
                        text: "接收",
                    },
                ],
                toolbar: false,
                cast(model) {
                    model.receiveAlarm1 = (model.receiveAlarm & 1) == 1;
                    model.receiveReport1 = (model.receiveReport & 1) == 1;
                },
                format(model) {
                    model.receiveAlarm = model.receiveAlarm || 0;
                    if (model.receiveAlarm1) {
                        model.receiveAlarm = model.receiveAlarm | 1;
                    } else {
                        model.receiveAlarm = model.receiveAlarm & 6;
                    }
                    if (model.receiveReport1) {
                        model.receiveReport = model.receiveReport | 1;
                    } else {
                        model.receiveReport = model.receiveReport & 6;
                    }
                    delete model.receiveAlarm1;
                    delete model.receiveReport1;
                },
            },
        };
    },
    methods: {
        init() {
            $http({
                url: "/api/m/sys/user/getwxacodeunlimit",
                type: "POST",
            }).then((res) => {
                this.appCodePath = res && res.src;
            });

            $http({
                url: "/api/m/sys/user/getGhQrCode",
                type: "POST",
            }).then((res) => {
                this.appGzhCodePath = res && res.src;
            });
        },
        save(model) {
            Store.saveUser(model).then((res) => {
                $tip("修改成功", "success");
                var user = $business.getCurrentUser();
                $business.setCurrentUser(
                    Object.assign(user, {
                        receiveAlarm: model.receiveAlarm,
                        receiveReport: model.receiveReport,
                    })
                );
            });
        },
    },
    mounted() {
        this.$refs.form.reset($business.getCurrentUser());
        this.init();
    },
};
</script>