<template>
    <xui-modal ref="modal" width="1000" title="项目编辑记录">
        <div style="height:550px;" class="history">
            <xui-filter style="padding-left:10px;" ref="filter" :options="filterOptions" @filter="search"></xui-filter>
            <xui-toolbar style="padding:10px 10px 0px 10px;float:right;" :options="toolbarOptions"></xui-toolbar>
            <xui-table ref="table" style="height:440px;margin:10px;" :options="tableOptions">
            </xui-table>
        </div>
    </xui-modal>
</template>
<script>
import Store from "./store";
const $tip = $import("dag/common/tip");

export default {
    data() {
        return {
            currentRecord: {},
            toolbarOptions: {
                tools: [
                    {
                        label: "导出",
                        color: "primary",
                        operate: () => {
                            Store.exportHistory(this.currentFilter);
                        },
                    },
                ],
            },
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                filterEmpty: true,
                lazy: true,
                fields: [
                    {
                        name: "time",
                        widget: "datetime",
                        startPlaceholder: "开始时间",
                        endPlaceholder: "结束时间",
                        type: "daterange",
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        shortcuts: [
                            {
                                label: "1天",
                                value() {
                                    var now = new Date();
                                    return [
                                        new Date(now.getTime() - 86400000),
                                        now,
                                    ];
                                },
                            },
                            {
                                label: "3天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 3);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                            {
                                label: "7天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 6);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                            {
                                label: "30天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 30);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                            {
                                label: "90天",
                                value() {
                                    var now = new Date();
                                    var start = new Date();
                                    start.setDate(start.getDate() - 90);
                                    start.setHours(0);
                                    start.setMinutes(0);
                                    start.setSeconds(0);
                                    start.setUTCMilliseconds(0);
                                    return [new Date(start), now];
                                },
                            },
                        ],
                    },
                ],
                format(filter) {
                    if (filter.time && filter.time.length == 2) {
                        return {
                            queryStartTime: filter.time[0] + " 00:00:00",
                            queryEndTime: filter.time[1] + " 23:59:59",
                        };
                    }
                },
                searchButton: {
                    label: "查询",
                    color: "primary",
                },
            },
            tableOptions: {
                columns: [
                    {
                        title: "编辑人",
                        name: "updateUserName",
                        align: "center",
                    },
                    {
                        title: "项目名称",
                        name: "contentRecord.projectName",
                        align: "center",
                    },
                    {
                        title: "所属单位",
                        name: "contentRecord.ownerUnit",
                    },
                    {
                        title: "状态",
                        name: "contentRecord.isActive",
                        format(v) {
                            return v == 1 ? "启用" : "停用";
                        },
                    },
                    {
                        title: "联系人",
                        name: "contentRecord.contacts",
                    },
                    {
                        title: "联系方式",
                        name: "contentRecord.contactWay",
                        style: "max-width:160px;",
                    },
                    {
                        title: "操作时间",
                        name: "timestamp",
                        format: "DATETIME",
                        style: "max-width:160px;",
                    },
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "list",
                    count: "total",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.ownerId = this.currentRecord.ownerId;
                    return Store.history(filter);
                },
            },
        };
    },
    methods: {
        open(record) {
            this.$refs.table.clear();
            this.$refs.modal.open();
            this.currentRecord = record;
            this.$refs.filter.search(record);
        },
        save(model) {
            Store.save(model).then(() => {
                $tip("保存成功", "success");
                this.cancel();
            });
        },
        search(filter) {
            Object.assign(filter, this.currentRecord);
            this.currentFilter = filter;
            this.$refs.table.search(filter);
        },
        cancel() {
            this.$refs.modal.close();
        },
    },
};
</script>
<style lang="less">
.history {
    .el-date-editor.el-input__inner {
        width: 350px;
    }
}
</style>