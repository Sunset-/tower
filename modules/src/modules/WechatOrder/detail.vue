<template>
    <div>
        <dag-breadcrumb ref="path" :path="path"></dag-breadcrumb>
        <div class="MODULE-MAJOR product-detail">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions" @change="changeTab">
            </xui-tabs>
            <xui-scroll ref="scroll" class="form-scroll-wrap">
                <div class="wechatorder-detail-BASE" v-show="currentTab=='BASE'" style="background:#fff;">
                    <order-flows :order="currentModel" :flows="flows" @refresh="refreshOrder"></order-flows>
                </div>
            </xui-scroll>
        </div>
        <image-viewer ref="viewer" prefix="/cloud-img"></image-viewer>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");

import TimePoint from "./flows/timepoint.vue";
import OrderApply from "./flows/apply.vue";
import OrderCalculate from "./flows/calculate.vue";
import OrderSignup from "./flows/signup.vue";
import OrderEnsure from "./flows/ensure.vue";
import OrderOperate from "./flows/operate.vue";
import OrderFiles from "./flows/files.vue";
import OrderPay from "./flows/pay.vue";
import OrderPayensure from "./flows/payensure.vue";
import OrderFlows from "./flows.vue";

export default {
    components: {
        DagBreadcrumb: $import("dag/components/Breadcrumb").Component,
        ImageViewer: $import("dag/components/ImageViewer").Component,
        OrderFlows: OrderFlows,
        TimePoint,
        OrderApply,
        OrderCalculate,
        OrderSignup,
        OrderEnsure,
        OrderOperate,
        OrderFiles,
        OrderPay,
        OrderPayensure,
    },
    data() {
        return {
            flows: [
                { title: "结束", status: 100, widget: "" },
                {
                    title: "收款确认",
                    status: 90,
                    widget: "order-payensure",
                    ensureText: "结束流程",
                },
                { title: "申请付款", status: 80, widget: "order-pay" },
                {
                    title: "二审",
                    status: 70,
                    widget: "order-files",
                    category: "二审",
                    uploadText : "上传法律文书",
                    ensureText: "二审通过",
                },
                {
                    title: "一审",
                    status: 60,
                    widget: "order-files",
                    category: "一审",
                    uploadText : "上传法律文书",
                    ensureText: "一审通过",
                },
                {
                    title: "待起诉",
                    status: 50,
                    widget: "order-files",
                    category: "服务合同",
                    uploadText : "上传服务合同",
                    ensureText: "提交诉讼",
                },
                {
                    title: "待邮寄",
                    status: 40,
                    widget: "order-mail",
                    category: "材料邮寄",
                    replayText: "回复签收说明",
                    ensureText: "确认签收资料",
                },
                { title: "待签约", status: 30, widget: "order-signup" },
                { title: "初步核算", status: 20, widget: "order-calculate" },
                {
                    title: "提交申请",
                    status: 10,
                    widget: "order-apply",
                    category: "证券交易记录",
                },
            ],
            path: [
                {
                    title: "订单列表",
                    name: "WechatOrder",
                },
            ],
            tabOptions: {
                data: [
                    {
                        text: "订单处理流程",
                        value: "BASE",
                    },
                ],
            },
            currentTab: "BASE",
            currentModel: {},
            viewerWait: "",
            viewerImg: {},
            viewerGroup: [],
            selectImgs: {},
            updateStatus: "",
        };
    },
    computed: {
        orderId() {
            return this.$route.params.id;
        },
    },
    watch: {
        orderId(v) {
            this.refreshOrder();
        },
    },
    mounted() {
        this.refreshOrder();
    },
    methods: {
        changeTab() {
            this.selectImgs = {};
        },
        open() {
            this.currentTab = "BASE";
            this.selectImgs = {};
            this.refreshOrder();
        },
        refreshOrder(fromSelf) {
            if (fromSelf) {
                this.$emit("refresh");
            } else {
                this.currentModel = {};
            }
            if (!this.orderId) {
                return;
            }
            Store.get(this.orderId)
                .then((res) => {
                    this.currentModel = res;
                })
                .catch((e) => {
                    this.currentModel = {};
                });
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
        padding: 20px 50px;
    }
}
</style>