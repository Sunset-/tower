<template>
    <div class="timeline-panel timeline-operate" :title="title">
        <xui-button class="operate-btn" :color="color" @click="submit()">{{text}}</xui-button>
        <span class="done-text">{{doneText}}</span>
    </div>
</template>
<script>

const $confirm = $import("dag/common/confirm");

export default {
    props: {
        order: {},
        title: "",
        text: "",
        doneText :"",
        color: "",
    },
    methods: {
        submit() {
            $confirm(`确定${this.text}？`).then(() => {
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