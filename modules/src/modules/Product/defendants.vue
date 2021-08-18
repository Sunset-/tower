<template>
    <div style="padding:10px;">
        <xui-toolbar :options="toolbarOptions" style="padding-bottom:10px;"></xui-toolbar>
        <xui-table ref="table" :options="orderTableOptions"></xui-table>
        <xui-modal ref="detail" width="800" title="被告信息">
            <xui-form ref="form" :options="formOptions" @submit="save" @cancel="cancel"></xui-form>
        </xui-modal>
    </div>
</template>
<script>
import Store from "./store";

const ProductManage = $import("dag/modules/Product");
const $tip = $import("dag/common/tip");
const $tools = $import("dag/common/tools");
const $confirm = $import("dag/common/confirm");

export default {
    props: {
        product: {},
    },
    data() {
        return {
            toolbarOptions: {
                tools: [
                    {
                        label: "新增",
                        color: "primary",
                        operate: () => {
                            this.edit();
                        },
                    },
                ],
            },
            orderTableOptions: {
                columns: [
                    { title: "类型", name: "type" },
                    { title: "被告名称", name: "name" },
                    { title: "法定代表人", name: "legalRepresentative" },
                    { title: "住所地", name: "address" },
                    {
                        title: "操作",
                        toolbar: [
                            {
                                label: "编辑",
                                size: "mini",
                                operate: (record) => {
                                    this.edit(record);
                                },
                            },
                            {
                                label: "删除",
                                size: "mini",
                                color: "danger",
                                operate: (record) => {
                                    this.remove(record);
                                },
                            },
                        ],
                    },
                ],
                lazy: true,
                pageNumberStart: 0,
                pageSize: 15,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    return Store.listDefendant(filter);
                },
            },
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "类型",
                        name: "type",
                        widget: "select",
                        placeholder: "请选择产品",
                        data: [
                            {
                                text: "上市公司",
                                value: "上市公司",
                            },
                            {
                                text: "法人",
                                value: "法人",
                            },
                            {
                                text: "个人",
                                value: "个人",
                            },
                        ],
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "被告名称",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入被告名称",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "法定代表人",
                        name: "legalRepresentative",
                        widget: "input",
                        placeholder: "请输入法定代表人",
                        validate: {
                            required: true,
                        },
                    },
                    {
                        label: "住所地",
                        name: "address",
                        widget: "textarea",
                        monopolize: true,
                        placeholder: "请输入住所地",
                    },
                ],
                cast(model) {
                    if (model.productId) {
                        model.productKey = `${model.productId}$$$${model.productCode}$$$${model.productName}`;
                    }
                },
                format: (model) => {
                    model.productId = this.product.id;
                    if (model.productKey) {
                        var temp = model.productKey.split("$$$");
                        model.productId = temp[0] || "";
                        model.productCode = temp[1] || "";
                        model.productName = temp[2] || "";
                    }
                },
            },
        };
    },
    watch: {
        product() {
            this.refresh();
        },
    },
    methods: {
        refresh() {
            if (this.product && this.product.id) {
                this.$refs.table.search({ productId: this.product.id });
            } else {
                this.$refs.table.clear();
            }
        },
        edit(model) {
            this.$refs.detail.open();
            this.$refs.form.reset(model);
        },
        // 添加或者编辑确认保存
        save(model) {
            Store.saveDefendant(model).then(() => {
                //关闭窗口
                this.$refs.detail.close();
                //刷新表格
                this.$refs.table.refresh();
                $tip("保存成功", "success");
            });
        },
        remove(data) {
            $confirm(`确定删除？`).then(() => {
                Store.removeDefendant(data.id).then((res) => {
                    $tip("删除成功", "success");
                    this.refresh();
                });
            });
        },
        cancel() {
            this.$refs.detail.close();
        },
    },
};
</script>