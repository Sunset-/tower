<template>
    <div>
        <dag-breadcrumb ref="path" :path="path"></dag-breadcrumb>
        <div class="MODULE-MAJOR product-detail">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions" @change="changeTab">
            </xui-tabs>
            <xui-scroll ref="scroll" class="form-scroll-wrap">
                <div class="wechatorder-detail-BASE" v-show="currentTab=='BASE'" style="background:#fff;">
                    <time-point title="结束" :time="calculateTime(STATUS_FINISH)" :status="calculateStatus(STATUS_FINISH)" :end="true">
                    </time-point>
                    <time-point title="立案" :time="calculateTime(STATUS_SUBMIT_ENSURED)" :status="calculateStatus(STATUS_SUBMIT_ENSURED)">
                        <!-- 待立案 -->
                        <order-calculate :order="currentModel" @refresh="refreshOrder(true)" @submit="changeOrderStatus(STATUS_FINISH)"></order-calculate>
                    </time-point>
                    <time-point title="待确认" :time="calculateTime(STATUS_SUBMIT_ENSURE)" :status="calculateStatus(STATUS_SUBMIT_ENSURE)">
                        <!-- 立案文书待确认 -->
                        <order-ensure @refresh="refreshOrder(true)" :order="currentModel" title="待确认" text="二审通过" color="success" @viewImage="viewImage" @submit="changeOrderStatus(STATUS_PAY_APPLY)">
                        </order-ensure>
                    </time-point>
                    <time-point title="立案文书" :time="calculateTime(STATUS_CHECK)" :status="calculateStatus(STATUS_CHECK)">
                        <!-- 立案文书 -->
                        <order-files @refresh="refreshOrder(true)" :order="currentModel" title="立案文书" text="整理完成，交由客户确认" color="success" @viewImage="viewImage" @submit="changeOrderStatus(STATUS_SUBMIT_ENSURE)">
                        </order-files>
                    </time-point>
                    <time-point title="提交申请" :time="currentModel.createTime" :status="calculateStatus(STATUS_APPLY)">
                        <!-- 申请 -->
                        <order-apply :order="currentModel" @viewImage="viewImage"></order-apply>
                    </time-point>
                </div>
                <div style="padding:20px;border-top:1px solid #ababab;">
                    <label>手动变更订单状态：</label>
                    <xui-select :options="changeStatusSelectOptions" v-model="updateStatus"></xui-select>
                    <xui-button color="primary" @click="handChangeOrderStatus">变更订单状态</xui-button>
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

import TimePoint from "./timepoint.vue";
import OrderApply from "./apply.vue";
import OrderCalculate from "./calculate.vue";
import OrderSignup from "./signup.vue";
import OrderOperate from "./operate.vue";
import OrderFiles from "./files.vue";
import OrderEnsure from "./ensure.vue";

export default {
    components: {
        DagBreadcrumb: $import("dag/components/Breadcrumb").Component,
        ImageViewer: $import("dag/components/ImageViewer").Component,
        TimePoint,
        OrderApply,
        OrderCalculate,
        OrderSignup,
        OrderOperate,
        OrderFiles,
        OrderEnsure,
    },
    data() {
        return {
            STATUS_APPLY: 10,
            STATUS_CHECK: 20,
            STATUS_SUBMIT_ENSURE: 30,
            STATUS_SUBMIT_ENSURED: 40,
            STATUS_FINISH: 100,
            path: [
                {
                    title: "订单列表",
                    name: "WechatOrder",
                },
            ],
            changeStatusSelectOptions: {
                enum: "WECHAT_ORDER_CROSSDOMAIN_STATUS",
            },
            tabOptions: {
                data: [
                    {
                        text: "订单处理流程",
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
        calculateTime(n) {
            return (
                (this.currentModel &&
                    this.currentModel.$flow &&
                    this.currentModel.$flow[n]) ||
                ""
            );
        },
        calculateStatus(n) {
            var cn = this.currentModel.status || 0;
            return cn == n ? "current" : n < cn ? "done" : "";
        },
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
                    this.currentModel.$flow = res.flows.reduce((res, item) => {
                        res[item.status] = item.operateTime;
                        return res;
                    }, {});
                    this.currentModel.$message = res.messages.reduce(
                        (res, item) => {
                            res[item.category] = res[item.category] || [];
                            res[item.category].push(item);
                            return res;
                        },
                        {}
                    );
                })
                .catch((e) => {
                    this.currentModel = {};
                });
        },
        changeOrderStatus(status) {
            Store.updateStatus({
                id: this.orderId,
                status: +status,
            }).then((res) => {
                this.refreshOrder(true);
                $tip("操作成功", "success");
            });
        },
        handChangeOrderStatus() {
            var status = this.updateStatus;
            if (status == "") {
                return;
            }
            $confirm(`确定修改订单状态？`).then(() => {
                return this.changeOrderStatus(status);
            });
        },
        refreshTable() {
            this.$emit("refresh");
        },
        viewImage(img, group) {
            if (img.path.endsWith(".PDF") || img.path.endsWith(".pdf")) {
                window.open(
                    `${location.protocol}//${location.host}/proxy-img/${img.path}`
                );
            } else {
                this.$refs.viewer.open(img, group);
            }
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
        .timeline-panel {
            position: relative;
            border: 1px solid #127bfe;
            border-radius: 4px;
            width: 800px;
            padding: 10px;
            padding-top: 40px;
            &:before {
                content: attr(title);
                background: #127bfe;
                color: #fff;
                position: absolute;
                top: 0px;
                right: 0px;
                left: 0px;
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
            }
            .info-group {
                padding: 5px 0px;
                & > label {
                    color: #777;
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