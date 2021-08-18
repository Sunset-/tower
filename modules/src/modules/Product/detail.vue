<template>
    <div>
        <dag-breadcrumb ref="path" :path="path" :back="back"></dag-breadcrumb>
        <div class="MODULE-MAJOR product-detail">
            <xui-tabs class="casemanager-longtab" v-model="currentTab" :options="tabOptions" @change="changeTab"></xui-tabs>
            <xui-scroll ref="scroll" class="form-scroll-wrap">
                <div class="product-detail-BASE" v-show="currentTab=='BASE'" style="background:#fff;">
                    <product-baseinfo :currentModel="currentModel" @refresh="initModel"></product-baseinfo>
                </div>
                <div class="product-detail-DEFENDANT" v-show="currentTab=='DEFENDANT'">
                    <!-- 被告信息 -->
                    <product-defendants ref="orders" :product="currentModel"></product-defendants>
                </div>
                <div class="product-detail-FILE" v-show="currentTab=='FILE'">
                    <!-- 法律文书 -->
                    <product-files category="证券账户信息" :assign="true" :currentModel="currentModel" :selectImgs="selectImgs"></product-files>
                </div>
                <div class="product-detail-TEMPLATE" v-show="currentTab=='TEMPLATE'">
                    <!-- 模板 -->
                    <product-templates category="模板" :assign="true" :currentModel="currentModel" :selectImgs="selectImgs"></product-templates>
                </div>
            </xui-scroll>
        </div>
    </div>
</template>
<script>
import Store from "./store";
import ProductBaseinfo from "./baseinfo";
import ProductDefendants from "./defendants";
import ProductFiles from "./files";
import ProductTemplates from "./templates";

const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");

export default {
    components: {
        DagBreadcrumb: $import("dag/components/Breadcrumb").Component,
        ProductBaseinfo,
        ProductDefendants,
        ProductFiles,
        ProductTemplates,
    },
    data() {
        return {
            path: [
                {
                    title: "产品列表",
                    name: "CaseManage",
                    operate: () => {
                        this.$emit("refresh");
                    },
                },
            ],
            tabOptions: {
                data: [
                    {
                        text: "产品基本信息",
                        value: "BASE",
                    },
                    {
                        text: "被告信息",
                        value: "DEFENDANT",
                    },
                    {
                        text: "法律文书",
                        value: "FILE",
                    },
                    {
                        text: "诉讼模板",
                        value: "TEMPLATE",
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
            viewerWait: "",
            viewerImg: {},
            viewerGroup: [],
            selectImgs: {},
            productId: "",
        };
    },
    methods: {
        changeTab() {
            this.selectImgs = {};
        },
        open(model) {
            this.currentTab = "BASE";
            this.selectImgs = {};
            this.productId = model.id;
            this.initModel();
        },
        initModel() {
            Store.list({
                id: this.productId,
            }).then((res) => {
                this.currentModel = (res && res.list && res.list[0]) || {};
            });
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
.MODULE-MAJOR.product-detail {
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
</style>