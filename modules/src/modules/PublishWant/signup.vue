<template>
    <div class="timeline-panel" title="签约信息">
        <div class="info-title info-current">
            等待客户上传身份信息...
        </div>
        <div class="info-done">
            <div class="info-group">
                <label>手机号码：</label>
                <span>{{order.phone?order.phone:''}}</span>
            </div>
            <div style="margin-top:10px;">
                身份证照片：
            </div>
            <div class="transaction-imgs">
                <div class="customer-img" style="height:auto;" v-for="img in identImgs" :key="img.id">
                    <img :src="thumbnail(img)" :onerror="defaultImg(img.path)" @click="viewImage(img,identImgs)" :title="img.name">
                </div>
            </div>
            <div class="info-group">
                <label>身份证识别信息：</label>
                <span></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        order: {},
    },
    computed: {
        identImgs() {
            return (
                (this.order.files &&
                    this.order.files.filter(
                        (item) => item.category == "身份证信息"
                    )) ||
                []
            );
        },
    },
    data() {
        return {};
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
.info-title {
    font-size: 16px;
    font-weight: bold;
    padding: 5px 0px 10px 0px;
}
</style>