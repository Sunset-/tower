<template>
    <div>
        <dag-breadcrumb ref="path" :path="path" :back="back"></dag-breadcrumb>
        <div class="MODULE-MAJOR customer-detail">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions" @change="changeTab">
            </xui-tabs>
            <xui-scroll ref="scroll" class="form-scroll-wrap">
                <div class="customer-detail-BASE" v-show="currentTab=='BASE'" style="background:#fff;" @refresh="refreshTable">
                    <customer-baseinfo :currentModel="currentModel" @view="viewImage"></customer-baseinfo>
                </div>
                <div class="customer-detail-ORDERS" v-show="currentTab=='ORDERS'">
                    <!-- 订单信息 -->
                    <customer-orders ref="orders" :customer="currentModel" @refresh="initImages"></customer-orders>
                </div>
                <div class="customer-detail-A" v-show="currentTab=='A'">
                    <!-- 证券账户 -->
                    <customer-images category="证券账户信息" :assign="true" :currentModel="currentModel" :imageGroups="zjzhImages" :selectImgs="selectImgs" @view="viewImage" @select="activeImage" @refresh="initImages"></customer-images>
                </div>
                <div v-show="currentTab=='B'">
                    <!-- 证券交易记录 -->
                    <customer-images category="证券交易记录" :assign="true" :currentModel="currentModel" :imageGroups="zjjyjlImages" :selectImgs="selectImgs" @view="viewImage" @select="activeImage" @refresh="initImages"></customer-images>
                </div>
                <div v-show="currentTab=='C'" style="padding:10px;">
                    <customer-transaction ref="transaction" :currentModel="currentModel" @view="viewImage"></customer-transaction>
                </div>
                <div v-show="currentTab=='D'">
                    <!-- 其他文书 -->
                    <customer-images category="OTHER" :assign="false" :currentModel="currentModel" :imageGroups="otherImages" :selectImgs="selectImgs" @view="viewImage" @select="activeImage" @refresh="initImages">
                    </customer-images>
                </div>
                <div v-show="currentTab=='PDF'">
                    <!-- 生成PDF文书 -->
                    <customer-pdfs category="PDF" :assign="true" :currentModel="currentModel" :imageGroups="pdfGroups" :selectImgs="selectImgs" @select="activeImage" @refresh="initImages">
                    </customer-pdfs>
                </div>
            </xui-scroll>
        </div>
        <image-viewer ref="viewer" prefix="/proxy-img"></image-viewer>
    </div>
</template>
<script>
import Store from "./store";
import CustomerBaseinfo from "./baseinfo";
import CustomerOrders from "./orders";
import CustomerImages from "./images";
import CustomerPdfs from "./pdfs";
import CustomerTransaction from "./transcaction";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const FileManage = $import("dag/modules/File");

var OTHER_IMAGE_GROUP = [
    "公证书",
    "身份证",
    "身份证复印件",
    "委托代理合同",
    "授权委托书",
    "收款账户",
    "民事起诉状签字页",
];

var IMAGE_GROUP_ZJZHXX = "证券账户信息";
var IMAGE_GROUP_ZJJYJL = "证券交易记录";
var OTHER_IMAGE_GROUP_KEYS = OTHER_IMAGE_GROUP.reduce((res, item) => {
    res[item] = true;
    return res;
}, {});

