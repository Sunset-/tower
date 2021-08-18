<template>
    <div :style="style">
    </div>
</template>
<script>
export default {
    props: {
        width: {}
    },
    computed: {
        style() {
            var w = this.width || 40;
            var scale = w / 40;
            return `-webkit-transform: scale(${scale});transform: scale(${scale});display:inline-block;font-size:20px;width:20px;`;
        }
    }
};
</script>
<style lang="less">
@logo-container-width : 40px;
@logo-box-width : @logo-container-width - 13px;
@logo-border-width : @logo-box-width / 5;
@logo-space-margin : @logo-box-width / 4;
@logo-space-width :  @logo-border-width * 3 /4;
@point1-width :  @logo-border-width + 2px;
@point1-height :  @logo-border-width - 2px;
@logo-box-sqrt : @logo-box-width / sin(45deg) - @logo-border-width - 3px;
.dag2-logo {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: @logo-container-width;
    height: @logo-container-width;
    padding: 12px;
    font-size: 0px;
    transform-origin: center top;
    & > div {
        position: relative;
        width: @logo-box-width;
        height: @logo-box-width;
        border: @logo-border-width solid #fff;
        transform: rotate(45deg);
        &:before {
            position: absolute;
            content: "";
            width: @logo-space-width;
            height: @logo-border-width;
            top: -@logo-border-width;
            left: @logo-space-margin;
            background: #000;
        }
        &:after {
            position: absolute;
            content: "";
            width: @logo-space-width;
            height: @logo-border-width;
            bottom: -@logo-border-width;
            right: @logo-space-margin;
            background: #000;
        }
        @keyframes logo-line {
            0% {
                transform: scaleY(0);
            }
            20% {
                transform: scaleY(0);
            }
            35% {
                transform: scaleY(1);
            }
            50% {
                transform: scaleY(1);
            }
            65% {
                transform: scaleY(0);
            }
            100% {
                transform: scaleY(0);
            }
        }
        @keyframes logo-point1 {
            0% {
                opacity: 0;
                transform: translateY(0);
            }
            20% {
                opacity: 0;
                transform: translateY(0);
            }
            25% {
                opacity: 1;
            }
            35% {
                transform: translateY(@logo-box-width / 2 - 1px);
            }
            40% {
                transform: translateY(@logo-box-width / 2 - 1px);
            }
            50% {
                transform: translateY(@logo-box-width + 2px);
            }
            80% {
                transform: translateY(@logo-box-width + 2px);
            }
            100% {
                transform: translateY(@logo-box-width + 2px);
            }
        }
        @keyframes logo-point2 {
            0% {
            }
            20% {
            }
            35% {
            }
            50% {
                transform: translate(0px, 0px);
            }
            65% {
                transform: translate(@logo-box-sqrt, -@logo-box-sqrt);
            }
            100% {
                transform: translate(@logo-box-sqrt, -@logo-box-sqrt);
            }
        }

        .logo-line {
            position: absolute;
            top: -1px;
            width: @logo-border-width;
            height: @logo-box-width / 2;
            background: #fff;
            left: @logo-space-margin+ @logo-space-width;
            transform: scaleY(0);
            transform-origin: center top;
            animation: logo-line 4s ease-out 0s infinite;
        }
        .logo-point1 {
            position: absolute;
            top: -1px;
            left: @logo-space-margin + @logo-space-width -
                (@point1-width - @logo-border-width)/2;
            width: @point1-width;
            height: @point1-height;
            background: #fff;
            animation: logo-point1 4s ease-out 0s infinite;
        }
        .logo-point2 {
            position: absolute;
            bottom: -@logo-border-width + 1px;
            left: -@logo-border-width + 1px;
            width: @logo-border-width;
            height: @logo-border-width;
            background: #fff;
            transform: rotate(45deg);
            animation: logo-point2 4s ease-out 0s infinite;
        }
    }
}
</style>
