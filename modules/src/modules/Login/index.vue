<template>
    <div class="login-container appLogin">
        <div id="particles-js" class="login-background"></div>
        <!-- <div id="particles"></div> -->
        <!-- <img class="img" :src="imgUrl" alt style="width:100%;height:100%" /> -->
        <div :class="['login-form',codelogin?'code-login':'']">
            <div class="login-title">
                <div class="title-text">
                    <dag-logo :width="32"></dag-logo>
                    {{applicationTitle}}
                </div>
            </div>
            <div class="login-content">
                <div v-show="!codelogin">
                    <xui-form ref="form" :options="formOptions" @submit="login" @keyup.enter.native="login($refs.form.getModel())"></xui-form>
                </div>
                <div v-show="codelogin" style="height:300px;">
                    <div id="login_container" style="width: 300px;height: 300px;margin: -20px auto 0px auto;"></div>
                </div>
                <span v-show="!codelogin" class="codelogin-trigger" @click="toCodelogin()">二维码登录</span>
                <span v-show="!regist&&!codelogin" class="regist-trigger" @click="regist=true">申请测试账号</span>
                <span v-show="regist||codelogin" class="regist-trigger" @click="regist=false;codelogin=false;">返回登录</span>
            </div>
        </div>
    </div>
</template>

<script>
const $tools = $import("dag/common/tools");
const $config = $import("dag/common/config");
const $http = $import("dag/common/http");
const $tip = $import("dag/common/tip");
const $business = $import("dag/common/business");

import Store from "./store.js";
import pJson from "./p";

