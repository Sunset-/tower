<template>
    <div class="timeline-panel wechat-order-apply" :title="options.title">
        <div class="info-group">
            <label>{{options.category}},共{{transactions.length}}张：</label>
            <div class="transaction-imgs">
                <div class="customer-img" v-for="img in transactions" :key="img.id">
                    <img :src="thumbnail(img)" :onerror="defaultImg(img.path)" @click="viewImage(img,transactions)" :title="img.name">
                    <div class="img-label" :title="img.name">{{img.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        order: {},
        options : {}
    },
    data() {
        return {};
    },
    computed: {
        transactions() {
            return (
                (this.order.files &&
                    this.order.files.filter(
                        (item) => item.category == this.options.category
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