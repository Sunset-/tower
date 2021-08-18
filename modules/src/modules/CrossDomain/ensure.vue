<template>
    <div :class="['timeline-panel wechat-order-ensure',status]" title="收款确认">
        <div class="info-group">
            <xui-button class="u-m-t-10 u-m-l-30 product-order-submit" color="primary" @click="reject()">回复意见
            </xui-button>
        </div>
        <div class="order-reject-info">
            <xui-textarea class="input-area" :options="{}" v-model="rejectMsg" placeholder="请输入反馈意见..."></xui-textarea>
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
import Store from "./store";
const $tip = $import("dag/common/tip");
const $confirm = $import("dag/common/confirm");

export default {
    props: {
        order: {},
        status: "",
        text: "",
    },
    data() {
        return {
            images: [],
            description: "请下载收款确认书，打印签字并邮寄。",
            rejectMsg: "",
        };
    },
    computed: {
        transactions() {
            return (
                (this.order.files &&
                    this.order.files.filter(
                        (item) => item.category == "收款确认书"
                    )) ||
                []
            );
        },
        rejectMessages() {
            return (
                (this.order.$message && this.order.$message["反馈意见"]) || []
            );
        },
    },
    methods: {
        thumbnail(img) {
            return img.path.endsWith(".pdf") || img.path.endsWith(".PDF")
                ? "/proxy-img/static/pdf_icon.jpg"
                : `/proxy-img/thumbnail_file/${img.path}`;
        },
        defaultImg(src) {
            return `this.src="/proxy-img/${src}";this.onerror=null`;
        },
        download() {
            $business.Download(this.transactions[0]);
        },
        isMe(userId) {
            return userId == "admin";
        },
        reject() {
            var msg = this.rejectMsg.trim();
            if (!msg) {
                $tip("请输入回复意见", "info");
                return;
            }
            $confirm(`确定提交回复意见？`).then(() => {
                Store.submitMessage({
                    category: "反馈意见",
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
            uni.showModal({
                title: "提示",
                content: "文书确认无误，确定提交立案？",
                success: (res) => {
                    this.$emit("submit");
                },
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