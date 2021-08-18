<template>
    <div style="height:100%;width:100%;" ref="terminal"></div>
</template>
<script>
    
// import { Terminal } from "xterm";
// import "xterm/css/xterm.css";
// import { FitAddon } from "xterm-addon-fit";
// import { WebglAddon } from "xterm-addon-webgl";

export default {
    data() {
        return {
            ws: null,
            term: null,
        };
    },
    methods: {
        open(model){
            this.initXterm();
            return this.initWsShell(model);
        },
        initXterm() {
            let _this = this;
            let term = (this.term = new Terminal({
                cols: 50,
                rows: 50, //行数
                scrollback: 1000, //终端中的回滚量
                cursorStyle: "underline", //光标样式
                cursorBlink: true, //光标闪烁
                theme: {
                    foreground: "white", //字体
                    background: "#060101", //背景色
                    cursor: "help" //设置光标
                }
            }));
            var fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(this.$refs["terminal"]);
            term.loadAddon(new WebglAddon());
            fitAddon.fit();
            term.onData(data => {
                this.ws &&
                    this.ws.send(
                        JSON.stringify({
                            type: "cmd",
                            Data: Base64.encode(data) // encode data as base64 format
                        })
                    );
            });
        },
        initWsShell(model) {
            return new Promise((resolve,reject)=>{
                this.ws = new WebSocket(
                    `ws://${location.host}/proxyApi/proxy/ws2ssh?host=${model.host}&port=${model.port}&user=${model.username}&password=${model.password}&cols=${this.term.cols}&rows=${this.term.rows}`
                );
                this.ws.onopen = evt => {
                    resolve(model);
                };
                this.ws.onclose = (evt) =>{
                    this.term && this.term.reset();
                    reject("SSH连接异常，请检查连接参数")
                };
                this.ws.onerror = function(evt) {
                };
                this.ws.onmessage = e => {
                    if (e) {
                        let data = e.data;
                        this.term.write(data);
                        this.order = "";
                    }
                };
            })
        },
        close() {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
            this.term && this.term.reset();
        }
    }
};
</script>