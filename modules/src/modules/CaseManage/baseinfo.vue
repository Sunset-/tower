<template>
    <div class="customer-base-wrap">
        <div style="width:840px;">
            <xui-form ref="form" :view="view" :options="formOptions" @submit="save"></xui-form>
            <xui-toolbar :options="toolbarOptions" style="padding:0px 300px;"></xui-toolbar>
        </div>
        <div class="ocr-result">
            <div class="ocr-group" v-for="img in ocrFiles" :key="img.id">
                <div class="ocr-img">
                    <img :src="'/proxy-img/'+img.path" :title="img.name" :alt="img.name" @click="viewImage(img)">
                    <div class="img-label" :title="img.name">{{img.name}}</div>
                </div>
                <div class="ocr-infos">
                    <div style="min-width: 90px;">
                        <label>姓名：</label>
                        <span>{{img.ocr.name}}</span>
                    </div>
                    <div>
                        <label>身份证号：</label>
                        <span>{{img.ocr.number}}</span>
                    </div>
                    <br />
                    <div style="min-width: 90px;">
                        <label>性别：</label>
                        <span>{{img.ocr.sex}}</span>
                    </div>
                    <div style="min-width: 120px;">
                        <label>出生日期：</label>
                        <span>{{img.ocr.birth}}</span>
                    </div>
                    <div style="min-width: 120px;">
                        <label>民族：</label>
                        <span>{{img.ocr.ethnicity}}</span>
                    </div>
                    <br />
                    <div>
                        <label>住址：</label>
                        <span>{{img.ocr.address}}</span>
                    </div>
                    <div class="operate-toolbar">
                        <xui-button color="primary" @click="ocr(img)">OCR识别</xui-button>
                        <xui-button v-show="img.ocred" color="success" @click="ocrUse(img)">使用识别结果</xui-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Store from "./store";

const $tip = $import("dag/common/tip");
const Dictionary = $import("dag/modules/Dictionary");
const CompanyManage = $import("dag/modules/Company");
const ocrKeys = {
    sex: "gender",
    birth: "birthday",
    ethnicity: "nation",
    address: "address",
};

