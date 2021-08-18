<template>
    <div class="equipment-params-lastcmd">
        <div class="lastcmd-info">参数同步时间：{{lastExcuteTime}}</div>
        <div class="lastcmd-info">参数设置结果：{{lastExcuteResult}}</div>
    </div>
</template>
<script>
export default {
    props: {
        params: {},
        workingParams: {},
        status: {},
    },
    computed: {
        lastExcuteTime() {
            if (this.status && this.status.executeTime) {
                return Sunset.Dates.format(this.status.executeTime);
            }
            return "";
        },
        lastExcuteResult() {
            return (
                {
                    0: "未同步",
                    1: "等待设置",
                    2: "成功",
                    3: "失败",
                }[this.status && this.status.setResult] || ""
            );
        },
    },
    data() {
        return {};
    },
};
</script>
<style lang="less">
.equipment-params-lastcmd {
    padding: 10px;
    font-size: 16px;
    width: 500px;
    margin: 0px 10px 10px 10px;
    & > div {
        margin-bottom: 10px;
    }
    .lastcmd-info {
        width: 380px;
        &:after {
            content: attr(issync);
            padding-left: 10px;
        }
    }
}
</style>