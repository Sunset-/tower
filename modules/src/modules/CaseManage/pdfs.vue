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
                <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs[category]&&selectImgs[category][img.id]?'active':'']" :number="selectImgs[category]&&selectImgs[category][img.id]" @click="activeImage(img.id)" class="">
                </i>
                <img :src="thumbnail(img.path)" :onerror="defaultImg(img.path)" @click="viewImage(img,group.images)" :title="img.name" :alt="img.name">
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
                                            <img :src="thumbnail(img.path)" :onerror="defaultImg(img.path)" @click="viewImage(img,group.images)" :title="img.name" :alt="img.name">
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
        <xui-modal ref="namemodal" title="生成法院用文书" :width="500">
            <div class="customer-generate-pdf">
                <xui-form ref="nameform" :options="pdfOptions" @submit="saveDoc"></xui-form>
            </div>
        </xui-modal>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
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
                orders : [],
                filter(f) {
                    return true;
                },
                headers: {},
                formData: (ctx) => {
                    return {
                        customerId: this.currentModel.id,
                        customerName: this.currentModel.name,
                        category: ctx.category,
                    };
                },
                progress(v) {
                    console.log(v);
                },
            },
            pdfOptions: {
                cols: 1,
                fields: [
                    {
                        label: "产品",
                        name: "productId",
                        widget: "select",
                        watch : ["customerId",()=>{}],
                        data: () => {
                            return Store.listOrder({
                                customerId : this.currentModel.id
                            }).then(res=>{
                                this.orders = res;
                                return res.map(item=>({
                                    text : `${item.productId}_${item.productName}`,
                                    value : item.productId
                                }));
                            });
                        },
                    },
                    {
                        label: "诉讼材料",
                        name: "category",
                        widget: "select",
                        placeholder: "请选择诉讼材料",
                        data : [{
                            text : "证据目录",
                            value : "证据目录"
                        },{
                            text : "律师函",
                            value : "律师函"
                        }]
                    },
                    {
                        label: "证券营业部",
                        name: "companyOffice",
                        widget: "select",
                        placeholder: "请选择证券营业部",
                        watch : ["customerId",()=>{}],
                        visible : (model)=>{
                            return model.category=="证据目录";
                        },
                        data: () => {
                            var res = [];
                            if (this.currentModel.securitiesCompanies) {
                                 res =  this.currentModel.securitiesCompanies.split(";").map((item) => ({
                                     text : item.split(":").join(""),
                                     value : item.split(":").join("")
                                 }));
                            }
                            return res;
                        },
                    },
                    {
                        label: "文件名",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入文件名",
                        watch : ["productId,category",(model,b,c)=>{
                            if(model.category=="证据目录"){
                                var p = this.orders.filter(item=>item.productId==model.productId)[0];
                                if(p&&this.currentModel.name){
                                    model.name = `${this.currentModel.name}${p.productName}证据目录`;
                                }
                            }else if(model.category=="律师函"){
                                model.name = "律师函";
                            }
                        }]
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
                        label: "生成法院用文书",
                        color: "primary",
                        operate: () => {
                            this.generatePDF();
                        },
                    },
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
    methods: {
        thumbnail(path){
            path = path.toLowerCase();
            if(path.endsWith(".docx")||path.endsWith(".doc")){
                return "/images/icon/doc_icon.jpg"
            }else{
                return "/images/icon/pdf_icon.jpg"
            }
        },
        defaultImg(src) {
            return `this.src="/proxy-img/${src}"`;
        },
        viewImage(img, group) {
            window.open(
                `${location.protocol}//${location.host}/proxy-img/${img.path}`
            );
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
            Store.assignCompany({
                companyDept: companyDept,
                ids: Object.keys(imgs),
            }).then(() => {
                Vue.delete(this.selectImgs, this.category);
                this.$emit("refresh");
            });
        },
        generatePDF() {
            this.$refs.namemodal.open();
            this.$refs.nameform.reset({
                customerId : this.currentModel.id,
            });
        },
        saveDoc(model) {
            FileManage.GenerateDoc({
                ownerId: this.currentModel.id,
                customerName : this.currentModel.name,
                userDir: `${this.currentModel.identCode}${this.currentModel.name}`,
                companyOffice : model.companyOffice,
                productId: model.productId,
                name: model.name || "未命名",
                dir :  model.productId,
                category : model.category
            }).then(() => {
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