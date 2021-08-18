<template>
    <div :class="['timeline-panel wechat-order-ensure',status]" :title="options.title">
        <div class="info-group">
            <div style="font-weight:bold;padding-bottom:5px;">上传签约资料模板</div>
            <div>
                <div class="timepanel-toolbar">
                    <xui-file ref="uploader" :options="uploadOptions" :ctx="{category : '签约资料模板'}" @success="uploadSuccess">
                    </xui-file>
                    <xui-button color="danger" size="mini" @click="removeImgs()">删除</xui-button>
                </div>
                <div class="customer-img" v-for="img in images" :key="img.id">
                    <i :class="['img-checker xui-icon xui-icon-success_fill',selectImgs[img.id]?'active':'']" number="✔" @click="activeImage(img.id)" class="">
                    </i>
                    <span v-if="img.used" class="file-used"></span>
                    <img :src="thumbnail(img)" :onerror="defaultImg(img.path)" @click="viewImage(img,images)" :title="img.name">
                    <div class="img-label" :title="img.name">{{img.name}}</div>
                </div>
            </div>
        </div>
        <div class="info-group">
            <div style="font-weight:bold;padding-bottom:5px;">已签收材料</div>
            <div>
                <div v-for="f in receiveFiles" :key="f.name" :class="[f.finish?'color-primary':'color-danger']" style="padding:3px 0px;">
                    {{f.name}} : {{f.count}}
                </div>
            </div>
        </div>
        <div class="info-group">
            <xui-button class="u-m-t-10 u-m-l-30 product-order-submit" color="primary" @click="reject()">{{options.replayText}}
            </xui-button>
            <xui-button v-show="status=='current'&&options.ensureText" class="operate-btn" color="success" @click="submit()">{{options.ensureText}}</xui-button>
        </div>
        <div class="order-reject-info">
            <xui-textarea class="input-area" :options="{}" v-model="rejectMsg" :placeholder="`请输入${options.replayText}...`"></xui-textarea>
        </div>
        <div class="order-reject-msgs">
            <div class="order-reject-msg" v-for="msg in rejectMessages" :key="msg.id">
                <div class="msg-who">
                    {{isMe(msg.userId)?'我':'客户'}}&nbsp;&nbsp;{{msg.time | time}}
                </div>
                <div :class="['reply',isMe(msg.userId)?'':'platform-reply']">
                    {{msg.content}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Store from "../store";
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");
const FileManage = $import("dag/modules/File");

var NEED_FILES = [
    {
        name: "委托代理合同",
        count: 2,
    },
    {
        name: "授权委托书",
        count: 5,
    },
    {
        name: "民事起诉状签字页",
        count: 4,
    },
    {
        name: "收款账户",
        count: 1,
    },
    {
        name: "公证书",
        count: 1,
    },
    {
        name: "证券账户信息",
        count: 1,
    },
    {
        name: "证券交易记录",
        count: 0,
    },
    {
        name: "身份证复印件",
        count: 3,
    },
];

export default {
    props: {
        order: {},
        options: {},
        status: "",
        category: "",
    },
    data() {
        return {
            rejectMsg: "",
            selectImgs: {},
            uploadOptions: {
                label: this.options.uploadText || "上传",
                size: "mini",
                color: "primary",
                multiple: true,
                directory: false,
                disabled: false,
                method: "post",
                filename: "file",
                thumbnail: true,
                wait: false,
                max: 10,
                drop: true,
                url: "/cloud-api/file/upload",
                className: "my-uploader-trigger",
                filter(f) {
                    return true;
                },
                headers: {},
                formData: (ctx) => {
                    return {
                        ownerId: this.order.id,
                        dirType: "wechat_file",
                        dir: `order_${this.order.id}`,
                        category: ctx.category,
                    };
                },
                progress(v) {
                    console.log(v);
                },
            },
        };
    },
    computed: {
        rejectMessages() {
            return (
                (this.order.$message &&
                    this.order.$message[this.options.category]) ||
                []
            );
        },
        receiveFiles() {
            var f = (this.order.$message &&
                this.order.$message["CUSTOMER_FILES"] &&
                this.order.$message["CUSTOMER_FILES"][0]) || { content: "{}" };
            var files = JSON.parse(f.content);
            return NEED_FILES.map((item) => {
                return {
                    name: item.name,
                    count:
                        item.count == 0
                            ? `${files[item.name] || 0}`
                            : `${Math.min(files[item.name] || 0, item.count)}/${
                                  item.count
                              }`,
                    finish: (files[item.name] || 0) >= item.count,
                };
            });
        },
        images() {
            return (
                (this.order &&
                    this.order.files &&
                    this.order.files.filter(
                        (item) => item.category == "签约资料模板"
                    )) ||
                []
            );
        },
    },
    methods: {
        isMe(userId) {
            return userId == "admin";
        },
        reject() {
            var msg = this.rejectMsg.trim();
            if (!msg) {
                $tip(`请输入${this.options.replayText}`, "info");
                return;
            }
            $confirm(`确定${this.options.replayText}？`).then(() => {
                Store.submitMessage({
                    category: this.options.category,
                    orderId: this.order.id,
                    userId: "admin",
                    content: msg,
                }).then(() => {
                    this.rejectMsg = "";
                    this.$emit("refresh");
                });
            });
        },
        submit() {
            $confirm(`${this.options.ensureText}？`).then(() => {
                this.$emit("submit");
            });
        },
        uploadSuccess() {
            this.$emit("refresh");
        },
        thumbnail(img) {
            var path = img.path.toLowerCase();
            if (path.endsWith(".docx") || path.endsWith(".doc")) {
                return "/images/icon/doc_icon.jpg";
            } else if (path.endsWith(".pdf")) {
                return "/images/icon/pdf_icon.jpg";
            } else {
                return `/cloud-img/thumbnail_file/${img.path}`;
            }
        },
        defaultImg(src) {
            return `this.src="/cloud-img/${src}";this.onerror=null`;
        },
        viewImage(...args) {
            this.$emit.call(this, "viewImage", ...args);
        },
        activeImage(id, flag) {
            var f;
            if (flag === true || flag === false) {
                f = flag;
            } else {
                f = !this.selectImgs[id];
            }
            if (f) {
                Vue.set(this.selectImgs, id, f);
            } else {
                Vue.delete(this.selectImgs, id, f);
            }
        },
        uploadSuccess() {
            this.$emit("refresh");
        },
        removeImgs() {
            var ids = Object.keys(this.selectImgs);
            if (ids.length == 0) {
                return;
            }
            $confirm(`确定删除选定的${ids.length}个文件？`).then(() => {
                FileManage.RemoveCloudFile(ids).then((res) => {
                    $tip("删除成功", "success");
                    this.$emit("refresh");
                });
            });
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";

.wechat-order-ensure {
    .order-reject-info {
        padding: 5upx 10upx;
        border-radius: 3px;
        margin-bottom: 30upx;
        margin-top: 10upx;
        textarea {
            font-size: 14px;
            height: 150upx;
        }
    }
    &.done {
        .info-current {
            display: none;
        }
        .info-done {
            display: block;
        }
    }
    &.current {
        .info-current {
            display: block;
        }
        .info-done {
            display: none;
        }
    }
    .transaction-img {
        width: 220upx;
        margin-bottom: 10upx;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 5upx;
        font-size: 0px;
        .identcode-image {
            width: 100%;
            height: auto;
            color: red;
            img {
                opacity: 1;
            }
        }
        .img-label {
            text-align: center;
        }
    }
    .info-wrap {
        .info-title {
            font-size: 16px;
            font-weight: bold;
            padding: 0px 0px 10px 0px;
        }
        .info-item {
            padding: 5px 0px;
        }
    }

    .timepanel-toolbar {
        & > * {
            vertical-align: top;
            margin-right: 10px;
        }
    }
    .order-reject-msgs {
        padding-top: 10px;
        .order-reject-msg {
            padding-bottom: 5px;
            .msg-who {
                font-size: 12px;
                color: #888;
            }
            .reply {
                color: #fa3534;
                padding: 5px 0px;
                &.platform-reply {
                    color: @color-primary;
                }
            }
        }
    }
}
</style>