export default {
    components: {
        DagLogo: $import("dag/components/Logo").Component,
    },
    data() {
        return {
            codelogin: false,
            regist: false,
            applicationTitle: $config.get("application.title"),
            imgUrl: "/images/background.png",
            formOptions: {
                cols: 1, //布局方式
                filterEmpty: false, //过滤掉空值项
                fillEmpty: "", //空值替换
                labelStyle: "min-width:80px",
                widgetStyle: "min-width:150px",
                fields: [
                    {
                        placeholder: "请输入用户名",
                        type: "text",
                        widget: "input",
                        style: "padding-left:30px;",
                        name: "loginName",
                        fieldClass: "userName",
                        default: "admin",
                        premise: () => {
                            return !this.regist;
                        },
                        validate: {
                            maxlength: 20,
                            userName: true,
                            required: true,
                        },
                    },
                    {
                        placeholder: "请输入密码",
                        type: "password",
                        widget: "input",
                        style: "padding-left:30px;",
                        name: "password",
                        fieldClass: "password",
                        default: "zzl123",
                        premise: () => {
                            return !this.regist;
                        },
                        validate: {
                            maxlength: 20,
                            required: true,
                        },
                    },
                    {
                        label: "姓名",
                        placeholder: "请输入姓名",
                        widget: "input",
                        style: "padding-left:15px;",
                        name: "name",
                        premise: () => {
                            return this.regist;
                        },
                        validate: {
                            maxlength: 20,
                            required: true,
                        },
                    },
                    {
                        label: "电话",
                        placeholder: "请输入电话",
                        widget: "input",
                        style: "padding-left:15px;",
                        name: "phoneNo",
                        premise: () => {
                            return this.regist;
                        },
                        validate: {
                            maxlength: 20,
                            required: true,
                        },
                    },
                ],
                toolbar: [
                    {
                        label: "登  录",
                        color: "primary",
                        premise: () => {
                            return !this.regist;
                        },
                        signal: "SUBMIT",
                    },
                    {
                        label: "立即申请",
                        color: "primary",
                        premise: () => {
                            return this.regist;
                        },
                        signal: "SUBMIT",
                    },
                ],
            },
        };
    },
    mounted() {
        var canvasDiv = document.getElementById("particles-js");
        var options = {
            particleColor: "#AAA",
            background: "/images/space.png",
            interactive: true,
            speed: "fast",
            density: "medium",
        };
        var particleCanvas = new ParticleNetwork(canvasDiv, options);
        this.getData();
    },
    methods: {
        getData() {
            // 若url上面有登录名与密码将直接登录
            let loginName = Base64.decode($tools.GetQueryString("loginName"));
            let password = Base64.decode($tools.GetQueryString("password"));
            let code = $tools.GetQueryString("code");
            if (loginName && password) {
                this.login({
                    loginName: loginName,
                    password: password,
                });
            } else if (code) {
                Store.loginByScan({
                    code,
                }).then((res) => {
                    this.afterLogin(res);
                });
            }
        },
        toCodelogin() {
            var obj = new WxLogin({
                id: "login_container",
                // appid: "wx271188d42a44eaa5",
                appid: "wx943819a286ca5db9",
                scope: "snsapi_login",
                redirect_uri: "http://www.qg-lot.com/redirect.html",
                state: "",
                style: "white", //这个是二维码样式
                href: "",
            });
            this.codelogin = true;
        },
        login(model) {
            if (this.regist) {
                return this.toRegist(model);
            }
            $http({
                url: "/api/m/sys/user/login",
                type: "POST",
                data: {
                    loginName: model.loginName,
                    password: model.password,
                },
            }).then((res) => {
                this.afterLogin(res);
            });
        },
        afterLogin(res) {
            $business.setCurrentUser(res);
            $tools.setCookie("JSSID", res.JSSID);
            var target = "Home";
            // var target = $business.checkPermission(commonTarget)
            //   ? commonTarget
            //   : res.permissionIdList && res.permissionIdList[0];
            if (target) {
                $router.push({ name: target });
                window.location.href = `${window.location.protocol}//${window.location.host}#/${target}`;
                $tip("登录成功！", "success");
            } else {
                $tip("当前用户无权限", "warn");
            }
        },
        toRegist(model) {
            Store.regist(model).then((res) => {
                $tip("申请成功！", "success");
                this.regist = false;
            });
        },
    },
};
</script>
<style scoped lang="less" >
.login-container {
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;
    // background: url("/images/background1.png") no-repeat;
    background: #333;
    background-size: 100% 100%;
    .login-background {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0px;
        bottom: 0px;
        z-index: 0;
    }
    #particles {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
    }
    .login-form {
        color: #fff;
        position: absolute;
        left: 50%;
        margin-left: -270px;
        top: 50%;
        margin-top: -200px;
        width: 450px;
        padding: 50px 45px;
        height: 300px;
        &.code-login {
            height: 380px;
        }
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.5);
        .login-title {
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
            width: 100%;
            display: inline-block;
            text-align: center;
            position: relative;
            letter-spacing: 5px;
            .icon-title {
                font-size: 3rem;
                position: absolute;
                left: 0;
                top: -10px;
            }
        }
        .login-content {
            position: relative;
            .codelogin-trigger {
                position: absolute;
                right: 100px;
                bottom: 70px;
                cursor: pointer;
                color: #43a2fb;
                &:hover {
                    color: #4487f1;
                }
            }
            .regist-trigger {
                position: absolute;
                right: 0px;
                bottom: 70px;
                cursor: pointer;
                color: #43a2fb;
                &:hover {
                    color: #4487f1;
                }
            }
            /deep/
                .xui-form.xui-form-style
                .xui-form-field
                .xui-field-widget.invalid.dirty:after {
                top: 90%;
            }
            /deep/ .xui-field-label {
                min-width: 40px !important;
                line-height: 35px;
                display: inline-block;
            }
            /deep/ .xui-toolbar .xui-btn.xui-btn-style.xui-btn-primary,
            /deep/ .xui-toolbar-item .xui-btn.xui-btn-style.xui-btn-primary {
                font-size: 20px;
                height: 38px;
                line-height: 38px;
            }

            /deep/ .xui-input.xui-input-style .xui-input-inner {
                height: 38px;
                line-height: 38px;
            }
            /deep/ .userName {
                &:after {
                    content: "\E73B";
                    position: absolute;
                    left: 6px;
                    top: 18px;
                    font-size: 18px;
                    color: #fff;
                    font-family: "xuiiconfont" !important;
                }
            }
            /deep/ .password {
                &:after {
                    content: "\E728";
                    position: absolute;
                    left: 6px;
                    top: 18px;
                    font-size: 18px;
                    color: #fff;
                    font-family: "xuiiconfont" !important;
                }
            }
        }
    }
    /deep/.xui-input.xui-input-style {
        width: 100%;
        background: rgba(255, 255, 255, 0.25);
        border: #f5f5f5;
        margin-bottom: 1rem;
        .xui-input-inner {
            border: #f5f5f5;
            color: #fff;
            background: transparent !important;
        }
    }
    /deep/ .xui-toolbar,
    /deep/.xui-toolbar-item {
        width: 100%;
        .xui-btn.xui-btn-style.xui-btn-primary {
            margin-top: 30px;
            width: 100%;
        }
    }
    .login-footer {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translate(-50%);
    }
}

@media screen and (max-width: 1440px) {
    //登录
    .appLogin.login-container .login-form {
        width: 320px;
        height: 300px;
        padding: 30px 30px 0;
        margin-left: -200px;
        margin-top: -165px;

        .login-title {
            font-size: 20px;

            .dag2-logo {
                padding: 0;
            }
        }

        .login-content {
            /deep/ .xui-toolbar .xui-btn.xui-btn-style.xui-btn-primary,
            .login-container
                .xui-toolbar-item
                .xui-btn.xui-btn-style.xui-btn-primary {
                font-size: 16px;
                height: 30px;
                line-height: 30px;
            }

            /deep/.xui-input.xui-input-style .xui-input-inner {
                height: 30px;
                line-height: 30px;
            }

            .userName:after,
            .password:after {
                top: 14px;
            }
        }
    }
}
</style>
