<template>
    <div class="MODULE-MAJOR-CONTENT" style="position:absolute;background:transparent;">
        <dag-breadcrumb ref="path" :path="path" :back="back"></dag-breadcrumb>
        <div class="Equipment-params">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions" :params="params" :workingParams="workingParams" @change="changeTab">
            </xui-tabs>
            <div class="Equipment-params-major">
                <params-platform v-show="currentTab=='PLATFORM'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams">
                </params-platform>
                <params-base v-show="currentTab=='BASE'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" :beforeImportParams="beforeImportParams" @submit="saveParams">
                </params-base>
                <params-net v-show="currentTab=='NET'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-net>
                <params-canalog v-show="currentTab=='CANALOG'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-canalog>
                <params-cdigits v-show="currentTab=='CDIGITS'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-cdigits>
                <params-c485 v-show="currentTab=='C485'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-c485>
                <params-c485gd v-show="currentTab=='C485GD'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-c485gd>
                <params-cout v-show="currentTab=='COUT'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-cout>
                <params-cgq v-show="currentTab=='CGQ'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-cgq>
                <params-preview v-show="currentTab=='PREVIEW'" :rawParams="rawParams" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-preview>
                <params-import v-show="currentTab=='IMPORT'" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @params="initParams" @submit="saveParams"></params-import>
                <params-history v-show="currentTab=='HISTORY'" :device="record" :params="params" :workingParams="workingParams" :paramsStatus="paramsStatus" @submit="saveParams"></params-history>
            </div>
        </div>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");

import ParamsBase from "./params/base.vue";
import ParamsPlatform from "./params/platform.vue";
import ParamsNet from "./params/net.vue";
import ParamsCanalog from "./params/canalog";
import ParamsCdigits from "./params/cdigits";
import ParamsC485 from "./params/c485";
import ParamsC485gd from "./params/c485gd";
import ParamsCout from "./params/cout";
import ParamsCgq from "./params/cgq";
import ParamsPreview from "./params/preview";
import ParamsImport from "./params/import";
import ParamsHistory from "./params/history";

import Store from "./store";

var WG_TABS = [
    {
        text: "平台设置",
        value: "PLATFORM",
    },
    {
        text: "基本参数",
        value: "BASE",
    },
    {
        text: "网络参数",
        value: "NET",
    },
    {
        text: "模拟量通道参数",
        value: "CANALOG",
    },
    {
        text: "数字量通道参数",
        value: "CDIGITS",
    },
    {
        text: "485通道参数",
        value: "C485",
    },
    {
        text: "485通道供电参数",
        value: "C485GD",
    },
    {
        text: "输出通道参数",
        value: "COUT",
    },
    {
        text: "参数预览",
        value: "PREVIEW",
    },
    {
        text: "参数导入",
        value: "IMPORT",
    },
    {
        text: "编辑记录",
        value: "HISTORY",
    },
];
var CGQ_TABS = [
    {
        text: "平台设置",
        value: "PLATFORM",
    },
    {
        text: "基本参数",
        value: "BASE",
    },
    {
        text: "网络参数",
        value: "NET",
    },
    {
        text: "通道参数",
        value: "CGQ",
    },
    {
        text: "参数预览",
        value: "PREVIEW",
    },
    {
        text: "参数导入",
        value: "IMPORT",
    },
    {
        text: "编辑记录",
        value: "HISTORY",
    },
];

