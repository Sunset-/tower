<template>
    <div class="timeline-panel wechat-order-files" :title="options.title+' - 法律文书'+`(${images.length})`">
        <!-- 核算 -->
        <div class="info-group order-claim">
            <div class="timepanel-operate">
                <xui-button v-show="status=='current'" class="operate-btn" :color="options.color||'success'"
                    @click="submit()">{{options.ensureText||'确认'}}</xui-button>
            </div>
            <div class="timepanel-toolbar">
                <xui-file ref="uploader" :options="uploadOptions" :ctx="{category : options.category}"
                    @success="uploadSuccess">
                </xui-file>
                <xui-button color="danger" size="mini" @click="removeImgs()">删除</xui-button>
            </div>
            <div class="customer-img" v-for="img in images" :key="img.id">
                <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs[img.id]?'active':'']" number="✔"
                    @click="activeImage(img.id)" class="">
                </i>
                <span v-if="img.used" class="file-used"></span>
                <img :src="thumbnail(img)" :onerror="defaultImg(img.path)" @click="viewImage(img,images)"
                    :title="img.name">
                <div class="img-label" :title="img.name">{{img.name}}</div>
            </div>
        </div>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const FileManage = $import("dag/modules/File");
import Store from "../store";

export default {
    props: {
        order: {},
        options: {},
        title: "",
        status: "",
        text: "",
        color: "",
    },
    data() {
        return {
            selectImgs: {},
            uploadOptions: {
                label: this.options.uploadText || "上传资料",
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
                url: "/cloud-api/file/upload",
                className: "my-uploader-trigger",
                filter(f) {
                    return true;
                },
                headers: {},
                formData: (ctx) => {
                    return {
                        ownerId: this.order.id,
                        dirType: "wechat_file",
                        dir: `order_${this.order.id}`,
                        category: ctx.category,
                    };
                },
                progress(v) {
                    console.log(v);
                },
            },
        };
    },
    computed: {
        images() {
            return (
                (this.order &&
                    this.order.files &&
                    this.order.files.filter(
                        (item) => item.category == this.options.category
                    )) ||
                []
            );
        },
    },
    methods: {
        thumbnail(img) {
            var path = img.path.toLowerCase();
            if (path.endsWith(".docx") || path.endsWith(".doc")) {
                return "/images/icon/doc_icon.jpg";
            } else if (path.endsWith(".pdf")) {
                return "/images/icon/pdf_icon.jpg";
            } else {
                return `/cloud-img/thumbnail_file/${img.path}`;
            }
        },
        defaultImg(src) {
            return `this.src="/cloud-img/${src}";this.onerror=null`;
        },
        viewImage(...args) {
            this.$emit.call(this, "viewImage", ...args);
        },
        submit() {
            $confirm(`确定${this.options.ensureText}？`).then(() => {
                this.$emit("submit");
            });
        },
        save() {
            Store.updateClaim({
                id: this.order.id,
                claimCompensation: this.editValue,
            }).then((res) => {
                this.editting = false;
                this.order.claimCompensation = this.editValue;
                $tip("修改成功", "success");
            });
        },
        activeImage(id, flag) {
            var f;
            if (flag === true || flag === false) {
                f = flag;
            } else {
                f = !this.selectImgs[id];
            }
            if (f) {
                Vue.set(this.selectImgs, id, f);
            } else {
                Vue.delete(this.selectImgs, id, f);
            }
        },
        uploadSuccess() {
            this.$emit("refresh");
        },
        removeImgs() {
            var ids = Object.keys(this.selectImgs);
            if (ids.length == 0) {
                return;
            }
            $confirm(`确定删除选定的${ids.length}个文件？`).then(() => {
                FileManage.RemoveCloudFile(ids).then((res) => {
                    $tip("删除成功", "success");
                    this.$emit("refresh");
                });
            });
        },
    },
};
</script>
<style lang="less">
.wechat-order-files {
    .timepanel-operate {
        padding: 0px 0px 10px 5px;
        border-bottom: 1px solid #dedede;
        margin-bottom: 10px;
    }
    .timepanel-toolbar {
        & > * {
            vertical-align: top;
            margin-right: 10px;
        }
    }
}
.time-point-wrap.done {
    .timepanel-operate {
        display: none;
    }
}
</style>