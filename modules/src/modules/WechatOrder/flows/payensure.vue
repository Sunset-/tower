<template>
    <div class="timeline-panel wechat-order-payensure" title="申请付款">
        <div class="info-wrap">
            <div class="timepanel-toolbar">
                <xui-file ref="uploader" :options="uploadOptions" :ctx="{category : '收款确认书'}" @success="uploadSuccess">
                </xui-file>
                <xui-button color="danger" size="mini" @click="removeImgs()">删除</xui-button>
            </div>
            <div class="customer-img" v-for="img in images" :key="img.id">
                <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs[img.id]?'active':'']" number="✔" @click="activeImage(img.id)" class="">
                </i>
                <span v-if="img.used" class="file-used"></span>
                <img :src="thumbnail(img)" @click="viewImage(img,images)" :title="img.name">
                <div class="img-label" :title="img.name">{{img.name}}</div>
            </div>
        </div>
        <div class="info-wrap info-current" style="padding-left:5px;margin-top:15px;border-top:1px solid #ababab;padding-top:15px;">
            <xui-button size="big" style="width:200px;" color="success" @click="submit">结束流程</xui-button>
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
        status: "",
        text: "",
    },
    data() {
        return {
            selectImgs: {},
            uploadOptions: {
                label: "上传收款确认书",
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
                        (item) => item.category == "收款确认书"
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
        viewImage(img) {
            window.open(
                `${location.protocol}//${location.host}/cloud-img/${img.path}`
            );
        },
        edit() {
            this.editValue = this.order.claimCompensation;
            this.editting = true;
        },
        cancel() {
            this.editting = false;
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
        uploadSuccess() {
            this.$emit("refresh");
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
        submit() {
            $confirm(`确定${this.options.ensureText}？`).then(() => {
                this.$emit("submit");
            });
        },
    },
};
</script>
<style lang="less">
.wechat-order-payensure {
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
}
</style>