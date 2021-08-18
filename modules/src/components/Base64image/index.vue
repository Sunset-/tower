<template>
    <div class="xui-base64image">
        <div class="xui-base64image-imgwrap" v-if="imageSrc">
            <img width="100" :src="imageSrc" alt="">
            <i class="xui-icon xui-icon-close" @click="clear"></i>
        </div>
        <xui-file :options="fileOptions"></xui-file>
        <div style="width:0px;height:0px;overflow:hidden;">
            <canvas ref="cvs"></canvas>
        </div>
    </div>
</template>
<script>
export default {
    model: {
        prop: "value",
        event: "input",
    },
    props: ["value", "options", "model"],
    data() {
        return {
            imageSrc: "",
            fileOptions: {
                label: "上传",
                size: "mini",
                color: "primary",
                multiple: true,
                directory: false,
                disabled: false,
                method: "post",
                filename: "file",
                thumbnail: true,
                wait: false,
                max: 10,
                drop: true,
                url: "/api/file/upload",
                className: "my-uploader-trigger",
                filter: (f) => {
                    var reader = new FileReader();
                    reader.readAsDataURL(f.file);
                    var self = this;
                    reader.onload = function (e) {
                        var img = new Image();
                        self.imageSrc = e.target.result;
                        //有损压缩
                        // var cvs = self.$refs.cvs;
                        // var cvsCtx = cvs.getContext("2d");
                        // img.onload = function () {
                        //     var w = img.width;
                        //     var h = img.height;
                        //     cvs.width = w; //该值影响缩放后图片的大小
                        //     cvs.height = h; //该值影响缩放后图片的大小
                        //     //img放入画布中
                        //     cvsCtx.drawImage(img, 0, 0, w, h); //把画布中的数据，写出到某img的src里
                        //     var imageData = cvs.toDataURL("image/png");
                        //     self.imageSrc = imageData;
                        // };
                    };
                    return false;
                },
                headers: {},
                formData: (ctx) => {
                    return {};
                },
                progress(v) {
                    console.log(v);
                },
            },
        };
    },
    methods: {
        clear() {
            this.imageSrc = "";
        },
    },
    watch: {
        imageSrc(v) {
            this.$emit("input", v.substring(v.indexOf(",") + 1));
        },
        value(v) {
            debugger;
        },
    },
};
</script>
<style lang="less">
.xui-base64image {
    .xui-base64image-imgwrap {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #dedede;
        .xui-icon-close {
            position: absolute;
            right: 3px;
            top: 3px;
            cursor: pointer;
            &:hover {
                color: red;
            }
        }
    }
}
</style>