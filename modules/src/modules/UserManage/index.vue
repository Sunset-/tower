<template>
    <div class="MODULE-CONTAINER MODULE-UserManage">
        <div class="MODULE-MAJOR-CONTENT">
            <div class="PANEL-SEARCH-TOOLBAR">
                <xui-filter ref="filter" :options="filterOptions" @filter="searchData"></xui-filter>
                <xui-toolbar class="RIGHT-TOOLBAR" :options="toolbarOptions"></xui-toolbar>
            </div>
            <div class="PANEL-BUTTON-CONTAINER" @click="tableClick">
                <xui-table ref="table" :options="tableOptions" @checked="onChecked" @output="getTable">
                    <div slot="empty" style="padding:30px 0px;text-align:center;">无数据</div>
                </xui-table>
            </div>
        </div>
        <!-- 用户编辑 -->
        <user-detail ref="detail" @refresh="refresh"></user-detail>
        <!-- 用户logo编辑 -->
        <!-- <user-logodetail ref="logodetail" @refresh="refresh"></user-logodetail> -->
        <!-- 资源权限 -->
        <!-- 用户登录记录 -->
        <user-history ref="history" @refresh="refresh"></user-history>
        <!-- 用户编辑 -->
        <user-permission ref="permission" @refresh="refresh"></user-permission>
        <xui-modal ref="resetresult" width="400" title="密码重置" :maskClose="false">
            <div class="reset-result-modal">
                <div>
                    <i class="xui-icon xui-icon-success_fill color-success"
                        style="font-size:28px;display:inline-block;vertical-align:middle;"></i>
                    <span style="display:inline-block;vertical-align:middle;">重置成功！</span>
                </div>
                <div style="padding-left:32px;">用户名：{{resetUser.name}}</div>
                <div style="padding-left:32px;">新密码：{{resetUser.password}}<xui-button class="copy-password" size="mini"
                        style="margin-left:10px;margin-top:-3px;">复制</xui-button>
                </div>
            </div>
        </xui-modal>
    </div>
</template>
<script>
const $tools = $import("dag/common/tools");
const $business = $import("dag/common/business");
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");

import Store from "./store";
import UserDetail from "./detail";
import UserLogodetail from "./logodetail";
import UserHistory from "./history";
import UserPermission from "./permission";

import ClipboardJS from "clipboard";

