<template>
    <xui-modal ref="modal" width="900" title="项目设备参数">
        <div style="min-height:400px;padding:15px;">
            <xui-table ref="table" :options="tableOptions">

            </xui-table>
        </div>
    </xui-modal>
</template>
<script>

 import Store from "./store";

export default {
    data(){
        return {
            currentModel : {},
            tableOptions : {
                columns: [
                    {
                        title: "SN",
                        name: "deviceSN",
                        style: "text-align:center;max-width:50px",
                        style: "width:120px;",
                    },
                    {
                        title: "设备编号",
                        name: "deviceNo",
                        align: "center",
                    },
                    {
                        title: "X",
                        name: "xLine",
                        align: "center",
                    },
                    {
                        title: "Y",
                        name: "yLine",
                    },
                    {
                        title: "臂长",
                        name: "armLength",
                    },
                    {
                        title: "塔高",
                        name: "towerHigh",
                    },
                    {
                        title: "后桥长",
                        name: "rearBridgeLong",
                    },
                    {
                        title: "塔帽高",
                        name: "towerHatHigh",
                    }
                ],
                lazy: true,
                pageNumberStart: 1,
                pageSize: 20000,
                localPageSize: 10,
                format: {
                    list: "",
                    count: "length",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    this.loading = false;
                    filter.projectId = this.currentModel.projectId;
                    return Store.eqList(filter);
                },
            },
        }
    },
    methods : {
        open(model) {
            this.currentModel = model;
            this.$refs.modal.open();
            this.$refs.table.clear();
            this.$refs.table.refresh();
        },
    }
}
</script>