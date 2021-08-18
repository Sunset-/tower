<template>
    <xui-modal ref="modal" title="选择项目" width="800">
        <div class="equipmentgroup-selector-wrap">
            <xui-filter ref="filter" :options="filterOptions" @filter="search"></xui-filter>
            <xui-table ref="table" :options="tableOptions"></xui-table>
        </div>
    </xui-modal>
</template>
<script>
import Store from "./store";

export default {
    props: {
        options: {},
    },
    data() {
        return {
            filterOptions: {
                cols: false,
                filterEmpty: true,
                fields: [
                    {
                        name: "groupName",
                        widget: "input",
                        placeholder: "请输入名称",
                        manner: "search",
                        changeFilter: true,
                    },
                ],
            },
            tableOptions: {
                columns: [
                    {
                        title: "序号",
                        name: "index",
                        style: "text-align:center;max-width:50px",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                        style: "width:60px;",
                    },
                    {
                        title: "项目名称",
                        name: "groupName",
                        align: "center",
                    },
                    {
                        title: "所属单位",
                        name: "ownerUnit",
                    },
                    {
                        title: "设备数",
                        name: "deviceCount",
                    },
                    {
                        title: "联系人",
                        name: "contacts",
                    },
                    {
                        title: "联系方式",
                        name: "contactWay",
                    },
                    {
                        title: "操作",
                        style: "width:100px;",
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
                    filter.deviceType = this.options && this.options.type;
                    return Store.list(filter);
                },
            },
        };
    },
    methods: {
        open() {
            this.$refs.modal.open();
            this.$refs.filter.search();
        },
        search(filter) {
            this.$refs.table.search(filter);
        },
    },
};
</script>
<style lang="less">
.equipmentgroup-selector-wrap {
    padding: 10px;
    height: 535px;
}
</style>