export default {
    components: {
        UserDetail,
        UserLogodetail,
        UserHistory,
        UserPermission,
    },
    data() {
        return {
            path: [
                {
                    title: "用户管理",
                    name: "UserManage",
                },
            ],
            checkedRecords: [],
            // 搜索条件的配置
            filterOptions: {
                cols: false,
                fields: [
                    {
                        name: "userName",
                        widget: "input",
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
                        permission: "UserManage_Add",
                        operate: () => {
                            var user = $business.getCurrentUser();
                            if (!user) {
                                $tip("未登录", "warning");
                                return;
                            }
                            this.edit({
                                parentId: user.userId,
                                logoPath: user.logoPath,
                                title: user.title,
                            });
                        },
                    },
                    // {
                    //     label: "修改登录标识",
                    //     color: "primary",
                    //     permission: "UserManage_ModifyLogo",
                    //     operate: () => {
                    //         if (this.checkedRecords.length == 0) {
                    //             $tip("请选择用户");
                    //             return;
                    //         }
                    //         this.$refs.logodetail.open(this.checkedRecords);
                    //     },
                    // },
                ],
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
                        title: "登录名",
                        name: "loginName",
                        align: "left",
                        headAlign: "left",
                        style: "padding-left:10px;",
                        headStyle: "padding-left:10px;",
                    },
                    {
                        title: "真实姓名",
                        name: "userName",
                        align: "center",
                        style: "width:200px",
                    },
                    {
                        title: "角色",
                        name: "roleName",
                        align: "center",
                        // format(v, record) {
                        //     if (
                        //         record.roleEntityList &&
                        //         record.roleEntityList.length > 0
                        //     ) {
                        //         return record.roleEntityList
                        //             .map((item) => item.roleName)
                        //             .join(",");
                        //     } else {
                        //         return "-";
                        //     }
                        // },
                    },
                    {
                        title: "登陆次数",
                        name: "loginCount",
                        align: "center",
                        format(v, record) {
                            return `<div class="user-login-num" data-id="${record.userId}" data-loginname="${record.loginName}" data-username="${record.userName}" style="color:#4487F1;cursor:pointer;">${v}</div>`;
                        },
                    },
                    {
                        title: "最后登录时间",
                        name: "lastLoginTime",
                        format: "DATETIME",
                        align: "center",
                    },
                    {
                        title: "状态",
                        name: "isActive",
                        toolbar: {
                            size: "mini",
                            tools: [
                                {
                                    title: "变更状态",
                                    size: "mini",
                                    type: "switch",
                                    default(record) {
                                        return record.isActive == 1;
                                    },
                                    disabled() {
                                        return !$business.checkPermission(
                                            "UserManage_Status"
                                        );
                                    },
                                    operate: (record) => {
                                        var p = JSON.parse(
                                            JSON.stringify(record)
                                        );
                                        p.isActive = p.isActive == 1 ? 0 : 1;
                                        return Store.save(p).then(() => {
                                            $tip("修改成功", "success");
                                            record.isActive = p.isActive;
                                        });
                                    },
                                },
                            ],
                        },
                    },
                    {
                        title: "操作栏",
                        style: "width:420px;text-align:center;",
                        toolbar: {
                            size: "mini",
                            tools: [
                                {
                                    label: "编辑",
                                    color: "primary-text",
                                    permission: "UserManage_Modify",
                                    operate: (record) => {
                                        this.edit(record);
                                    },
                                },
                                {
                                    label: "添加下级用户",
                                    color: "warning-text",
                                    permission: "UserManage_AddSub",
                                    operate: (record) => {
                                        this.edit({
                                            parentId: record.userId,
                                            logoPath: record.logoPath,
                                            title: record.title,
                                        });
                                    },
                                },
                                {
                                    label: "重置密码",
                                    color: "success-text",
                                    permission: "UserManage_ResetPassword",
                                    operate: (record) => {
                                        this.resetPassword(record);
                                    },
                                },
                                {
                                    label: "分配设备资源",
                                    color: "primary-text",
                                    permission: "UserManage_AssignResource",
                                    operate: (record) => {
                                        this.$refs.permission.open(record);
                                    },
                                },
                                // {
                                // 	label: "修改密码",
                                // 	style: "color:#38aef3",
                                // 	operate: record => {
                                // 		this.editPassword(record);
                                // 	}
                                // },
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
                pagerOptions: {
                    layout: "total,prev,first,last,next",
                    sizer: [10, 20, 50, 100, 500],
                },
                datasource: (filter) => {
                    // filter.sortField = "registerTime";
                    // filter.sortType = "desc";
                    filter.parentId = $business.getCurrentUser().userId;
                    return Store.list(filter);
                },
            },
            tempRecord: {},
            totalNum: 0,
            saveLock: false,
            resetUser: {},
        };
    },
    methods: {
        tableClick(event) {
            var target = event.target;
            if (target.className == "user-login-num") {
                var userId = target.dataset.id;
                this.$refs.history.open({
                    userId: userId,
                    userName: target.dataset.username,
                    loginName: target.dataset.loginname,
                });
            }
        },
        // 搜索
        searchData(filter) {
            this.$refs.table.search(filter);
        },
        // 改变状态
        changeStatus(data, v) {
            Store.changeStatus({ id: data.id, status: v ? "1" : "2" })
                .then(() => {
                    this.$refs.table.refresh();
                    $tip(`${v ? "启用" : "禁用"}成功`, "success");
                })
                .catch((err) => {
                    $tip(err.message || "服务异常", "error");
                    this.$refs.table.refresh();
                });
        },
        // 编辑
        edit(record) {
            this.$refs.detail.open(record);
        },
        refresh() {
            this.$refs.table.refresh();
        },
        onChecked(checkedRecords) {
            this.checkedRecords = checkedRecords;
        },
        // 删除
        remove(item) {
            $confirm(`确认删除用户：${item.name}？`)
                .then(() => {
                    return Store.remove(item.id);
                })
                .then(() => {
                    this.$refs.table.refresh();
                    $tip("删除成功", "success");
                });
        },
        // 重置密码
        resetPassword(data) {
            $confirm(`确定重置密码？`)
                .then(() => {
                    Store.resetPassword(data.userId).then((res) => {
                        //刷新表格
                        this.$refs.table.refresh();
                        this.resetUser = {
                            name: data.loginName,
                            password: res.showPassword,
                        };
                        this.$refs.resetresult.open();
                        var clipboard = new ClipboardJS(".copy-password", {
                            text: function (trigger) {
                                return res.showPassword;
                            },
                        });
                        clipboard.on("success", function (e) {
                            $tip("已复制到剪切板", "success");
                        });
                    });
                })
                .catch(() => {});
        },
        copyPassword() {
            $tip("已复制到剪切板", "success");
        },
        getTable(data, num) {
            this.totalNum = num;
        },
    },
    watch: {},
};
</script>
<style scoped lang="less">
@color-primary: #127bfe;
@color-background-white: #fff;
@color-background-menu: #1f2129;
/deep/.xui-modal-footer {
    @keyframes toggleRotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes toggleRotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .dag-circle-loading {
        vertical-align: middle;
        &:after {
            content: "";
            border-radius: 50%;
            width: 10px;
            height: 10px;
            float: left;
            font-size: 10px;
            position: relative;
            text-indent: -9999em;
            border-top: 2px solid rgba(#fff, 0.2);
            border-right: 2px solid fade(#fff, 20%);
            border-bottom: 2px solid fade(#fff, 20%);
            border-left: 2px solid currentColor;
            -webkit-animation: toggleRotate 1.1s infinite linear;
            animation: toggleRotate 1.1s infinite linear;
        }
    }
}
.MODULE-UserManage.MODULE-CONTAINER {
    .MODULE-MAJOR-CONTENT .PANEL-FULL {
        top: 50px;
    }
}
.reset-result-modal {
    padding: 10px 30px;
    line-height: 25px;
}
</style>
