<template>
    <div class="MODULE-CONTAINER MODULE-Customer">
        <div class="MODULE-MAJOR-CONTENT" v-show="page=='LIST'">
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH">
                <xui-filter class="title_filter" ref="filter" :options="filterOptions" @filter="searchDebounce">
                </xui-filter>
            </div>
            <div class="PANEL">
                <div class="PANEL-BUTTON">
                    <div class="toolbar_page">
                        <xui-toolbar :options="toolbarOptions"></xui-toolbar>
                        <div class="page_total">
                            共&nbsp;
                            <span class="page_total_num number-small">{{totalNum}}</span>&nbsp;条
                        </div>
                    </div>
                </div>
                <xui-scroll class="PANEL-TABLE">
                    <div class="PANEL-BUTTON-CONTAINER">
                        <xui-table ref="table" :options="tableOptions" @checked="tableChecked" @output="getTable">
                            <div slot="empty" style="padding:30px 0px;text-align:center;">无数据</div>
                        </xui-table>
                    </div>
                </xui-scroll>
            </div>
        </div>
        <!-- 接入配置 -->
        <case-detail v-show="page=='DETAIL'" ref="detail" @refresh="refresh"></case-detail>
        <div v-show="loading" ref="loading" class="customer-upload-loading">
            <div>上传中...</div>
        </div>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");
const $tools = $import("dag/common/tools");

import Store from "./store";
import CaseDetail from "./detail";

const PLATFORM_TYPE_AUTOCREATE = 3;

var imageGroups = [
    ["公证书"],
    ["身份证复印件", "服务合同"],
    ["委托代理合同", "授权委托书", "快递单"],
    ["民事起诉状", "收款账户"],
    ["证券账户信息", "证券交易记录"],
];

var imageAllKeys = imageGroups.reduce((res, item) => {
    item.forEach((k) => {
        res[k] = true;
    });
    return res;
}, {});

