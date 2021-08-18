<template>
    <div>
        <xui-toolbar :options="toolbarOptions" style="margin:10px 0px 0px 30px;"></xui-toolbar>
        <div class="detail-image-group" v-for="(group,index) in imageGroups" :key="index">
            <p class="image-group-title">
                <span>{{group.title}}（共{{group.images.length}}张）</span>
                <xui-file ref="uploader" :options="uploadOptions" :ctx="{category : group.title}" @success="uploadSuccess">
                </xui-file>
            </p>
            <div class="customer-img" v-for="img in group.images" v-show="!img.company" :key="img.id">
                <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs[category]&&selectImgs[category][img.id]?'active':'']" :number="selectImgs[category]&&selectImgs[category][img.id]" @click="activeImage(img.id)" class="">
                </i>
                <span v-if="img.used" class="file-used"></span>
                <img :src="'/proxy-img/thumbnail_file/'+img.path" :onerror="defaultImg(img.path)" @click="viewImage(img,group.images)" :title="img.name" :alt="img.name">
                <div class="img-label" :title="img.name">{{img.name}}</div>
            </div>
            <div v-for="group in campanies" :key="group.name" class="customer-img-category">
                <div class="xui-edittable xui-edittable-style xui-datatable xui-datatable-style xui-datapage xui-datapage-style">
                    <table class="xui-datatable-table table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th class="text-left" style="padding-left:10px;">{{group.name}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left">
                                    <div style="white-space:normal;overflow:auto;">
                                        <div class="customer-img" v-for="img in group.images" :key="img.id">
                                            <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs[category]&&selectImgs[category][img.id]?'active':'']" :number="selectImgs[category]&&selectImgs[category][img.id]" @click="activeImage(img.id)" class="">
                                            </i>
                                            <span v-if="img.used" class="file-used"></span>
                                            <img :src="'/proxy-img/thumbnail_file/'+img.path" :onerror="defaultImg(img.path)" @click="viewImage(img,group.images)" :title="img.name" :alt="img.name">
                                            <div class="img-label" :title="img.name">{{img.name}}</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <xui-modal ref="namemodal" title="生成pdf" :width="500">
            <div class="customer-generate-pdf">
                <xui-form ref="nameform" :options="pdfOptions" @submit="savePDF"></xui-form>
            </div>
        </xui-modal>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const Product = $import("dag/modules/Product");
const FileManage = $import("dag/modules/File");

