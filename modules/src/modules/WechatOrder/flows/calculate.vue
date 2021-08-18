<template>
    <div class="timeline-panel wechat-order-apply" title="核算可主张赔偿金额">
        <!-- 核算 -->
        <xui-form ref="form" :view="!editting" :options="formOptions" @submit="save"></xui-form>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");
import Store from "../store";

export default {
    props: {
        order: {},
    },
    data() {
        return {
            editting: false,
            claimCompensation: "",
            mailAddress: "",
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "可主张赔偿",
                        name: "claimCompensation",
                        widget: "input",
                        placeholder: "请输入可主张赔偿金额",
                        append: "元",
                        default: 0,
                        view(v) {
                            return (v || 0) + "元";
                        },
                    },
                    {
                        label: "服务主体",
                        name: "serviceSubject",
                        widget: "select",
                        placeholder: "请选择服务主体",
                        data: [
                            {
                                text: "上海冰盖网络科技有限公司",
                                value: "上海冰盖网络科技有限公司",
                            },
                            {
                                text: "冰盖（深圳）机器人技术有限公司",
                                value: "冰盖（深圳）机器人技术有限公司",
                            },
                        ],
                    },
                    {
                        label: "资料邮寄地址",
                        name: "mailAddress",
                        widget: "textarea",
                        monopolize: true,
                        newline: true,
                        placeholder: "请填写资料邮寄地址",
                    },
                    {
                        label: "是否受理",
                        name: "accept",
                        widget: "radio",
                        default: "1",
                        view(v) {
                            return (
                                {
                                    1: "<span class='color-success'>是</span>",
                                    2: "<span class='color-error'>否</span>",
                                }[v] || "未设置"
                            );
                        },
                        data: [
                            {
                                text: "是",
                                value: "1",
                            },
                            {
                                text: "否",
                                value: "2",
                            },
                        ],
                    },
                ],
                toolbar: [
                    {
                        label: "修改",
                        color: "primary",
                        premise: () => {
                            return !this.editting;
                        },
                        operate: () => {
                            var order = JSON.parse(JSON.stringify(this.order));
                            if(!order.mailAddress){
                                order.mailAddress = "上海浦东新区东方路1988号华南大厦701上海百悦律师事务所，李女士，158 2119 0468";
                            }
                            this.$refs.form.reset(order);
                            this.editting = true;
                        },
                    },
                    {
                        label: "确定",
                        color: "success",
                        premise: () => {
                            return this.editting;
                        },
                        signal: "SUBMIT",
                    },
                    {
                        label: "取消",
                        premise: () => {
                            return this.editting;
                        },
                        color: "",
                        operate: () => {
                            this.$refs.form.reset(this.order);
                            this.editting = false;
                        },
                    },
                ],
            },
        };
    },
    watch: {
        order() {
            this.$refs.form.reset(this.order);
            this.editting = false;
        },
    },
    methods: {
        viewImage(...args) {
            this.$emit.call(this, "viewImage", ...args);
        },
        save(model) {
            Store.updateClaim(model).then((res) => {
                this.editting = false;
                this.$emit("refresh");
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