export default {
    props: {
        currentModel: {},
    },
    data() {
        return {
            view: true,
            rawModel: {},
            ocrFiles: [],
            formOptions: {
                cols: 2,
                fields: [
                    {
                        group: "客户信息",
                        label: "客户姓名",
                        name: "name",
                        widget: "input",
                        placeholder: "请输入客户姓名",
                    },
                    {
                        label: "身份证号",
                        name: "identCode",
                        widget: "input",
                        placeholder: "请输入身份证号",
                    },
                    {
                        label: "性别",
                        name: "gender",
                        widget: "radio",
                        newline: true,
                        data: [
                            {
                                text: "男",
                                value: "男",
                            },
                            {
                                text: "女",
                                value: "女",
                            },
                        ],
                    },
                    {
                        label: "出生日期",
                        name: "birthday",
                        widget: "date",
                        placeholder: "请输入出生日期",
                    },
                    {
                        label: "民族",
                        name: "nation",
                        widget: "input",
                        placeholder: "请输入民族",
                        newline: true,
                    },
                    {
                        label: "住址",
                        name: "address",
                        widget: "input",
                        placeholder: "请输入住址",
                    },
                    {
                        group: "证券市场",
                        label: "证券市场",
                        name: "markets",
                        widget: "checkbox",
                        data: () => {
                            return Dictionary.Query({
                                type: "MARKET",
                            }).then((res) => {
                                return (res || []).map((item) => ({
                                    text: item.name,
                                    value: item.name,
                                }));
                            });
                        },
                    },
                    {
                        group: "证券公司",
                        label: "证券公司",
                        name: "securitiesCompanies",
                        widget: "edittable",
                        fieldClass: "company-edit-table",
                        view: (v) => {
                            if (!v) {
                                return "";
                            }
                            v = JSON.parse(v);
                            return [
                                "<div class='xui-edittable xui-edittable-style xui-datatable xui-datatable-style xui-datapage xui-datapage-style'><table class='xui-datatable-table table table-bordered table-striped'>",
                                `<thead>
                                    <tr>
                                        <th class="text-center" style="width:80px;">序号</th>
                                        <th class="text-center">证券公司</th>
                                        <th class="text-center">营业部</th>
                                    </tr>
                                </thead>`,
                                v.map(
                                    (item, i) =>
                                        `<tr><td class="text-center">${
                                            i + 1
                                        }</td><td>${item.company}</td><td>${
                                            item.dept
                                        }</td></tr>`
                                ),
                                "</table></div>",
                            ].join("");
                        },
                        cols: [
                            {
                                title: "证券公司",
                                name: "company",
                                widget: "select",
                                placeholder: "请选择证券公司",
                                data: () => {
                                    return CompanyManage.AllCompanies().then(
                                        (res) => {
                                            return (res || []).map((item) => ({
                                                text: item.name,
                                                value: item.name,
                                            }));
                                        }
                                    );
                                },
                            },
                            {
                                title: "营业部名称",
                                name: "dept",
                                widget: "select",
                                placeholder: "请选择营业部",
                                watch: [
                                    "company",
                                    (options, record) => {
                                        if (record.company) {
                                            options.data = () => {
                                                return CompanyManage.QueryOffice(
                                                    {
                                                        company: record.company,
                                                    }
                                                ).then((res) => {
                                                    return (res || []).map(
                                                        (item) => ({
                                                            text: item.name,
                                                            value: item.name,
                                                        })
                                                    );
                                                });
                                            };
                                        } else {
                                            options.data = [];
                                        }
                                    },
                                ],
                                data: [],
                            },
                        ],
                    },
                ],
                cast(model) {
                    if (model.securitiesCompanies) {
                        model.securitiesCompanies = JSON.stringify(
                            model.securitiesCompanies.split(";").map((item) => {
                                var ts = item.split(":");
                                return {
                                    company: ts[0],
                                    dept: ts[1],
                                };
                            })
                        );
                    }
                },
                format(model) {
                    if (model.securitiesCompanies) {
                        model.securitiesCompanies = JSON.parse(
                            model.securitiesCompanies
                        )
                            .map((item) => `${item.company}:${item.dept}`)
                            .join(";");
                    }
                },
                toolbar: false,
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "编辑",
                        color: "primary",
                        premise: () => {
                            return this.view;
                        },
                        operate: () => {
                            this.$refs.form.reset(this.rawModel);
                            this.view = false;
                        },
                    },
                    {
                        label: "保存",
                        color: "primary",
                        premise: () => {
                            return !this.view;
                        },
                        operate: () => {
                            this.$refs.form.submit();
                        },
                    },
                    {
                        label: "取消",
                        color: "",
                        premise: () => {
                            return !this.view;
                        },
                        operate: () => {
                            this.$refs.form.reset(this.rawModel);
                            this.view = true;
                        },
                    },
                ],
            },
        };
    },
    watch: {
        currentModel(model) {
            this.initModel();
        },
    },
    methods: {
        viewImage(img, group) {
            this.$emit("view", img, group);
        },
        initModel() {
            Store.get(this.currentModel.id).then((res) => {
                this.rawModel = JSON.parse(JSON.stringify(res));
                this.$refs.form.reset(res);
                this.view = true;
            });
            var files = (
                (this.currentModel.$images &&
                    this.currentModel.$images["身份证复印件"]) ||
                []
            ).concat(
                (this.currentModel.$images &&
                    this.currentModel.$images["公证书"]) ||
                    []
            );
            files = JSON.parse(JSON.stringify(files)).map((item) => {
                item.ocred = false;
                item.ocr = {};
                return item;
            });
            this.ocrFiles = files;
        },
        save(model) {
            Store.save(model).then((res) => {
                $tip("保存成功", "success");
                this.initModel();
            });
        },
        ocr(img) {
            if (img.ocred) {
                return;
            }
            Store.ocrIdCard({
                customerId: this.currentModel.id,
                filePath: img.path,
            }).then((res) => {
                img.ocr = res.result || {};
                img.ocred = true;
                $tip("识别成功", "success");
            });
        },
        ocrUse(img) {
            if (!img.ocr) {
                return;
            }
            var dst;
            if (this.view) {
                dst = JSON.parse(JSON.stringify(this.rawModel));
            } else {
                dst = this.$refs.form.getModel(true);
            }
            Object.keys(ocrKeys).forEach((k) => {
                if (img.ocr[k] != "") {
                    dst[ocrKeys[k]] = img.ocr[k];
                }
            });
            if (this.view) {
                this.$refs.form.reset(dst);
                this.view = false;
            }
        },
    },
};
</script>
<style lang="less">
.customer-base-wrap {
    & > div {
        display: inline-block;
        vertical-align: top;
    }
}
.ocr-result {
    .ocr-group {
        padding: 15px;
        border-bottom: 1px solid #cdcdcd;
        overflow: hidden;
    }
    .ocr-img {
        display: inline-block;
        width: 340px;
        height: 260px;
        vertical-align: top;
        text-align: center;
        img {
            width: 100%;
            height: calc(100% - 30px);
            object-fit: contain;
            border: 1px solid #dedede;
            margin-bottom: 10px;
        }
    }
    .ocr-infos {
        display: inline-block;
        vertical-align: top;
        min-width: 500px;
        & > div {
            display: inline-block;
            padding: 10px 20px;
            label {
                font-weight: bold;
            }
        }
        .operate-toolbar {
            display: block;
        }
    }
}
</style>