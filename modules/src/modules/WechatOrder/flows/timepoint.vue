<template>
    <div :class="['time-point-wrap',status,end?'time-point-end':'']">
        <div class="time-point-title">
            {{title}}
            <div v-if="time>0" class="time-point-time">{{time | time}}</div>
        </div>
        <div class="time-point-line"></div>
        <div class="time-point-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: "",
        status: "",
        time: "",
        end: "",
    },
};
</script>
<style lang="less">
@import "~style/variable.less";

.time-point-wrap {
    position: relative;
    padding-bottom: 30px;
    margin-left: 120px;
    display: none;
    .time-point-title {
        width: 80px;
        text-align: center;
        padding: 8px 10px;
        border-radius: 3px;
        background: #ababab;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;
        vertical-align: top;
        position: relative;
        z-index: 1;
        &:before {
            content: "";
            position: absolute;
            left: 100%;
            top: 48%;
            width: 120px;
            border-top: 2px dashed #ababab;
            display: none;
        }
        .time-point-time {
            position: absolute;
            right: 110%;
            font-size: 12px;
            color: #454545;
            white-space: nowrap;
            top: 35%;
        }
    }
    .time-point-line {
        content: "";
        position: absolute;
        left: 48px;
        top: 0;
        z-index: 0;
        height: 100%;
        border-left: 5px solid #dedede;
    }

    .time-point-content {
        vertical-align: top;
        margin-left: 120px;
        display: none;
    }
    &.current.time-point-end {
        .time-point-title {
            background: @color-success;
            &:before {
                display: none;
            }
        }
    }
    &.done {
        display: block;
        .time-point-title {
            background: #127bfe;
            &:before {
                display: block;
            }
        }
        .time-point-line {
            border-color: #127bfe;
        }
        .time-point-content {
            display: inline-block;
        }
        .info-done {
            display: block;
        }
    }
    &.current {
        display: block;
        .time-point-title {
            background: orangered;
            &:before {
                display: block;
            }
        }
        .time-point-line {
            border-color: #127bfe;
        }
        .time-point-content {
            display: inline-block;
        }
        .info-current {
            display: block;
        }
    }
    .info-done,
    .info-current {
        display: none;
    }
}
</style>