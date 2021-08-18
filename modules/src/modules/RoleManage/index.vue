<template>
    <div class="MODULE-CONTAINER MODULE-RoleManage">
        <div class="MODULE-MAJOR-CONTENT">
            <!-- 搜索条件 -->
            <div class="PANEL-SEARCH-TOOLBAR">
                <xui-filter ref="filter" :options="filterOptions" @filter="searchData"></xui-filter>
                <xui-toolbar class="RIGHT-TOOLBAR" :options="toolbarOptions"></xui-toolbar>
            </div>
            <div class="PANEL-BUTTON-CONTAINER">
                <xui-table ref="table" :options="tableOptions" @output="getTable">
                    <div slot="empty" style="padding:30px 0px;text-align:center;">无数据</div>
                </xui-table>
            </div>
        </div>
        <!-- 角色编辑 -->
        <xui-modal class="dag-role-modal" ref="modal" :options="modalOptions" :mask-close="false">
            <div class="role-edit-panel">
                <div>
                    <xui-form ref="form" :options="formOptions" @submit="save"></xui-form>
                </div>
                <div>
                    <dag-tree ref="tree" :options="moduleTree" @checked="selectedPermission"></dag-tree>
                </div>
            </div>
            <xui-toolbar class="dag-role-toolbar" :options="editToolbar"></xui-toolbar>
        </xui-modal>
    </div>
</template>
<script>
const $tools = $import("dag/common/tools");
const $business = $import("dag/common/business");
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const $http = $import("dag/common/http");

import Store from "./store";
export default {
    components: {
        DagTree: $import("dag/components/Tree").Component,
    },
    data() {
        return {
            permissions: [],
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                fields: [
                    {
                        name: "roleName",
                        widget: "input",
                        manner: "search",
                        style: "width:240px",
                        placeholder: "搜索名称",
                    },
                ],
                searchButton: {
                    color: "primary",
                    icon: "xui-icon xui-icon-search",
                    label: "搜索",
                },
            },
            toolbarOptions: {
                tools: [
                    {
                        label: "新增",
                        icon: "iconfont iconxinzeng",
                        color: "primary",
                        permission : "RoleManage_Add",
                        operate: () => {
                            this.edit();
                        },
                    },
                ],
            },
            editToolbar: {
                tools: [
                    {
                        label: "保存",
                        color: "primary",
                        operate: () => {
                            this.$refs.form.submit();
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
            moduleTree: {
                isParent(node) {
                    return node.isParent;
                },
                check: {
                    enable: true,
                    type: "multiple",
                    cascade: "C",
                },
                datasource(parentNode) {
                    return Store.getAllPermissions();
                },
            },
            tableOptions: {
                columns: [
                    {
                        title: "序号",
                        name: "index",
                        style: "text-align:center;width:50px",
                        format(v, record, col, parent, index) {
                            return index + 1;
                        },
                    },
                    {
                        title: "角色名",
                        name: "roleName",
                        style: "padding-left:10px;width:180px;",
                        headStyle: "padding-left:10px;",
                    },
                    {
                        title: "说明",
                        name: "remark",
                        align: "center",
                        style: "width:280px",
                    },
                    {
                        title: "功能权限",
                        name: "permissionNames",
                        align: "left",
                        headAlign: "left",
                        style: "padding-left:10px;",
                        innerStyle: "white-space: break-spaces;",
                        headStyle: "padding-left:10px;",
                    },
                    {
                        title: "操作栏",
                        style: "width:220px;text-align:center;",
                        toolbar: [
                            {
                                label: "编辑属性",
                                color: "primary-text",
                                permission : "RoleManage_Modify",
                                operate: (record) => {
                                    this.edit(record);
                                },
                            },
                            // {
                            //     title: "删除",
                            //     icon: "iconfont iconshanchu",
                            //     operate: (record) => {
                            //         this.remove(record);
                            //     },
                            //     disabled(model) {
                            //         return (
                            //             model.id ==
                            //             $business.getCurrentUser().id
                            //         ); //使用上一个组件值
                            //     },
                            // },
                        ],
                    },
                ],
                lazy: false,
                pageNumberStart: 1,
                pageSize: 10,
                format: {
                    list: "list",
                    count: "total",
                    currentPage: "pageIndex",
                    pageSize: "pageSize",
                },
                datasource: (filter) => {
                    return Store.list(filter);
                },
            },
            //用户编辑
            modalOptions: {
                title: "编辑角色信息",
                width: 1000,
            },
            //表单的配置
            formOptions: {
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:80px",
                widgetStyle: "min-width:150px",
                fields: [
                    {
                        label: "角色名称",
                        name: "roleName",
                        widget: "input",
                        placeholder: "请输入角色名称",
                        validate: {
                            required: true,
                            maxlength: 128,
                        },
                    },
                    {
                        label: "描述",
                        name: "remark",
                        widget: "textarea",
                        style: "width:240px;",
                        rows: 5,
                        placeholder: "请输入描述",
                        validate: {
                            maxlength: 200,
                        },
                    },
                ],
                toolbar: false,
            },
            tempRecord: {},
            totalNum: 0,
        };
    },
    methods: {
        // 搜索
        searchData(filter) {
            this.$refs.table.search(filter);
        },
        // 编辑
        edit(record) {
            this.modalOptions.title = record ? "编辑角色" : "添加角色";
            Promise.resolve()
                .then(() => {
                    this.$refs.form.reset(record);
                    if (record && record.permissionIds) {
                        this.$refs.tree.checkNodes(record.permissionIds);
                    } else {
                        this.$refs.tree.clearChecked();
                    }
                    this.$refs.modal.open();
                })
                .then(() => {
                    this.$refs.tree.refresh();
                });
        },
        // 保存
        save(model) {
            var permissions = this.permissions;
            if (permissions.length == 0) {
                return $tip("请选择功能权限", "info");
            }
            model.permissionCode = permissions.join(",");
            model.type = 0;
            Store.save(model).then(() => {
                //关闭窗口
                this.$refs.modal.close();
                //刷新表格
                this.$refs.table.refresh();
                $tip("保存成功", "success");
            });
        },
        // 删除
        remove(item) {
            $confirm(`确认删除角色：${item.roleName}？`)
                .then(() => {
                    return Store.remove(item.id);
                })
                .then(() => {
                    this.$refs.table.refresh();
                    $tip("删除成功", "success");
                });
        },
        selectedPermission(nodes, parents) {
            this.permissions = nodes.map((n) => n.id) || [];
        },
        getTable(data, num) {
            this.totalNum = num;
        },
    },
    watch: {},
};
</script>
<style scoped lang="less">
@color-border: #e8e8e8;
@color-primary: #127bfe;
@color-background-white: #fff;
@color-background-menu: #1f2129;

.MODULE-RoleManage.MODULE-CONTAINER {
    .MODULE-MAJOR-CONTENT .PANEL-FULL {
        top: 50px;
    }
}
.dag-role-modal {
    .role-edit-panel {
        position: relative;
        height: 400px;
        & > div:first-child {
            position: absolute;
            left: 0px;
            width: 380px;
            top: 0px;
            bottom: 0px;
            border-right: 1px solid @color-border;
        }
        & > div:last-child {
            position: absolute;
            right: 0px;
            left: 380px;
            top: 0px;
            bottom: 0px;
            border-right: 1px solid @color-border;
        }
    }
    .dag-role-toolbar {
        display: block;
        padding: 10px;
        text-align: center;
        border-top: 1px solid @color-border;
    }
}
</style>
