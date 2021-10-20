<template>
    <div class="home-data-card">
        <div class="card-title">
            <span v-if="closeable">项目信息</span>
            <i
                v-if="closeable"
                class="xui-icon xui-icon-close card-closer"
                @click="$emit('close')"
            ></i>
        </div>
        <div class="card-content">
            <div
                v-for="l in labels"
                :key="l.label"
                class="card-channel-data"
                :title="l.label"
                :style="l.line ? 'width:100%;' : ''"
            >
                <div>
                    <div class="channel-label">{{ l.label }}：</div>
                    <div class="channel-value">
                        <span
                            v-if="l.operate"
                            class="channel-operate"
                            @click="l.operate()"
                            >{{ renderCell(l) }}</span
                        >
                        <span v-if="!l.operate">{{ renderCell(l) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const $tools = $import("dag/common/tools");
const $dictionary = $import("dag/common/dictionary");

var CHANNEL_NAME = [];

export default {
    props: {
        data: {},
        closeable: {},
    },
    data() {
        return {
            labels: [
                {
                    label: "项目名称",
                    name: "projectName",
                    value: "",
                },
                {
                    label: "项目地址",
                    name: "address",
                },
                {
                    label: "开工时间",
                    name: "startTime",
                    date: true,
                },
                {
                    label: "完工时间",
                    name: "endTime",
                    date: true,
                },
                {
                    label: "产权单位",
                    name: "propertyRightParty",
                },
                {
                    label: "建设单位",
                    name: "buildParty",
                },
                {
                    label: "所属安全站",
                    line: true,
                    name: "safetyStation",
                },
                {
                    label: "操作",
                    line: true,
                    name: "",
                    value: "查看详情",
                    operate: () => {
                        this.$router.push({
                            name: "RealtimeDataView",
                            query: {
                                id: this.data.projectId,
                            },
                        });
                    },
                },
            ],
        };
    },
    methods: {
        renderCell(l) {
            if (l.operate) {
                return l.value;
            }
            var v = Sunset.getAttribute(this.data, l.name);
            if (v === void 0 || v === null) {
                return "-";
            }
            if (l.date) {
                return Sunset.Dates.format(v, "yyyy-MM-dd");
            }
            return v;
        },
    },
};
</script>
<style lang="less">
@import "~style/variable.less";
.home-data-card {
    margin: 5px;
    width: 500px;
    background: #f3f3f3;
    border-radius: 10px;
    padding: 0px 10px;
    color: #555;
    .card-title {
        position: relative;
        padding: 10px 0px;
        border-bottom: 1px solid #d2d2d2;
        font-size: 16px;
    }
    .card-closer {
        position: absolute;
        top: 7px;
        right: 2px;
        cursor: pointer;
        &:hover {
            color: #aaa;
        }
    }
    .card-content {
        overflow-y: auto;
        padding: 10px;
        font-size: 0px;
        .card-channel-data {
            display: inline-block;
            width: 50%;
            font-size: 16px;
            padding: 5px 0px;
            & > div {
                display: flex;
                flex-direction: row;
                .channel-label {
                    word-break: keep-all;
                }
                .channel-value {
                    word-break: break-all;
                    flex-grow: 1;
                    padding-right: 10px;
                }
                .channel-operate {
                    color: @color-primary;
                    cursor: pointer;
                    &:hover {
                        color: @color-primary-hover;
                    }
                }
            }
        }
    }
    .card-foot {
        padding: 10px 0px;
        border-top: 1px solid #d2d2d2;
    }
}
</style>