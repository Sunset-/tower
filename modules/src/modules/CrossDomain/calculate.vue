<template>
    <div class="timeline-panel wechat-order-apply" title="立案">
        <!-- 核算 -->
        <div class="info-group order-claim">
            <label>案号：</label>
            <span style="padding:0px 10px;" v-show="!editting">{{caseNo?caseNo:'未填写'}}</span>
            <xui-input style="width:300px" v-model="editValue" v-show="editting"></xui-input>
            <xui-button v-show="!editting" @click="edit()">修改</xui-button>
            <xui-button v-show="editting" @click="save()" color="success">确定立案</xui-button>
            <xui-button v-show="editting" @click="cancel()" color="">取消</xui-button>
        </div>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");
import Store from "./store";

const CATEGORY_CASENO = "案号";

export default {
    props: {
        order: {},
    },
    data() {
        return {
            editting: false,
            editValue: "",
        };
    },
    computed: {
        caseNo() {
            var msg =
                (this.order.messages &&
                    this.order.messages.filter(
                        (item) => item.category == CATEGORY_CASENO
                    )) ||
                [];
            return (msg.length && msg[0].content) || "";
        },
    },
    methods: {
        viewImage(...args) {
            this.$emit.call(this, "viewImage", ...args);
        },
        edit() {
            this.editValue = this.order.$message[CATEGORY_CASENO]&&this.order.$message[CATEGORY_CASENO][0].content || "";
            this.editting = true;
        },
        cancel() {
            this.editting = false;
        },
        save() {
            var msg =
                this.order.messages.filter(
                    (item) => item.category == CATEGORY_CASENO
                ) || [];
            Store.submitMessage({
                id: msg.length ? msg[0].id : void 0,
                orderId: this.order.id,
                userId: "admin",
                content: `${this.editValue}`,
                category: CATEGORY_CASENO,
            }).then((res) => {
                this.editting = false;
                this.$emit("submit");
            });
        },
    },
};
</script>
<style lang="less">
.wechat-order-apply {
    .transaction-img {
        width: 150px;
    }

    .order-claim {
        & > * {
            display: inline-block;
            vertical-align: middle;
        }
        .xui-input.xui-input-style {
            overflow: hidden;
        }
    }
}
</style>