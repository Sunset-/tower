<template>
    <div class="app-container">
        <header class="app-header">
            <div class="app-logo" @click="home">
                <!-- <div class="app-logo-imgwrap">
                    <img class="app-logo-img" v-show="applicationLogo" :src="applicationLogo" />
                </div> -->
                <span>{{ applicationTitle }}</span>
            </div>
            <div class="header-user">
                <span class="header_username" :title="userName">
                    <div
                        v-if="applicationLogo"
                        style="
                            height: 35px;
                            width: 35px;
                            display: inline-block;
                            vertical-align: middle;
                            overflow: hidden;
                            border-radius: 50px;
                            margin-right: 5px;
                        "
                    >
                        <img
                            class="app-logo-img"
                            style="height: 100% ;"
                            :src="applicationLogo"
                        />
                    </div>
                    <i
                        v-if="!applicationLogo"
                        class="xui-icon xui-icon-people_fill"
                        style="
                            display: inline-block;
                            vertical-align: middle;
                            line-height: 16px;
                        "
                    ></i>
                    <span
                        style="display: inline-block; vertical-align: middle"
                        >{{ userName }}</span
                    >
                    <ul class="header_down">
                        <li @click="editorPassword">修改密码</li>
                        <li @click="loginOut">登出</li>
                    </ul>
                </span>
            </div>
        </header>
        <div class="app-content">
            <div
                :class="['app-sidebar']"
                @mouseenter="showSideMenu(true)"
                @click="showSideMenu(true, true)"
                @mouseleave="showSideMenu(false)"
            >
                <el-menu
                    :default-active="$route.name"
                    background-color="#1F2129"
                    text-color="#efefef"
                    :router="true"
                    class="el-menu-vertical-demo"
                    style="overflow: hidden; border-right: none"
                    @open="handleOpen"
                    @close="handleClose"
                >
                    <template v-for="(item, index) in menus">
                        <el-submenu
                            v-if="
                                !item.hide && item.menu && checkPermission(item)
                            "
                            :key="index"
                            :index="item.name"
                        >
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{ item.title }}</span>
                            </template>
                            <el-menu-item
                                v-for="(sitem, sindex) in item.menu"
                                :key="sindex"
                                v-show="checkPermission(sitem)"
                                :index="sitem.name"
                            >
                                {{ sitem.title }}</el-menu-item
                            >
                        </el-submenu>
                        <el-menu-item
                            v-if="
                                !item.hide &&
                                !item.menu &&
                                checkPermission(item)
                            "
                            :key="index"
                            :index="item.name"
                        >
                            <i :class="item.icon"></i>&nbsp;{{ item.title }}
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
            <div class="app-major" id="app-major">
                <router-view @refreshlogo="refreshlogo"></router-view>
            </div>
        </div>
        <!-- 修改密码弹框 -->
        <xui-modal ref="modal" :options="modalOptions" :mask-close="false">
            <xui-form
                ref="form"
                :options="formOptions"
                @submit="save"
            ></xui-form>
        </xui-modal>
    </div>
</template>
<script>
const $tools = $import("dag/common/tools");
const $config = $import("dag/common/config");
const $dictionary = $import("dag/common/dictionary");
const $business = $import("dag/common/business");
const $http = $import("dag/common/http");
const $tip = $import("dag/common/tip");

import "element-ui/lib/theme-chalk/index.css";

