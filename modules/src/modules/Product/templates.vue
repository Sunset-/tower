<template>
    <div>
        <xui-toolbar :options="toolbarOptions" style="margin:10px 0px 0px 30px;"></xui-toolbar>
        <div class="detail-image-group" v-for="group in imageGroups" :key="group.title">
            <p class="image-group-title">
                <span>{{group.title}}（共{{group.images.length}}张）</span>
                <xui-file ref="uploader" :options="uploadOptions" :ctx="{category : group.title}" @success="uploadSuccess">
                </xui-file>
            </p>
            <div class="customer-img" v-for="img in group.images" v-show="!img.company" :key="img.id">
                <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs&&selectImgs[img.id]?'active':'']" :number="selectImgs&&selectImgs[img.id]" @click="activeImage(img.id)" class="">
                </i>
                <img :src="thumbnail(img.path)" @click="viewImage(img,group.images)" :title="img.name" :alt="img.name">
                <div class="img-label" :title="img.name">{{img.name}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const FileManage = $import("dag/modules/File");

export default {
    props: {
        currentModel: {},
        category: {},
        assign: {},
    },
    data() {
        return {
            imageGroups: [
                {
                    title: "诉讼模板",
                    images: [],
                },
                {
                    title: "证据目录",
                    images: [],
                },
            ],
            selectImgs: {},
            uploadOptions: {
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
                filter(f) {
                    return true;
                },
                headers: {},
                formData: (ctx) => {
                    return {
                        ownerId: this.currentModel.id,
                        dirType: "product_file",
                        dir: `${this.currentModel.disclosureDate}${this.currentModel.code}_${this.currentModel.name}`,
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
        campanies() {
            var m = {};
            this.imageGroups.forEach((g) =>
                g.images.forEach((img) => {
                    if (img.company) {
                        m[img.company] = m[img.company] || [];
                        m[img.company].push(img);
                    }
                })
            );
            return Object.keys(m).map((item) => ({
                name: item,
                title: this.category,
                images: m[item],
            }));
        },
        toolbarOptions() {
            return {
                size: "small",
                tools: [
                    {
                        label: "全选",
                        color: "",
                        premise: () => {
                            return !this.isAllCheck();
                        },
                        operate: () => {
                            this.selectAll(true);
                        },
                    },
                    {
                        label: "取消全选",
                        color: "",
                        premise: () => {
                            return this.isAllCheck();
                        },
                        operate: () => {
                            this.selectAll(false);
                        },
                    },
                    {
                        label: "删除",
                        color: "danger",
                        premise: () => {
                            return this.isOtherCheck();
                        },
                        operate: () => {
                            this.removeImgs();
                        },
                    },
                ],
            };
        },
    },
    watch: {
        currentModel() {
            this.refresh();
        },
    },
    methods: {
        thumbnail(path){
            path = path.toLowerCase();
            if(path.endsWith(".docx")||path.endsWith(".doc")){
                return "/images/icon/doc_icon.jpg"
            }else{
                return "/images/icon/pdf_icon.jpg"
            }
        },
        refresh() {
            if (this.currentModel.id) {
                FileManage.Query({
                    ownerId: this.currentModel.id,
                }).then((res) => {
                    var c_imgs = res.reduce((res, item) => {
                        res[item.category] = res[item.category] || [];
                        res[item.category].push(item);
                        return res;
                    }, {});
                    this.imageGroups.forEach((g) => {
                        g.images = c_imgs[g.title] || [];
                    });
                });
            }
        },
        viewImage(img, group) {
            window.open(
                `${location.protocol}//${location.host}/proxy-img/${img.path}`
            );
        },
        activeImage(id, flag) {
            if (flag === false || (flag === void 0 && this.selectImgs[id])) {
                var index = this.selectImgs[id];
                Vue.delete(this.selectImgs, id);
                Object.keys(this.selectImgs).forEach((k) => {
                    if (this.selectImgs[k] > index) {
                        Vue.set(this.selectImgs, k, this.selectImgs[k] - 1);
                    }
                });
            } else {
                Vue.set(
                    this.selectImgs,
                    id,
                    Object.keys(this.selectImgs).length + 1
                );
            }
        },
        isOtherCheck() {
            return Object.keys(this.selectImgs).length > 0;
        },
        isAllCheck() {
            for (var g = 0, group; (group = this.imageGroups[g]); g++) {
                var imgs = group.images || [];
                for (var i = 0; i < imgs.length; i++) {
                    if (!this.selectImgs || !this.selectImgs[imgs[i].id]) {
                        return false;
                    }
                }
            }
            return true;
        },
        selectAll(flag) {
            for (var g = 0, group; (group = this.imageGroups[g]); g++) {
                var imgs = group.images || [];
                for (var i = 0; i < imgs.length; i++) {
                    this.activeImage(imgs[i].id, flag);
                }
            }
        },
        removeImgs() {
            var ids = Object.keys(this.selectImgs);
            if (ids.length == 0) {
                return;
            }
            $confirm(`确定删除选定的${ids.length}个文件？`).then(() => {
                FileManage.Remove(ids).then((res) => {
                    $tip("删除成功", "success");
                    this.refresh();
                });
            });
        },
        uploadSuccess() {
            this.refresh();
        },
    },
};
</script>
<style lang="less">
.detail-image-group {
    padding: 5px 10px;
    margin: 0px 20px;
    .image-group-title {
        color: #000;
        height: 36px;
        line-height: 36px;
        font-weight: normal;
        border-bottom: 1px solid rgba(149, 149, 149, 0.3);
        padding-left: 5px;
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 5px;
        & > * {
            display: inline-block;
            vertical-align: middle;
        }
    }
}
.customer-img-category {
    margin-top: 10px;
}
.customer-img {
    position: relative;
    display: inline-block;
    width: 150px;
    height: 213px;
    margin: 10px 10px 10px 0px;
    font-size: 12px;
    img {
        width: 100%;
        border: 1px solid #e8e8e8;
    }
    & > .img-label {
        text-align: center;
        padding-top: 5px;
        padding-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .img-checker {
        position: absolute;
        z-index: 5;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 30px;
        font-size: 30px;
        line-height: 30px;
        border-radius: 50px;
        color: rgba(#cdcdcd, 0.5);
        cursor: pointer;
        &.active {
            color: #127bfe;
            &:after {
                content: attr(number);
                color: #fff;
                position: absolute;
                left: 50%;
                font-size: 14px;
                top: 50%;
                transform: translate(-50%, -50%);
                background: #127bfe;
                width: 18px;
                height: 18px;
                border-radius: 50px;
                text-align: center;
                line-height: 18px;
            }
        }
    }
}
</style>