<template>
    <div class="history">
        <xui-filter style="padding-left:10px;" ref="filter" :options="filterOptions" @filter="search"></xui-filter>
        <xui-toolbar style="padding:10px 10px 0px 10px;float:right;" :options="toolbarOptions"></xui-toolbar>
        <xui-table ref="table" style="height:500px;margin:10px;" :options="tableOptions">
        </xui-table>
    </div>
</template>
<script>
const $tip = $import("dag/common/tip");

import Store from "../store";

export default {
    props: {
        device: "",
    },
    data() {
        return {
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
                    filter.ownerId = this.currentRecord&&this.currentRecord.ownerId;
                    filter.tableName = "device_params_commit";
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
                            Store.exportHistory(this.currentFilter);
                        },
                    },
                ],
            },
            tableOptions: {
                columns: [
                    {
                        title: "编辑人",
                        name: "updateUserName",
                        align: "center",
                        style: "width:160px;",
                    },
                    {
                        title: "编辑后参数",
                        name: "content",
                        align: "center",
                        style: "position:relative;",
                        format(v) {
                            return `<textarea readonly="readonly" style="width:100%;margin:2px;padding:5px;position:absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;resize:none;" resize="false">${v}</textarea>`;
                            return `<div style="padding-top:10px;position:absolute;overflow:hidden;left: 0px;right: 0px;top: 0px;bottom: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${v}</div>`;
                        },
                    },
                    {
                        title: "操作时间",
                        name: "timestamp",
                        format: "DATETIME",
                        align: "center",
                        style: "width:160px;",
                    },
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 10,
                localPageSize: 10,
                format: {
                    list: "list",
                    count: "count",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    return Store.history(filter);
                },
            },
        };
    },
    watch: {
        device(v) {
            this.$refs.table.clear();
            this.currentRecord = { ownerId: v.deviceId };
            this.$refs.filter.search();
        },
    },
    methods: {
        open(record) {
            // this.currentRecord = record;
            // this.$refs.filter.search(record);
        },
        search(filter) {
            Object.assign(filter, this.currentRecord);
            this.currentFilter = filter;
            this.$refs.table.search(filter);
        },
        save(model) {
            Store.save(model).then(() => {
                $tip("保存成功", "success");
                this.cancel();
            });
        },
        cancel() {},
    },
};
</script>