export default {
    components: {
        DagLogo: $import("dag/components/Logo").Component,
    },
    data() {
        return {
            applicationTitle: $config.get("application.title"),
            singleNode: $config.get("singleNode"),
            editionVersion: "",
            hideSideMenuTimer: null,
            sideMenuVisible: false,
            subMenuPrant: "",
            isHover: "",
            miniMenu: false,
            currentSecondMenu: [],
            modalOptions: {
                title: "修改密码",
                width: 660,
            },
            alarmShow: false,
            expireTime: "",
            formOptions: {
                cols: 1,
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:120px",
                widgetStyle: "min-width:100px",
                fields: [
                    {
                        label: "旧密码",
                        name: "password",
                        widget: "input",
                        type: "password",
                        widgetStyle: "width:100%;",
                        placeholder: "请输入旧密码",
                        validate: {
                            required: true,
                            maxlength: 20,
                        },
                    },
                    {
                        label: "新密码",
                        name: "passwordNew",
                        widget: "input",
                        widgetStyle: "width:100%;",
                        type: "password",
                        placeholder: "请输入新密码",
                        validate: {
                            required: true,
                            maxlength: 20,
                            password: true,
                        },
                    },
                    {
                        label: "确认密码",
                        name: "passwordNewAgain",
                        widget: "input",
                        widgetStyle: "width:100%;",
                        type: "password",
                        placeholder: "请再次输入新密码",
                        validate: {
                            required: true,
                            password: true,
                            maxlength: 20,
                        },
                    },
                ],
                validate(model) {
                    if (model.passwordNew != model.passwordNewAgain) {
                        $tip("两次密码输入不一致", "warn");
                        throw new Error("两次密码输入不一致");
                    }
                    if (model.password == model.passwordNewAgain) {
                        $tip("原密码与新密码相同", "warn");
                        throw new Error("原密码与新密码相同");
                    }
                },
                toolbar: [
                    {
                        label: "确定",
                        color: "primary",
                        signal: "SUBMIT",
                    },
                    {
                        label: "取消",
                        color: "default",
                        operate: () => {
                            this.$refs.modal.close();
                        },
                    },
                ],
            },
            menus: [],
            timeId: null,
            keepAliveTimeId: null,
            alarmNumber: 0,
            isAlarmNumber: false,
            alarmTypes: [],
            expireTimeUrl: "/api/dag/v2/resource/expireTime",
            singleNodeExpireTimeUrl:
                "api/dag/v2/resource/node/getExpireTimeMap",
            wsUrl: "ws://172.16.132.143:9809/websocket",
            activeConsolerNumber: 0,
            currentUser: $business.getCurrentUser(),
        };
    },
    computed: {
        routekey() {
            return this.$route.name !== undefined
                ? this.$route.name + +new Date()
                : this.$route + +new Date();
        },
        // applicationTitle() {
        //     var user = this.currentUser || {};
        //     return user.title || "物联网管理平台";
        // },
        applicationLogo() {
            var user = this.currentUser || {};
            if (!user.logoPath) {
                return "";
            }
            return user.imgUrl + user.logoPath;
        },
        userName() {
            var user = $business.getCurrentUser();
            return user.userName || user.userId;
        },
        moduleMap() {
            var map = {};
            this.menus.forEach((item) => {
                if (item.name) {
                    map[item.name] = true;
                }
                if (item.menu) {
                    item.menu.forEach((citem) => {
                        if (citem.name) {
                            map[citem.name] = true;
                        }
                    });
                }
            });
            return map;
        },
    },
    beforeDestroy() {
        clearInterval(this.timeId);
        this.timeId = null;
    },
    methods: {
        init() {
            //获取菜单
            this.initMenus();
        },
        home() {
            $router.push({ name: this.singleNode ? "DataStatistics" : "Home" });
            this.currentSecondMenu = [];
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        showSideMenu(flag, force) {
            if (flag) {
                clearTimeout(this.hideSideMenuTimer);
                this.sideMenuVisible = true;
            } else {
                if (force) {
                    this.sideMenuVisible = false;
                    this.subMenuPrant = "";
                } else {
                    this.hideSideMenuTimer = setTimeout(() => {
                        this.sideMenuVisible = false;
                        this.subMenuPrant = "";
                    }, 400);
                }
            }
        },
        showSubMenu(item) {
            if (item && item.menu) {
                this.subMenuPrant = item.title;
                return;
            }
            this.subMenuPrant = "";
        },
        go(item, $ev) {
            this.menus.forEach((m) => {
                m.expand = false;
            });
            if (item.module) {
                $router.push({ name: item.name });
                this.activeParentMenu(item.name);
                this.showSideMenu(false, true);
            }
        },
        activeMenu(item) {
            if (item) {
                var routeName = this.getRouteModuleName();
                if (item.name && item.name == routeName) {
                    return true;
                }
                if (item.menu) {
                    for (var i = 0, citem; (citem = item.menu[i++]); ) {
                        if (citem.name == routeName) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        activeParentMenu(moduleName) {
            var routeName = moduleName || this.getRouteModuleName();
            var menus = this.menus;
            for (var i = 0, item; (item = menus[i++]); ) {
                if (item.name && item.name == routeName) {
                    this.currentSecondMenu = [];
                    return true;
                }
                if (item.menu) {
                    for (var j = 0, citem; (citem = item.menu[j++]); ) {
                        if (citem.name == routeName) {
                            item.expand = true;
                            this.currentSecondMenu = item.menu || [];
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        getRouteModuleName() {
            var moduleMap = this.moduleMap;
            var rs = this.$route.matched;
            for (var i = rs.length - 1; i >= 0; i--) {
                if (moduleMap[rs[i].name]) {
                    return rs[i].name;
                }
            }
        },
        // 修改密码
        editorPassword() {
            this.$refs.modal.open();
            this.$refs.form.reset();
        },
        save(model) {
            $http({
                url: "/api/m/sys/user/modifyPassword",
                type: "POST",
                data: {
                    password: model.password,
                    passwordNew: model.passwordNew,
                },
            }).then((res) => {
                $tip("修改成功", "success");
                this.$refs.modal.close();
            });
        },
        // 退出
        loginOut() {
            $http({
                url: "/api/m/sys/user/logout",
                type: "post",
            }).then((res) => {
                $tip("登出成功", "success");
                $tools.delCookie("JSSID");
                $tools.removeLocalValue("menus");
                $business.setCurrentUser();
                $router.push("/Login");
            });
        },
        // 关于
        about() {
            this.editionVersion = $config.get("edition.version");
            this.$refs.abortModal.open();
        },
        initMenus(res) {
            return fetch(`./config/menu.json`)
                .then((menus) => {
                    return menus.json();
                })
                .then((menus) => {
                    this.menus = menus.menu;
                    $tools.removeLocalValue("menus");
                    $tools.setLocalValue("menus", menus);
                    this.activeParentMenu();
                });
        },
        showConsole() {
            $terminal && $terminal.open();
        },
        showActiveConsole(activeNumber) {
            this.activeConsolerNumber = activeNumber;
        },
        checkPermission(menuItem) {
            if (!menuItem.menu) {
                //叶子菜单
                return (
                    !menuItem.meta ||
                    !menuItem.meta.permission ||
                    $business.checkPermission(menuItem.meta.permission)
                );
            }
            return (
                menuItem.menu.filter((item) => {
                    return this.checkPermission(item);
                }).length > 0
            );
        },
        refreshlogo() {
            this.currentUser = $$business.getCurrentUser();
        },
    },
    mounted() {
        this.init();
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
//头部高度
@header-height: 50px;
@sidebar-width: 210px;
@sidebar-mini-width: 50px;
@menu-item-height: 50px;
.abortModal.xui-modal.xui-modal-style {
    .xui-modal-header {
        position: absolute;
        right: 0;
    }
    .xui-modal-box {
        border-radius: 12px;
        width: 600px;
        overflow: hidden;
    }
    .dag2-logo {
        position: absolute;
        left: 25%;
        top: 48px;
        > div {
            border: 5.4px solid #000;
            .logo-line,
            .logo-point1,
            .logo-point2 {
                background: #000;
            }
            &:after,
            &:before {
                background: #fff;
            }
        }
    }
    .xui-modal-title {
        display: none;
    }
    .abortModal_content {
        text-align: center;
        .about-footer {
            margin: 0 auto 10px auto;
            display: block;
        }
        .about-footer_mini {
            display: none;
        }
        .about-img {
            width: 100%;
            height: 180px;
        }
        .about-text {
            height: 180px;
            position: relative;
            .logo {
                display: block;
            }
            .logo_mini {
                display: none;
            }
        }
        .abortModal_content_text {
            text-align: left;
            vertical-align: middle;
            position: absolute;
            left: 42%;
            top: 46px;
            .text_title {
                width: 100%;
                display: inline-block;
                margin-bottom: 1.5rem;
                font-size: 28px;
                width: 100%;
                display: inline-block;
                position: relative;
                letter-spacing: 8px;
            }
            .text {
                width: 100%;
                display: inline-block;
                height: 32px;
                font-size: 14px;
                color: #1e2563;
            }
        }
    }
}
.app-container {
    width: 100%;
    margin: 0px auto;
    height: 100%;
    overflow: hidden;
    position: relative;
    min-width: 1200px;
    .app-header {
        user-select: none;
        height: @header-height;
        line-height: @header-height;
        background: #fff;
        color: #fff;
        position: relative;
        z-index: 999;
        .app-logo {
            display: inline-block;
            vertical-align: top;
            padding: 0px 5px;
            font-size: 20px;
            height: 50px;
            margin-right: 20px;
            line-height: @header-height;
            background: #1f2129;
            width: @sidebar-width;
            box-sizing: border-box;
            cursor: pointer;
            white-space: nowrap;
            .app-logo-imgwrap {
                display: inline-block;
                height: 46px;
                margin: 2px 5px 0px 0px;
                position: relative;
                &:after {
                    position: absolute;
                    content: "";
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                }
            }
            .app-logo-img {
                height: 100%;
            }
            i {
                display: inline-block;
                vertical-align: top;
                font-size: 30px;
            }
            span {
                display: inline-block;
                vertical-align: top;
            }
        }
        .header-second-menu {
            display: inline-block;
            & > div {
                display: inline-block;
                cursor: pointer;
                padding: 0px 25px;
                position: relative;
                font-size: 16px;
                color: rgba(255, 255, 255, 0.6);
                &.active {
                    color: @color-white;
                    background: @color-sidebar-active;
                    &:after {
                        content: "";
                        position: absolute;
                        bottom: 0px;
                        left: 15px;
                        right: 15px;
                        height: 3px;
                        // background: @color-white;
                    }
                }
                &:hover {
                    color: @color-white;
                    background: @color-sidebar-hover;
                }
            }
        }
        .header-user {
            float: right;
            padding-right: 2rem;
            color: #343434;
            .headerAlarm {
                position: absolute;
                right: 140px;
                text-align: right;
            }
            .header_username {
                height: 100%;
                width: 120px;
                text-align: center;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                cursor: pointer;
                &:hover {
                    color: @color-primary;
                    .header_down {
                        display: block;
                    }
                }
                .xui-icon-people_fill {
                    color: #fff;
                    background: #dcdcdc;
                    border-radius: 50px;
                    padding: 3px;
                    margin-right: 5px;
                }
            }
            .header_down {
                color: #000;
                background: #fff;
                text-align: center;
                display: none;
                position: relative;
                cursor: pointer;
                z-index: 99;
                border-radius: 2px;
                border: 1px solid #efefef;
                box-shadow: 6px 6px 6px 6px rgba(0, 0, 0, 0.15);
                &:after {
                    content: "";
                    position: absolute;
                    left: 10px;
                    top: -13px;
                    width: 0px;
                    height: 0px;
                    border-width: 7px;
                    z-index: 2;
                    border-style: solid;
                    border-color: transparent;
                    border-bottom-color: #fff;
                }
                &:before {
                    content: "";
                    position: absolute;
                    left: 10px;
                    top: -14px;
                    width: 0px;
                    height: 0px;
                    border-width: 7px;
                    z-index: 1;
                    border-style: solid;
                    border-color: transparent;
                    border-bottom-color: #efefef;
                }
                li {
                    height: 40px;
                    line-height: 40px;
                    &:hover {
                        color: @color-primary;
                    }
                    border-bottom: 1px solid #f5f5f5;
                    &:last-child(1) {
                        border-bottom: 1px solid #fff;
                    }
                }
            }
        }
    }
    .app-content {
        position: absolute;
        top: 0;
        right: 0px;
        left: 0px;
        bottom: 0px;
        .app-sidebar {
            position: absolute;
            top: 50px;
            bottom: 0px;
            left: 0px;
            width: @sidebar-width;
            background: @color-background-menu;
            z-index: 2100;
            user-select: none;
            &.mini {
                width: @sidebar-mini-width;
                overflow: hidden;
                box-shadow: none;
                z-index: 999;
                .app-menu-item {
                    & > a {
                        display: none;
                    }
                }
            }
            .app-menu-mask {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                border-right: 1px solid @color-border-dark;
                z-index: 10;
                background: @color-background-menu;
            }
            .console-trigger {
                position: absolute;
                left: 12px;
                bottom: 14px;
                color: #fff;
                z-index: 10;
                cursor: pointer;
                &:hover {
                    background: @color-primary;
                }
                i {
                    font-size: 22px;
                }
                & > span {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: @color-primary;
                    padding: 3px 5px;
                    border-radius: 10px;
                    font-size: 12px;
                }
            }
        }
        .app-major {
            position: absolute;
            top: 50px;
            bottom: 0px;
            background: #efefef;
            left: @sidebar-width;
            right: 0px;
            overflow-y: auto;
        }
        .singleNode-app-major {
            left: 0;
        }
    }
}
</style>