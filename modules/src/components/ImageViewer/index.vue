<template>
    <xui-modal title="图片查看" ref="viewModal" width="1200">
        <div id="customer-viewer" class="image-viewer-wrap">
            <div class="viewer-sidebar">
                <xui-scroll ref="viewerScorll" style="height:100%;">
                    <div class="customer-img" v-for="img in viewerGroup" :key="img.id">
                        <img :class="[img.path==viewerImg.path?'active':'']"
                            :src="proxyPrefix+'/thumbnail_file/'+img.path" :onerror="defaultImg(img.path)"
                            @click="view(img)" :title="img.name" :alt="img.name">
                        <div class="img-label">{{img.name}}</div>
                    </div>
                </xui-scroll>
            </div>
            <xui-viewer class="viewer-major" :wait="viewerWait">
                <img :src="viewerWait" />
            </xui-viewer>
            <div class="viewer-tag">
                <p>{{viewerImg.name}}</p>
                {{viewerIndex}} / {{viewerGroup.length}}
            </div>
        </div>
    </xui-modal>
</template>
<script>
export default {
    props: {
        prefix: "",
    },
    data() {
        return {
            viewerWait: "",
            viewerImg: {},
            viewerGroup: [],
        };
    },
    computed: {
        viewerIndex() {
            return this.viewerGroup.indexOf(this.viewerImg) + 1;
        },
        proxyPrefix() {
            return this.prefix || "/proxy-img";
        },
    },
    methods: {
        open(img, imgGroup) {
            this.$refs.viewModal.open();
            this.$nextTick(() => {
                this.view(img, imgGroup);
            });
        },
        view(img, imgGroup) {
            this.viewerImg = img;
            this.viewerWait = this.src = this.proxyPrefix + `/${img.path}`;
            if (imgGroup) {
                this.viewerGroup = imgGroup;
            }
            this.$nextTick(() => {
                this.$refs.viewerScorll.update();
                //定位
                if (imgGroup) {
                    var currentTop = $(
                        $("#customer-viewer .viewer-sidebar .active")[0]
                    )
                        .parent()
                        .position().top;
                    var fullHeight = $("#customer-viewer .scrollview").height();
                    console.log(
                        ((currentTop * 1.0) / fullHeight) *
                            this.$refs.viewerScorll.scrollBarSpaceHeight
                    );
                    this.$refs.viewerScorll.setVSliderTop(
                        ((currentTop * 1.0) / fullHeight) *
                            this.$refs.viewerScorll.scrollBarSpaceHeight
                    );
                }
            });
        },
        defaultImg(src) {
            return `this.src="${this.proxyPrefix}/${src}";this.onerror=null`;
        },
    },
};
</script>