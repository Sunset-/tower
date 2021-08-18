<template>
    <xui-modal ref="modal" :options="modalOptions" :mask-close="false">
        <div style="height:350px;padding:15px;overflow-y:auto;">
            <dag-tree ref="tree" :options="equipmentTree" @checked="onCheckedTree"></dag-tree>
        </div>
        <div style="padding:10px;text-align:right;border-top:1px solid #dedede;">
            <xui-toolbar :options="toolbarOptions"></xui-toolbar>
        </div>
    </xui-modal>
</template>
<script>
const RoleManage = $import("dag/modules/RoleManage");
const $tip = $import("dag/common/tip");

import Store from "./store";

export default {
    components: {
        DagTree: $import("dag/components/Tree").Component,
    },
    data() {
        return {
            //用户编辑
            modalOptions: {
                title: "分配资源权限",
                width: 800,
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "确定",
                        color: "primary",
                        operate: () => {
                            this.save();
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
            equipmentTree: {
                treeType: "EQUIPMENT",
                selectedRoot: false,
                isStrongCheckedMode: true,
                isAutoExpandRoot: false,
                nodeTemplate(node) {
                    if (node.type == "group") {
                        return node.name;
                    } else {
                        return `${
                            node.deviceType == 1 ? "智能网关" : "智能互感器"
                        } 设备名称：${node.deviceName} 设备SN：${
                            node.deviceSN
                        }`;
                    }
                },
                check: {
                    enable(node) {
                        return node.type == "group";
                    },
                    type: "multiple",
                },
                isParent(node) {
                    return node.type == "group";
                },
                filter: {
                    isActive: void 0,
                },
            },
            currentRecord: {},
            checkedNodes: [],
        };
    },
    methods: {
        open(record) {
            this.currentRecord = record;
            Store.getUserPermission(record.userId).then((res) => {
                this.$refs.tree.checkNodes(res.map((item) => item.groupId));
                this.$refs.modal.open();
                this.$nextTick(() => {
                    this.$refs.tree.refresh();
                });
            });
        },
        onCheckedTree(nodes) {
            this.checkedNodes = nodes || [];
        },
        // 保存
        save() {
            var groupIds = this.checkedNodes
                .map((item) => item.groupId)
                .join(",");
            Store.saveUserPermission({
                userId: this.currentRecord.userId,
                groupIds: groupIds,
            }).then(() => {
                $tip("操作成功", "success");
                this.$refs.modal.close();
                this.$emit("refresh");
            });
        },
    },
};
</script>