export default {
    components: {
        DagBreadcrumb: $import("dag/components/Breadcrumb").Component,
        ParamsBase,
        ParamsPlatform,
        ParamsNet,
        ParamsCanalog,
        ParamsCdigits,
        ParamsC485,
        ParamsC485gd,
        ParamsCout,
        ParamsCgq,
        ParamsPreview,
        ParamsImport,
        ParamsHistory,
    },
    props: {
        show: {},
    },
    data() {
        return {
            path: [
                {
                    title: "设备列表",
                    operate: () => {
                        this.$emit("refresh");
                    },
                },
            ],
            currentTab: "PLATFORM",
            paramsStatus: {},
            tabOptions: {
                data: [
                    {
                        text: "平台设置",
                        value: "PLATFORM",
                    },
                    {
                        text: "基本参数",
                        value: "BASE",
                    },
                    {
                        text: "网络参数",
                        value: "NET",
                    },
                    {
                        text: "模拟量通道参数",
                        value: "CANALOG",
                    },
                    {
                        text: "数字量通道参数",
                        value: "CDIGITS",
                    },
                    {
                        text: "485通道参数",
                        value: "C485",
                    },
                    {
                        text: "485通道供电参数",
                        value: "C485GD",
                    },
                    {
                        text: "输出通道参数",
                        value: "COUT",
                    },
                    {
                        text: "参数预览",
                        value: "PREVIEW",
                    },
                    {
                        text: "参数导入",
                        value: "IMPORT",
                    },
                    {
                        text: "编辑记录",
                        value: "HISTORY",
                    },
                ],
            },
            record: {},
            rawParams: [],
            params: {},
            workingParams: {},
            beforeImportParams: null,
        };
    },
    watch: {
        show(v) {
            if (!v) {
                this.endLoopStatus();
            }
        },
        $route(to, from) {
            console.log(to.path);
        },
    },
    methods: {
        changeTab() {},
        back() {
            this.$emit("refresh");
            this.endLoopStatus();
        },
        open(record) {
            this.path = this.path.slice(0, 1);
            this.path.push({
                title: `设备备注:${record.deviceName}  设备SN:${record.deviceSN}`,
            }),
                (this.record = record);
            this.tabOptions.data =
                record.deviceType == "1" ? WG_TABS : CGQ_TABS;
            this.currentTab = "PLATFORM";
            this.refresh();
            this.startLoopStatus(record);
        },
        refresh() {
            if (this.record.deviceId) {
                Store.getParams(this.record.deviceId).then((res) => {
                    this.rawParams = res[0];
                    this.initParams(res[0], true);
                    this.commitParams = this.params;
                    this.workingParams = res[1].reduce((res, item) => {
                        res[item.paramsType] = item;
                        if (item.params) {
                            try {
                                item.params = JSON.parse(item.params);
                            } catch (e) {}
                        }
                        return res;
                    }, {});
                });
            }
        },
        initParams(params, clear) {
            var baseParams = {};
            if (!clear) {
                baseParams = JSON.parse(JSON.stringify(this.params || {}));
                this.beforeImportParams = JSON.parse(
                    JSON.stringify(this.params || {})
                );
            } else {
                this.beforeImportParams = null;
            }
            this.params = params.reduce((res, item) => {
                res[item.paramsType] = item;
                if (item.params) {
                    try {
                        item.params = JSON.parse(item.params);
                    } catch (e) {}
                }
                return res;
            }, baseParams);
        },
        saveParams(model) {
            //转数字
            var numberKeys = {
                ChannelIndex: true,
                AlarmSwitch: true,
                ChannelDataFormat: true,
                DevType: true,
                DataFormat: true,
                SendingInterval: true,
                SamplingInterval: true,
                LocalRecord: true,
                ServerPort: true,
                ServerType: true,
            };
            if (model.params) {
                Object.keys(model.params).forEach((k) => {
                    if (numberKeys[k] && !isNaN(model.params[k])) {
                        model.params[k] = +model.params[k];
                    }
                });
            }
            this.paramsStatus[model.paramsType] =
                this.paramsStatus[model.paramsType] || {};
            this.paramsStatus[model.paramsType].setResult = 1;
            Store.saveParams({
                deviceId: this.record.deviceId,
                deviceName: this.record.deviceName, //设备备注
                deviceSN: this.record.deviceSN, //设备SN
                list: [model],
            }).then((res) => {
                $tip("保存成功", "success");
                this.beforeImportParams = null;
                var params = this.params;
                res.forEach((item) => {
                    params[item.paramsType] = item;
                    if (item.params) {
                        try {
                            item.params = JSON.parse(item.params);
                        } catch (e) {}
                    }
                });
                this.params = JSON.parse(JSON.stringify(params));
                // this.refresh();
            });
        },
        startLoopStatus(record) {
            this.endLoopStatus();
            this.loadSyncStatus(record);
            this.loopTimer = setInterval(() => {
                this.loadSyncStatus(record);
            }, 3000);
        },
        loadSyncStatus(record) {
            Store.loadSyncStatus({
                deviceId: record.deviceId,
            }).then((res) => {
                this.paramsStatus = res.reduce((res, item) => {
                    res[item.paramsType] = item;
                    return res;
                }, {});
            });
        },
        endLoopStatus() {
            clearTimeout(this.loopTimer);
            this.loopTimer = null;
        },
    },
    destroyed() {
        this.endLoopStatus();
    },
};
</script>
<style lang="less">
.Equipment-params {
    position: absolute;
    top: 50px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #fff;
    overflow-x: auto;
    .casemanager-longtab.xui-tabs.xui-tabs-style .xui-tab-item {
        min-width: 100px;
        padding: 0px 20px;
    }
    .xui-tabs.xui-tabs-style .xui-tab-item {
        padding: 0px 5px;
    }
    .Equipment-params-major {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 45px;
        bottom: 0px;
        overflow-y: auto;
    }
    .equipment-params-form {
        width: 800px;
        & > .xui-toolbar {
            display: block;
            text-align: center;
            border-top: 1px solid #dedede;
            padding-top: 10px;
        }
    }
    .channel-params-box {
        border: 1px solid #ddd;
        margin: 10px;
        border-radius: 3px;
    }
    .xui-checkbox-manner-alarm-switch {
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 3px;
        display: inline-block;
    }
    .xui-form .xui-form-field .xui-field-tip {
        position: absolute;
        left: 125px;
        bottom: 0px;
        color: orange;
    }
    .uncommit-tip {
        &:after {
            content: "\E744";
            font-family: "xuiiconfont" !important;
            font-size: 18px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            position: absolute;
            right: -16px;
            top: 50%;
            margin-top: -16px;
            color: orange;
        }
    }
}
</style>