export default {
    components: {
        CaseDetail,
    },
    data() {
        return {
            page: "LIST",
            path: [
                {
                    title: "客户文书",
                    name: "AccessManage",
                },
            ],
            loading: false,
            checkedRecords: [],
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        // label: "请选择节点",
                        name: "keyword",
                        widget: "input",
                        placeholder: "请输入关键字",
                        manner: "search",
                        changeFilter: true,
                    },
                ],
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "导入",
                        icon: "iconfont iconxinzeng",
                        color: "primary",
                        type: "file",
                        url: "/api/customer/import",
                        className: "my-uploader-trigger",
                        filter: (f) => {
                            var flag = ~f.type.indexOf("zip");
                            this.$nextTick(() => {
                                this.loading = true;
                            });
                            return flag;
                        },
                        formData(record) {
                            return {};
                        },
                        singleSuccess: (res, b) => {
                            if (res && res.result && res.result.code != 200) {
                                $tip("导入异常：" + res.result.msg, "warning");
                            } else {
                                $tip("导入成功");
                                this.$refs.table.refresh();
                            }
                            this.loading = false;
                        },
                        singleError: (res, b) => {
                            if (res && res.result && res.result.code != 200) {
                                $tip("导入异常：" + res.result.msg, "warning");
                            } else {
                                $tip("导入成功");
                                this.$refs.table.refresh();
                            }
                            this.loading = false;
                        },
                        progress(v) {
                            console.log(v);
                        },
                    },
                    {
                        label: "重新计算",
                        color: "primary",
                        operate: () => {
                            var ids = this.checkedRecords.map(
                                (item) => item.id
                            );
                            if (ids.length == 0) {
                                $tip("请选择条目");
                                return;
                            }
                            this.reCalculate(ids);
                        },
                    },
                    {
                        label: "批量删除",
                        color: "danger",
                        operate: () => {
                            var ids = this.checkedRecords.map(
                                (item) => item.id
                            );
                            if (ids.length == 0) {
                                $tip("请选择条目");
                                return;
                            }
                            this.remove(ids);
                        },
                    },
                ],
            },
            tableOptions: {
                checked: {
                    key: "id",
                },
                columns: [
                    {
                        title: "序号",
                        name: "index",
                        style: "text-align:center;max-width:50px",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                    },
                    {
                        title: "客户身份证号",
                        name: "identCode",
                        align: "center",
                    },
                    {
                        title: "客户姓名",
                        name: "name",
                        align: "center",
                    },
                    {
                        title: "诉前文书简况",
                        name: "images",
                        format(images) {
                            images = images || {};
                            var html = ['<div class="customer-image-info">'];
                            imageGroups.forEach((group) => {
                                var ghtml = [
                                    '<div class="customer-image-group">',
                                ];
                                group.forEach((key) => {
                                    if (images[key] && images[key] > 0) {
                                        ghtml.push(
                                            `<p>${key}(${images[key]})</p>`
                                        );
                                    } else {
                                        ghtml.push(
                                            `<p class="color-danger">${key}(0)</p>`
                                        );
                                    }
                                });
                                ghtml.push("</div>");
                                html.push(ghtml.join(""));
                            });
                            //others
                            var ghtml = ['<div class="customer-image-group">'];
                            var hasOthers = false;
                            Object.keys(images).forEach((key) => {
                                if (!imageAllKeys[key]) {
                                    if (images[key] && images[key] > 0) {
                                        hasOthers = true;
                                        ghtml.push(
                                            `<p>${key}(${images[key]})</p>`
                                        );
                                    }
                                }
                            });
                            if (hasOthers) {
                                ghtml.push("</div>");
                                html.push(ghtml.join(""));
                            }
                            html.push("</div>");
                            return html.join("");
                        },
                    },
                    {
                        title: "可主张证券简况",
                        name: "orders",
                        align: "left",
                        format(v) {
                            if (!v) {
                                return "-";
                            }
                            return v
                                .map((item) => {
                                    return `<p>【${item.productCode}_${
                                        item.productName
                                    }】<br/>&nbsp;投资损失：${(+item.totalLoss).toFixed(
                                        2
                                    )}<br/>&nbsp;收费比例：${
                                        item.chargeRatio
                                    }</p>`;
                                })
                                .join("");
                        },
                    },
                    {
                        title: "归属营业部名称",
                        name: "securitiesCompanies",
                        style: "max-width:150px;",
                        align: "left",
                        format(v) {
                            if (!v) {
                                return "-";
                            }
                            return v
                                .split(";")
                                .map((item) => {
                                    var vs = item.split(":");
                                    return `<p>【${vs[0]}】<br/>&nbsp;${vs[1]}</p>`;
                                })
                                .join("");
                        },
                    },
                    {
                        title: "交易记录识别",
                        name: "transactionEffective",
                        style: "max-width:150px;",
                        align: "left",
                        format(v) {
                            if (!v) {
                                return "-";
                            }
                            return `
                            <div class="color-success"><span>正常：</span><span>${
                                v[1] || 0
                            }</span></div>
                            <div class="color-error"><span>异常：</span><span>${
                                v[2] || 0
                            }</span></div>
                            <div><span>无效：</span><span>${
                                v[3] || 0
                            }</span></div>
                            `;
                        },
                    },
                    {
                        title: "操作",
                        toolbar: [
                            {
                                label: "查看",
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
                                    this.remove([record.id]);
                                },
                            },
                        ],
                    },
                ],
                lazy: true,
                pageNumberStart: 0,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "list",
                    count: "count",
                    currentPage: "pageNumber",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    return Store.list(filter);
                },
            },
            totalNum: 0,
        };
    },
    computed: {
        currentRoute() {
            return this.$route.name;
        },
    },
    methods: {
        edit(model) {
            this.page = "DETAIL";
            this.$refs.detail.open(model);
        },
        // 搜索
        searchDebounce(filter) {
            if (this.searchDebounceTimer !== null) {
                clearTimeout(this.searchDebounceTimer);
            }
            this.searchDebounceTimer = setTimeout(() => {
                this.search(filter);
            }, 300);
        },
        search(filter) {
            this.$refs.table.search(filter);
        },
        tableChecked(items) {
            this.checkedRecords = items || [];
        },
        refresh() {
            this.page = "LIST";
            this.$refs.table.refresh();
        },
        // 添加或者编辑确认保存
        save(model) {
            Store.save(model, this.addOrUpdata).then(() => {
                //关闭窗口
                this.$refs.modal.close();
                //刷新表格
                this.$refs.table.refresh();
                $tip("保存成功", "success");
            });
        },
        // 删除
        remove(ids) {
            $confirm(`确定删除？`).then(() => {
                Store.remove(ids).then((res) => {
                    $tip("删除成功", "success");
                    this.refresh();
                });
            });
        },
        //重新计算
        reCalculate(ids){
            Store.reCalculate(ids).then((res) => {
                $tip("计算完成", "success");
                this.refresh();
            });
        },
        // 导出
        export(template, record) {
            Store.export(template, record).then((res) => {
                $tools.downloadFile(
                    `${templateName[template]}-${record.msssz_b01}.doc`,
                    res
                );
            });
        },
        getTable(data, num) {
            this.totalNum = num;
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.MODULE-Customer {
    .xui-datapage.xui-datapage-style .xui-datapage-footer {
        position: relative;
        bottom: 0;
    }
    .customer-image-info {
        text-align: left;
        p {
            display: inline-block;
            padding: 0px 5px;
        }
    }
    .customer-upload-loading {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        div {
            position: absolute;
            width: 200px;
            top: 45%;
            left: 50%;
            margin-left: -100px;
            font-size: 24px;
        }
    }
}
</style>