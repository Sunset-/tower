<template>
    <div class="timeline-panel wechat-order-apply" title="立案申请">
        <div class="info-group">
            <label>申请信息：</label>
            <div class="order-apply-wrap">
                {{order.apply}}
            </div>
        </div>
        <div class="info-group">
            <label>证据材料,共{{transactions.length}}张：</label>
            <div class="transaction-imgs">
                <div class="customer-img" v-for="img in transactions" :key="img.id">
                    <img :src="thumbnail(img)" :onerror="defaultImg(img.path)" @click="viewImage(img,transactions)" :title="img.name">
                    <div class="img-label" :title="img.name">{{img.name}}</div>
                </div>
            </div>
        </div>
        <div class="info-group">
            <label>联系电话：</label>
            <div class="order-apply-wrap">
                {{order.phone}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        order: {},
    },
    data() {
        return {};
    },
    computed: {
        transactions() {
            return (
                (this.order.files &&
                    this.order.files.filter(
                        (item) => item.category == "证据"
                    )) ||
                []
            );
        },
    },
    methods: {
        viewImage(...args) {
            this.$emit.call(this, "viewImage", ...args);
        },
        thumbnail(img) {
            return img.path.endsWith(".pdf")
                ? "/images/icon/pdf_icon.jpg"
                : `/cloud-img/thumbnail_file/${img.path}`;
        },
        defaultImg(src) {
            return `this.src="/cloud-img/${src}";this.onerror=null`;
        },
    },
};
</script>
<style lang="less">
.wechat-order-apply {
    .order-apply-wrap {
        font-size: 16px;
        padding: 10px 0px;
    }
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