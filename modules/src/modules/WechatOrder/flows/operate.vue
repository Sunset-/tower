<template>
    <div class="timeline-panel timeline-operate" :title="options.title">
        <xui-button class="operate-btn" :color="options.color||'success'" @click="submit()">{{options.operateText}}</xui-button>
        <span class="done-text">{{options.doneText}}</span>
    </div>
</template>
<script>
const $confirm = $import("dag/common/confirm");

export default {
    props: {
        order: {},
        options: {},
    },
    methods: {
        submit() {
            $confirm(`确定${this.options.operateText}？`).then(() => {
                this.$emit("submit");
            });
        },
    },
};
</script>
<style lang="less">
.timeline-operate {
    .done-text {
        display: none;
    }
}
.time-point-wrap.done {
    .timeline-operate {
        .operate-btn {
            display: none;
        }
        .done-text {
            display: block;
        }
    }
}
</style>