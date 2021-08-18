<template>
    <xui-modal ref="modal" title="选择设备" :width="900">
        <div class="equipment-selector-wrap">
            <div class="equipment-selector-content">
                <xui-filter :options="filterOptions" @filter="search"></xui-filter>
                <xui-table ref="table" :options="tableOptions" @checked="onChecked"></xui-table>
            </div>
            <div v-show="isMultiple" class="equipment-selector-checkeds">
                <div style="margin-bottom:5px;border-bottom:1px solid #ddd;padding:10px 5px;">已选择 <span
                        class="color-primary">{{checkedItems.length}}</span> 个</div>
                <div style="flex-grow:1;padding:5px;">
                    <div class="equipment-checked-item" v-for="item in checkedItems" :key="item.deviceSN">
                        <span>{{item.deviceSN}}</span>
                        <i class="xui-icon xui-icon-close" @click="cancelCheck(item)"></i>
                    </div>
                </div>
            </div>
        </div>
        <div style="text-align:center;padding:10px;border-top:1px solid #dedede;">
            <xui-toolbar v-if="isMultiple" :options="toolbarOptions"></xui-toolbar>
        </div>
    </xui-modal>
</template>
<script>
import Store from "./store";

export default {
    props: {
        multiple: "",
        options: "",
    },
    data() {
        return {
            checkedItems: [],
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        name: "deviceSN",
                        widget: "input",
                        placeholder: "请输入设备SN",
                        manner: "search",
                        changeFilter: true,
                    },
                ],
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "确定",
                        color: "primary",
                        operate: () => {
                            this.$refs.modal.close();
                            this.$emit("selected", this.checkedItems);
                        },
                    },
                    {
                        label: "取消",
                        operate: () => {
                            this.$refs.modal.close();
                        },
                    },
                ],
            },
        };
    },
    computed: {
        isMultiple() {
            return this.multiple === true || this.multiple === "true";
        },
        tableOptions() {
            var opts = {
                checked: this.isMultiple
                    ? {
                          key: "deviceSN",
                      }
                    : false,
                columns: [
                    {
                        title: "序号",
                        name: "index",
                        style: "text-align:center;max-width:50px",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                        width: 100,
                    },
                    {
                        title: "设备SN",
                        name: "deviceSN",
                        align: "center",
                        width: 100,
                    },
                    {
                        title: "设备类型",
                        name: "deviceType",
                        width: 100,
                        enum: "DEVICE_TYPE",
                    },
                    {
                        title: "当前状态",
                        name: "status",
                        width: 100,
                        enum: "UNBIND_DEVICE_STATUS",
                    },
                    // {
                    //     title: "最后上线时间",
                    //     name: "lastOnlineTime",
                    //     width: 100,
                    // },
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
                    filter.bindStatus = this.options.bindStatus;
                    filter.deviceType = this.options.deviceType;
                    return Store.list(filter);
                },
            };
            if (!this.isMultiple) {
                opts.columns.push({
                    title: "操作",
                    width: 100,
                    toolbar: {
                        tools: [
                            {
                                label: "选择",
                                color: "primary",
                                operate: (record) => {
                                    this.$refs.modal.close();
                                    this.$emit("selected", record);
                                },
                            },
                        ],
                    },
                });
            }

            return opts;
        },
    },
    methods: {
        open() {
            this.$refs.table.clear();
            this.$refs.modal.open();
            this.$refs.table.search();
        },
        search(filter) {
            this.$refs.table.search(filter);
        },
        onChecked(items) {
            this.checkedItems = items;
        },
        cancelCheck(item) {
            this.$refs.table.checkRecord(false, item);
        },
    },
};
</script>
<style lang="less">
.equipment-selector-wrap {
    position: relative;
    padding: 0px 10px 0px 10px;
    height: 540px;
    overflow: auto;
    display: flex;
    flex-direction: row;
    .equipment-selector-content {
        flex-grow: 1;
        padding-bottom: 10px;
    }
    .equipment-selector-checkeds {
        display: flex;
        flex-direction: column;
        width: 210px;
        margin-left: 5px;
        border-left: 1px solid #dedede;
        .equipment-checked-item {
            padding: 3px 6px;
            border: 1px solid #ababab;
            color: #444;
            background: #fafafa;
            border-radius: 2px;
            margin: 0px 5px 5px 0px;
            & > span {
                width: 162px;
            }
            & > * {
                display: inline-block;
                vertical-align: middle;
            }
            .xui-icon-close {
                cursor: pointer;
                font-size: 12px;
                &:hover {
                    color: #aaa;
                }
            }
        }
    }
}
</style>