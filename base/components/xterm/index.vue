<template>
    <xui-modal class="termial-modal" ref="modal" :title="title" width="1200">
        <div class="xterm-container">
            <div class="term-header">
                <div :class="['term-item',currentSSh==ssh?'active':'']" v-for="ssh in sshConns" :key="ssh.id" @click="onTabChange(ssh)">
                    <label :class="['term-status-flag',ssh.linking?'linking':ssh.inited?'success':'error',]"></label>
                    {{ssh.host||"未命名"}}
                    <i class="xui-icon xui-icon-close" @click.stop="closeSsh(ssh)"></i>
                </div>
                <div class="term-item term-add" @click="addNewTerm()">
                    <i class="xui-icon xui-icon-add"></i>
                </div>
                <i class="xui-icon xui-icon-close" @click="close"></i>
            </div>
            <div class="xterm-login" v-show="showShim">
                <xui-form ref="form" class="xterm-login-form" :options="formOptions" @submit="link"></xui-form>
            </div>
            <div class="xterm-panels">
                <term-shell v-show="ssh==currentSSh" v-for="ssh in sshConns" :key="ssh.id" style="height:100%;width:100%;" :ref="'term_'+ssh.id"></term-shell>
            </div>
        </div>
    </xui-modal>
</template>

<script>
const $tip = $import("dag/common/tip");

import TermShell from "./term";

