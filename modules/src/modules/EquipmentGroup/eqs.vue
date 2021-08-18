<template>
    <xui-modal ref="modal" width="700" title="项目设备参数">
        <div style="min-height:400px;padding:15px;">
            <xui-table ref="table" :options="tableOptions">

            </xui-table>
        </div>
    </xui-modal>
</template>
<script>
export default {
    data(){
        return {
            tableOptions : {
                columns: [
                    {
                        title: "SN",
                        name: "deviceSN",
                        style: "text-align:center;max-width:50px",
                        style: "width:60px;",
                    },
                    {
                        title: "设备编号",
                        name: "groupName",
                        align: "center",
                    },
                    {
                        title: "X",
                        name: "deviceType",
                        align: "center",
                    },
                    {
                        title: "Y",
                        name: "deviceCount",
                    },
                    {
                        title: "臂长",
                        name: "deviceCount",
                    },
                    {
                        title: "塔高",
                        name: "deviceCount",
                    },
                    {
                        title: "后桥长",
                        name: "deviceCount",
                    },
                    {
                        title: "塔帽高",
                        name: "deviceCount",
                    }
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
                    filter.userId = $business.getCurrentUser()&&$business.getCurrentUser().userId;
                    return Store.list(filter);
                },
            },
        }
    },
    methods : {
        open(model) {
            this.$refs.modal.open();
            // this.$refs.table.refresh();
        },
    }
}
</script>