export default {
    components: {
        DagBreadcrumb: $import("dag/components/Breadcrumb").Component,
        ImageViewer: $import("dag/components/ImageViewer").Component,
        CustomerBaseinfo,
        CustomerOrders,
        CustomerImages,
        CustomerPdfs,
        CustomerTransaction,
    },
    data() {
        return {
            path: [
                {
                    title: "客户列表",
                    name: "CaseManage",
                    operate: () => {
                        this.$emit("refresh");
                    },
                },
            ],
            tabOptions: {
                data: [
                    {
                        text: "客户基本信息",
                        value: "BASE",
                    },
                    {
                        text: "产品订单",
                        value: "ORDERS",
                    },
                    {
                        text: "证券账户信息",
                        value: "A",
                    },
                    {
                        text: "证券交易记录（扫描件）",
                        value: "B",
                    },
                    {
                        text: "证券交易记录（详情）",
                        value: "C",
                    },
                    {
                        text: "其他交易文书",
                        value: "D",
                    },
                    {
                        text: "诉讼材料",
                        value: "PDF",
                    },
                ],
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "保存",
                        color: "primary",
                        operate: () => {
                            this.save();
                        },
                    },
                    {
                        label: "取消",
                        color: "white",
                        operate: () => {
                            this.back();
                        },
                    },
                ],
            },
            currentTab: "BASE",
            currentModel: {},
            selectImgs: {},
        };
    },
    computed: {
        zjzhImages() {
            var images = this.currentModel.$images || {};
            return [
                {
                    title: "证券账户信息",
                    images: images["证券账户信息"] || [],
                },
            ];
        },
        zjjyjlImages() {
            var images = this.currentModel.$images || {};
            return [
                {
                    title: "证券交易记录",
                    images: images["证券交易记录"] || [],
                },
            ];
        },
        otherImages() {
            var images = this.currentModel.$images || {};
            var groups = [];
            //others
            OTHER_IMAGE_GROUP.forEach((key) => {
                groups.push({
                    title: key,
                    images: images[key] || [],
                });
            });
            Object.keys(images).forEach((key) => {
                if (
                    !OTHER_IMAGE_GROUP_KEYS[key] &&
                    key != IMAGE_GROUP_ZJJYJL &&
                    key != IMAGE_GROUP_ZJZHXX &&
                    images[key]
                ) {
                    groups.push({
                        title: key,
                        images: images[key] || [],
                    });
                }
            });
            return groups;
        },
        pdfGroups() {
            var pdfs = this.currentModel.$pdfs || {};
            return [
                {
                    title: "民事诉讼状",
                    images: pdfs["民事诉讼状"] || [],
                },
                {
                    title: "证据目录",
                    images: pdfs["证据目录"] || [],
                },
                {
                    title: "律师函",
                    images: pdfs["律师函"] || [],
                },
                {
                    title: "其他材料",
                    images: pdfs["PDF"] || [],
                },
            ];
        },
    },
    methods: {
        changeTab() {
            this.selectImgs = {};
        },
        open(model) {
            this.currentTab = "BASE";
            this.selectImgs = {};
            model = model || {};
            if (model.$images) {
                this.currentModel = model;
            } else {
                this.initImages(model);
            }
        },
        initImages(model) {
            model = Object.assign({}, model || this.currentModel);
            FileManage.Query({
                ownerId: model.id,
            }).then((files) => {
                var images = {};
                var pdfs = {};
                var used = {};
                files.forEach((item) => {
                    if (item.type == "IMAGE") {
                        if (!images[item.category]) {
                            images[item.category] = [];
                        }
                        images[item.category].push(item);
                    } else if (
                        item.type == "PDF" ||
                        item.type == "DOC" ||
                        item.type == "EXCEL"
                    ) {
                        if (!pdfs[item.category]) {
                            pdfs[item.category] = [];
                        }
                        pdfs[item.category].push(item);
                    }
                    if (item.relations) {
                        item.relations.split(",").forEach((id) => {
                            used[id] = true;
                        });
                    }
                });
                files.forEach((item) => {
                    if (used[item.id]) {
                        item.used = true;
                    }
                });
                model.$images = images;
                model.$pdfs = pdfs;
                this.currentModel = model;
            });
        },
        viewImage(img, imgGroup) {
            this.$refs.viewer.open(img, imgGroup);
        },
        activeImage(group, id, flag) {
            if (!this.selectImgs[group]) {
                Vue.set(this.selectImgs, group, {});
            }
            if (
                flag === false ||
                (flag === void 0 && this.selectImgs[group][id])
            ) {
                var index = this.selectImgs[group][id];
                Vue.delete(this.selectImgs[group], id);
                Object.keys(this.selectImgs[group]).forEach((k) => {
                    if (this.selectImgs[group][k] > index) {
                        Vue.set(
                            this.selectImgs[group],
                            k,
                            this.selectImgs[group][k] - 1
                        );
                    }
                });
            } else {
                Vue.set(
                    this.selectImgs[group],
                    id,
                    Object.keys(this.selectImgs[group]).length + 1
                );
            }
        },
        back() {
            this.$emit("refresh");
        },
        refreshTable() {
            this.$emit("refresh");
        },
    },
};
</script>
<style lang="less">
.MODULE-MAJOR.customer-detail {
    top: 50px;
    background: #fff;
    .form-scroll-wrap {
        height: calc(100% - 60px);
        background: #f7f7f7;
    }
    .case-toolbar {
        display: block;
        padding-top: 10px;
        text-align: center;
        border-top: 1px solid rgba(149, 149, 149, 0.3);
    }
    .casemanager-longtab.xui-tabs.xui-tabs-style .xui-tab-item {
        min-width: 180px;
    }
}

.image-viewer-wrap {
    height: 700px;
    position: relative;
    font-size: 0px;
    .viewer-sidebar {
        width: 200px;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        .customer-img {
            display: inline-block;
            margin: 10px 10px 10px 0px;
            font-size: 12px;
            img {
                width: 80%;
                border: 2px solid #e8e8e8;
                cursor: pointer;
                &.active {
                    border: 2px solid #127bfe;
                }
                &:hover {
                    border: 2px solid lighten(#127bfe, 15%);
                }
            }
            & > div {
                text-align: center;
                padding-top: 5px;
                padding-bottom: 10px;
                overflow: hidden;
            }
        }
    }
    .viewer-major {
        width: calc(100% - 200px);
        height: 100%;
        background: #666;
        display: inline-block;
        vertical-align: top;
    }
    .viewer-tag {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10;
        font-size: 14px;
        text-align: right;
        p {
            padding-bottom: 10px;
        }
    }
}
</style>