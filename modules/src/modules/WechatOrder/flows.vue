<template>
    <div class="wechat-order-flows">
        <time-point v-for="(flow,index) in flows" :key="index" :title="flow.title" :time="calculateTime(flow.status)" :status="calculateStatus(flow.status)" :order="order" :end="index==0">
            <component v-if="flow.widget" :is="flow.widget" :options="flow" :order="order" :status="calculateStatus(flow.status)" @refresh="refreshOrder(true)" @submit="changeOrderStatus(flows[index-1].status)" @viewImage="viewImage"></component>
        </time-point>

        <div style="padding:20px;border-top:1px solid #ababab;">
            <label>手动变更订单状态：</label>
            <xui-select :options="changeStatusSelectOptions" v-model="updateStatus"></xui-select>
            <xui-button color="primary" @click="handChangeOrderStatus">变更订单状态</xui-button>
        </div>
        <!-- 图片查看器 -->
        <image-viewer ref="viewer" prefix="/cloud-img"></image-viewer>
    </div>
</template>
<script>
import TimePoint from "./flows/timepoint.vue";
import OrderApply from "./flows/apply.vue";
import OrderCalculate from "./flows/calculate.vue";
import OrderMark from "./flows/mark.vue";
import OrderMail from "./flows/mail.vue";
import OrderSignup from "./flows/signup.vue";
import OrderEnsure from "./flows/ensure.vue";
import OrderOperate from "./flows/operate.vue";
import OrderFiles from "./flows/files.vue";
import OrderPay from "./flows/pay.vue";
import OrderPayensure from "./flows/payensure.vue";
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
import Store from "./store";

export default {
    components: {
        ImageViewer: $import("dag/components/ImageViewer").Component,
        TimePoint,
        OrderApply,
        OrderCalculate,
        OrderMark,
        OrderSignup,
        OrderEnsure,
        OrderOperate,
        OrderFiles,
        OrderMail,
        OrderPay,
        OrderPayensure,
    },
    props: {
        order: {},
        flows: {},
    },
    data() {
        return {
            updateStatus: "",
            STATUS_APPLY: 10,
            STATUS_CALCULATE: 20,
            STATUS_SIGNUP: 30,
            STATUS_MAIL: 40,
            STATUS_PROSECUTION: 50,
            STATUS_FIRST_INSTANCE: 60,
            STATUS_SECOND_INSTANCE: 70,
            STATUS_PAY_APPLY: 80,
            STATUS_PAY_ENSURE: 90,
            STATUS_FINISH: 100,
        };
    },
    computed: {
        changeStatusSelectOptions() {
            return {
                data: this.flows.map((item) => ({
                    text: item.title,
                    value: item.status,
                })),
            };
        },
    },
    methods: {
        calculateTime(n) {
            return (
                (this.order && this.order.$flow && this.order.$flow[n]) || ""
            );
        },
        calculateStatus(n) {
            var cn = this.order.status || 0;
            return cn == n ? "current" : n < cn ? "done" : "";
        },
        refreshOrder() {
            this.$emit("refresh", true);
        },
        changeOrderStatus(status) {
            if (status) {
                Store.updateStatus({
                    id: this.order.id,
                    status: +status,
                }).then((res) => {
                    this.refreshOrder(true);
                    $tip("操作成功", "success");
                });
            }
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
.wechat-order-flows {
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