export default {
    props: {
        imageGroups: {},
        currentModel: {},
        selectImgs: {},
        category: {},
        assign: {},
    },
    data() {
        return {
            pdfName: "",
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
                        dir: `${this.currentModel.id}${this.currentModel.name}`,
                        dirType : "customer_file",
                        category: ctx.category,
                    };
                },
                progress(v) {
                    console.log(v);
                },
            },
            filenameOptions: {
                tools: [
                    {
                        label: "确定",
                        color: "primary",
                        operate: () => {
                            this.savePDF();
                        },
                    },
                    {
                        label: "取消",
                        color: "",
                        operate: () => {
                            this.$refs.namemodal.close();
                        },
                    },
                ],
            },
            pdfOptions: {
                cols: 1,
                fields: [
                    {
                        label: "产品",
                        name: "dir",
                        widget: "select",
                        data: () => {
                            return Product.GetProducts().then((res) => {
                                return res.list.map((item) => ({
                                    text: `${item.code}_${item.name}`,
                                    value: `${item.disclosureDate}${item.code}`,
                                }));
                            });
                        },
                    },
                    {
                        label: "文件名",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入文件名",
                    },
                ],
                toolbar: {
                    tools: [
                        {
                            label: "确定",
                            color: "primary",
                            signal: "SUBMIT",
                        },
                        {
                            label: "取消",
                            color: "",
                            signal: "CANCEL",
                        },
                    ],
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
                    {
                        label: "添加到",
                        type: "dropdown",
                        color: "white",
                        size: "mini",
                        premise: () => {
                            return this.assign && this.isOtherCheck();
                        },
                        items: (() => {
                            var categories = [];
                            if (this.currentModel.securitiesCompanies) {
                                this.currentModel.securitiesCompanies
                                    .split(";")
                                    .forEach((item) => {
                                        categories.push({
                                            label: item,
                                            operate: () => {
                                                this.saveToCompanyDept(item);
                                            },
                                        });
                                    });
                            }
                            return categories;
                        })(),
                    },
                    {
                        label: "法院用文书生成",
                        color: "primary",
                        premise: () => {
                            return this.isOtherCheck();
                        },
                        operate: () => {
                            this.generatePDF();
                        },
                    },
                ],
            };
        },
    },
    methods: {
        defaultImg(src) {
            return `this.src="/proxy-img/${src}";this.onerror=null`;
        },
        viewImage(img, group) {
            this.$emit("view", img, group);
        },
        activeImage(id, flag) {
            this.$emit("select", this.category, id, flag);
        },
        isOtherCheck() {
            return (
                this.selectImgs[this.category] &&
                Object.keys(this.selectImgs[this.category]).length > 0
            );
        },
        isAllCheck() {
            for (var g = 0, group; (group = this.imageGroups[g]); g++) {
                var imgs = group.images || [];
                for (var i = 0; i < imgs.length; i++) {
                    if (
                        !this.selectImgs[this.category] ||
                        !this.selectImgs[this.category][imgs[i].id]
                    ) {
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
            var ids = Object.keys(this.selectImgs[this.category]);
            if (ids.length == 0) {
                return;
            }
            $confirm(`确定删除选定的${ids.length}个文件？`).then(() => {
                FileManage.Remove(ids).then((res) => {
                    $tip("删除成功", "success");
                    this.$emit("refresh");
                });
            });
        },
        uploadSuccess() {
            this.$emit("refresh");
        },
        saveToCompanyDept(companyDept) {
            var imgs = this.selectImgs[this.category];
            if (!imgs || Object.keys(imgs).length == 0) {
                $tip("请选择文书", "info");
                return;
            }
            FileManage.AssignCompany({
                companyDept: companyDept,
                ids: Object.keys(imgs),
            }).then(() => {
                Vue.delete(this.selectImgs, this.category);
                this.$emit("refresh");
            });
        },
        generatePDF() {
            var imgs = this.selectImgs[this.category];
            if (!imgs || Object.keys(imgs).length == 0) {
                $tip("请选择文书", "info");
                return;
            }
            this.$refs.namemodal.open();
            this.$refs.nameform.reset({
                name: `${this.category}上传法院`,
            });
        },
        savePDF(model) {
            var imgs = this.selectImgs[this.category];
            var ids = Object.keys(imgs);
            ids.sort((a, b) => {
                return imgs[a] > imgs[b] ? 1 : imgs[a] < imgs[b] ? -1 : 0;
            });
            FileManage.GeneratePDF({
                ownerId: this.currentModel.id,
                userDir: `${this.currentModel.identCode}${this.currentModel.name}`,
                dir: model.dir,
                name: model.name || "未命名",
                ids: ids,
            }).then(() => {
                Vue.delete(this.selectImgs, this.category);
                $tip("操作成功", "success");
                this.$refs.namemodal.close();
                this.$emit("refresh");
            });
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
    vertical-align: top;
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
    .file-used{
        position: absolute;
        z-index: 5;
        top: 0px;
        left: 0px;
        font-size:14px;
        background:rgba(red,0.5);
        color:white;
        padding:5px;
        &:after{
            content:'已使用';
        }
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
.customer-generate-pdf {
    .xui-form.xui-form-style .xui-toolbar.xui-toolbar-style {
        display: block;
        text-align: center;
        padding: 10px 20px;
    }
}
</style>