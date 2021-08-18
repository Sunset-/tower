<template>
    <div class="timeline-panel wechat-order-pay" title="申请付款">
        <div class="info-wrap">
            <div class="info-title info-current">等待用户提交收款信息...</div>
            <div class=" info-done">
                <div class="info-title">客户申请收款信息</div>
                <div class="info-item">
                    <label>开户行：</label>
                    <span>{{order.depositBank}}</span>
                </div>
                <div class="info-item">
                    <label>收款账号：</label>
                    <span style="font-weight:bold;">{{order.bankAccount}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const FileManage = $import("dag/modules/File");
import Store from "./store";

export default {
    props: {
        order: {},
        status: "",
    },
    data() {
        return {
      
        };
    },
    methods: {
    },
};
</script>
<style lang="less">
.wechat-order-pay {
    .info-wrap {
        .info-title {
            font-size: 16px;
            font-weight: bold;
            padding: 0px 0px 10px 0px;
        }
        .info-item {
            padding: 5px 0px;
        }
    }

    .timepanel-toolbar {
        & > * {
            vertical-align: top;
            margin-right: 10px;
        }
    }
    .pay-template {
        margin-top: 15px;
        border-top: 1px solid #ababab;
        padding-top: 15px;
    }
}
</style>