export default {
    components: {
        TermShell
    },
    data() {
        return {
            sshConns: [],
            currentSSh: null,
            showShim: true,
            title: "",
            ws: null,
            term: null,
            formOptions: {
                cols: 2,
                fields: [
                    {
                        label: "主机",
                        name: "host",
                        widget: "input",
                        placeholder: "请输入主机",
                        validate: {
                            ip: true,
                            required: true
                        }
                    },
                    {
                        label: "端口",
                        name: "port",
                        widget: "input",
                        placeholder: "请输入端口",
                        validate: {
                            port: true,
                            required: true
                        }
                    },
                    {
                        label: "用户名",
                        name: "username",
                        widget: "input",
                        placeholder: "请输入用户名",
                        validate: {
                            required: true
                        }
                    },
                    {
                        label: "密码",
                        name: "password",
                        widget: "input",
                        placeholder: "请输入密码",
                        validate: {
                            required: true
                        }
                    }
                ],
                toolbar: [
                    {
                        label: "连接",
                        color: "primary",
                        signal: "SUBMIT"
                    },
                    {
                        label: "取消",
                        color: "info",
                        operate: () => {
                            this.$refs.modal.close();
                        }
                    }
                ]
            }
        };
    },
    mounted() {
        window.$terminal = {
            open: (...args) => {
                this.open.apply(this, args);
            }
        };
    },
    methods: {
        open(server) {
            if (!server && this.sshConns.length > 0) {
                this.$refs.modal.open();
                return;
            }
            server = server || {};
            var host = server.host || "$new";
            var openedSSh = this.sshConns.filter(s => s.host === host)[0];
            if (openedSSh) {
                this.onTabChange(openedSSh);
            } else {
                this.addNewTerm(server);
            }
            this.$refs.modal.open();
        },
        addNewTerm(server) {
            if (this.sshConns.length >= 5) {
                $tip("最多打开5个控制台", "warn");
                return false;
            }
            server = server || {};
            var openedSSh = {
                id: Date.now(),
                host: server.host || "",
                inited: false,
                linking: false
            };
            this.sshConns.push(openedSSh);
            this.onTabChange(openedSSh);
            return true;
        },
        onTabChange(ssh) {
            this.currentSSh = ssh;
            if (!ssh.inited) {
                this.$refs.form.reset({
                    host: ssh.host || "",
                    port: ssh.port || "22",
                    username: ssh.username || "root",
                    password: ssh.password || ""
                });
                this.showShim = true;
            } else {
                this.showShim = false;
            }
        },
        link(model) {
            var current = this.currentSSh;
            if (current.linking) {
                return;
            }
            current.linking = true;
            if (
                this.$refs[`term_${current.id}`] &&
                this.$refs[`term_${current.id}`][0]
            ) {
                this.$refs[`term_${current.id}`][0]
                    .open(model)
                    .then(res => {
                        if (this.currentSSh == current) {
                            this.showShim = false;
                        }
                        current.inited = true;
                        if (current.host != res.host) {
                            current.host = res.host;
                        }
                        current.linking = false;
                    })
                    .catch(e => {
                        $tip(e, "warn");
                        current.linking = false;
                    });
            }
        },
        closeSsh(ssh) {
            if (
                this.$refs[`term_${ssh.id}`] &&
                this.$refs[`term_${ssh.id}`][0]
            ) {
                this.$refs[`term_${ssh.id}`][0].close();
                var index = this.sshConns.indexOf(ssh);
                this.sshConns.splice(index, 1);
                if (this.sshConns.length == 0) {
                    this.close();
                } else {
                    var s = this.sshConns[index > 0 ? index - 1 : 0];
                    this.onTabChange(s);
                }
            }
        },
        close() {
            this.$refs.modal.close();
            this.$emit("active", this.sshConns.filter(s => s.inited).length);
        }
    }
};
</script>
<style lang="less">
.termial-modal {
    .xui-modal-header {
        display: none;
    }
}
.xterm-container {
    width: 100%;
    height: 600px;
    position: relative;
    .xterm-login {
        position: absolute;
        top: 35px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 10;
        background: #000;
        color: #fff;
        .xterm-login-form {
            width: 650px;
            margin: 50px auto;
            .xui-form-field .xui-field-label {
                min-width: 40px;
            }
            .xui-toolbar.xui-toolbar-style {
                padding-top: 20px;
                text-align: center;
            }
        }
    }
    .term-header {
        color: #333;
        height: 35px;
        padding: 7px 10px 0px 5px;
        & > .xui-icon-close {
            font-size: 18px;
            float: right;
            margin-top: 3px;
            cursor: pointer;
            &:hover {
                color: #ababab;
            }
        }
        .term-item {
            position: relative;
            display: inline-block;
            vertical-align: bottom;
            max-width: 135px;
            height: 28px;
            line-height: 28px;
            padding: 0px 15px 0px 15px;
            margin-left: -5px;
            text-align: left;
            &.active {
                color: #fff;
                z-index: 10;
                &:before {
                    background: #127bfe;
                }
                &:hover {
                    &:before {
                        background: #127bfe;
                    }
                }
            }
            &:hover {
                &:before {
                    background: rgba(#127bfe, 0.4);
                }
            }
            cursor: pointer;
            &:before {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: #e7eaed;
                z-index: -1;
                transform: scaleY(1.45) perspective(100px) rotateX(30deg);
                transform-origin: bottom;
                border-radius: 0.5em 0.5em 0 0;
                border: 1px solid #dedede; /*描边*/
                border-bottom: none; /*去掉底边框*/
            }
            .xui-icon-close {
                float: right;
                font-size: 12px;
                margin-left: 5px;
                text-align: center;
                &:before {
                    display: inline-block;
                    vertical-align: middle;
                    height: 19px;
                    width: 19px;
                    line-height: 20px;
                    border-radius: 20px;
                    transition: 0.2s all;
                }
                &:hover {
                    &:before {
                        height: 19px;
                        width: 19px;
                        background: rgba(#ababab, 0.5);
                        border-radius: 20px;
                    }
                }
            }

            @-webkit-keyframes twinkling {
                /*透明度由0到1*/
                0% {
                    opacity: 0; /*透明度为0*/
                }
                100% {
                    opacity: 1; /*透明度为1*/
                }
            }
            .term-status-flag {
                width: 6px;
                height: 6px;
                border-radius: 10px;
                display: inline-block;
                vertical-align: middle;
                background: #f54e4e;
                &.linking {
                    background: #e6a23c;
                    -webkit-animation: twinkling 1s infinite ease-in-out;
                    animation: twinkling 1s infinite ease-in-out;
                }
                &.success {
                    background: #67c23a;
                }
            }

            &.term-add {
                width: 25px;
                font-size: 16px;
                font-weight: bold;
            }
        }
    }
    .xterm-panels {
        position: absolute;
        top: 35px;
        left: 0px;
        right: 0px;
        bottom: 0px;
    }
}
</style>