<template>
    <xui-modal ref="modal" width="1000" title="用户登录记录">
        <div style="height:580px;">
            <xui-filter :options="filterOptions" @filter="search"></xui-filter>
            <xui-toolbar style="float:right;padding:10px 10px 0px 0px;" :options="toolbarOptions"></xui-toolbar>
            <div style="padding:0px 10px;">
                登录用户名：{{currentRecord.loginName}}&nbsp;&nbsp;&nbsp;&nbsp;真实姓名：{{currentRecord.userName}}
            </div>
            <xui-table ref="table" style="height:450px;margin:10px;" :options="tableOptions">
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
            currentFilter: {},
            filterOptions: {
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
            toolbarOptions: {
                tools: [
                    {
                        label: "导出",
                        color: "primary",
                        operate: () => {
                            Store.exportHistory({
                                userId: this.currentFilter.userId,
                                queryStartTime: this.currentFilter
                                    .queryStartTime,
                                queryEndTime: this.currentFilter.queryEndTime,
                            });
                        },
                    },
                ],
            },
            tableOptions: {
                columns: [
                    {
                        title: "登录时间",
                        name: "loginTime",
                        align: "center",
                        format: "DATETIME",
                    },
                    {
                        title: "登录时长",
                        name: "timeLength",
                        align: "center",
                    },
                    {
                        title: "登录设备",
                        name: "userAgent",
                        style: "width:300px;",
                    },
                    {
                        title: "登录IP",
                        name: "ip",
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
                    filter.userId = this.currentRecord.userId;
                    this.currentFilter = filter;
                    return Store.history(filter);
                },
            },
        };
    },
    methods: {
        open(record) {
            this.$refs.modal.open();
            this.currentRecord = record;
            this.$refs.table.search();
        },
        search(filter) {
            this.$refs.table.search(filter);
        },
        save(model) {
            Store.save(model).then(() => {
                $tip("保存成功", "success");
                this.cancel();
            });
        },
        cancel() {
            this.$refs.modal.close();
        },
    },
};
</script>