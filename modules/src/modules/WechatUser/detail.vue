<template>
    <div>
        <dag-breadcrumb ref="path" :path="path" :back="back"></dag-breadcrumb>
        <div class="MODULE-MAJOR product-detail">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions" @change="changeTab">
            </xui-tabs>
            <xui-scroll ref="scroll" class="form-scroll-wrap">
                <div class="wechatorder-detail-BASE" v-show="currentTab=='BASE'" style="background:#fff;">
                    <div class="group-wrap">
                        <div class="group-title">申请信息</div>
                        <div class="group-info-item">
                            <label>股票代码：</label>
                            <span>{{currentModel.product?currentModel.product.code:''}}</span>
                        </div>
                        <div class="group-info-item">
                            <label>股票简称：</label>
                            <span>{{currentModel.product?currentModel.product.name:''}}</span>
                        </div>
                        <div class="group-info-item">
                            <label>揭露日：</label>
                            <span>{{currentModel.product?currentModel.product.disclosureDate:''}}</span>
                        </div>
                        <div class="group-info-item">
                            <label>申请人：</label>
                            <span>{{currentModel.name}}</span>
                        </div>
                        <div class="group-info-item">
                            <label>身份证号：</label>
                            <span>{{currentModel.identCode}}</span>
                        </div>
                        <div class="group-info-item">
                            <label>身份证拍照：</label>
                            <div class="identcode-imgs">
                                <img v-for="img in currentModel.files" :key="img.id"
                                    :src="`/proxy-img/wechatData/${img.path}`"
                                    @click="viewImage(img,currentModel.files)">
                            </div>
                        </div>
                    </div>
                    <div class="group-wrap">
                        <div class="group-title">收款信息</div>
                        <div class="group-info-item">
                            <label>开户行：</label>
                            <span>{{currentModel.depositBank}}</span>
                        </div>
                        <div class="group-info-item">
                            <label>收款账号：</label>
                            <span>{{currentModel.bankAccount}}</span>
                        </div>
                    </div>
                </div>
            </xui-scroll>
        </div>
        <image-viewer ref="viewer" prefix="/proxy-img/wechatData/"></image-viewer>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");

export default {
    components: {
        DagBreadcrumb: $import("dag/components/Breadcrumb").Component,
        ImageViewer: $import("dag/components/ImageViewer").Component,
    },
    data() {
        return {
            path: [
                {
                    title: "订单列表",
                    name: "CaseManage",
                    operate: () => {
                        this.$emit("refresh");
                    },
                },
            ],
            tabOptions: {
                data: [
                    {
                        text: "订单信息",
                        value: "BASE",
                    },
                ],
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "保存",
                        color: "primary",
                        operate: () => {
                            this.save();
                        },
                    },
                    {
                        label: "取消",
                        color: "white",
                        operate: () => {
                            this.back();
                        },
                    },
                ],
            },
            productAttrs: [
                {
                    label: "股票代码",
                    key: "code",
                },
                {
                    label: "股票代码",
                    key: "code",
                },
                {
                    label: "股票代码",
                    key: "code",
                },
                {
                    label: "股票代码",
                    key: "code",
                },
                {
                    label: "股票代码",
                    key: "code",
                },
                {
                    label: "股票代码",
                    key: "code",
                },
                {
                    label: "股票代码",
                    key: "code",
                },
            ],
            currentTab: "BASE",
            currentModel: {},
            viewerWait: "",
            viewerImg: {},
            viewerGroup: [],
            selectImgs: {},
        };
    },
    methods: {
        changeTab() {
            this.selectImgs = {};
        },
        open(model) {
            this.currentTab = "BASE";
            this.selectImgs = {};
            model = model || {};
            this.currentModel = model;
        },
        back() {
            this.$emit("refresh");
        },
        refreshTable() {
            this.$emit("refresh");
        },
        viewImage(img, group) {
            this.$refs.viewer.open(img, group);
        },
    },
};
</script>
<style lang="less">
.MODULE-MAJOR.product-detail {
    top: 50px;
    background: #fff;
    .form-scroll-wrap {
        height: calc(100% - 60px);
        background: #f7f7f7;
    }
    .case-toolbar {
        display: block;
        padding-top: 10px;
        text-align: center;
        border-top: 1px solid rgba(149, 149, 149, 0.3);
    }
    .casemanager-longtab.xui-tabs.xui-tabs-style .xui-tab-item {
        min-width: 180px;
    }

    .wechatorder-detail-BASE {
        .group-wrap {
            padding: 15px;
        }
        .group-title {
            font-size: 18px;
            font-weight: bold;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .group-info-item {
            padding: 15px 10px 0px 10px;
            font-size: 16px;
            & > label {
                display: inline-block;
                width: 100px;
                text-align: justify;
                vertical-align: top;
                padding-right: 10px;
                &:after {
                    display: inline-block;
                    width: 100%;
                    content: "";
                    height: 0;
                }
            }
        }
        .identcode-imgs {
            display: inline-block;
            img {
                width: 300px;
                margin-right: 15px;
            }
        }
    }
}
</style>