<template>
  <div class="dag-breadcrumb">
    <div class="dag-breadcrumb-wrap">
      <div class="dag-breadcrumb-click" @click="goBack()">
        <i class="iconfont iconfanhui"></i>
      </div>
      <div class="dag-breadcrumb-content">
        <span
          :class="{hover : (index<path.length-1)&&(item.name||item.operate)}"
          v-for="(item,index) in path"
          :key="index"
          @click="onClick(item,index)"
        >{{item.title}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    path: {},
    back: {}
  },
  mounted() {
    let that = this;
    $router.beforeEach(function(to, from, next) {
      if (from.name.indexOf(to.name) != -1) {
        that.path.filter(item => {
          return item.name == from.name
            ? that.path.splice(that.path.length - 1, 1)
            : item;
        });
      }
      next();
    });
  },
  methods: {
    onClick(item, index) {
      if (item.name) {
        $router.push({ name: item.name });
        this.path.splice(index + 1, this.path.length - 1 - index);
      } else if (Sunset.isFunction(item.operate)) {
        item.operate();
        this.path.splice(index + 1, this.path.length - 1 - index);
      }
    },
    goBack() {
      if (Sunset.isFunction(this.back)) {
        this.back();
      } else {
        $router.back(-1);
      }
    }
  }
};
</script>
<style lang="less">
@import "~style/variable.less";
.dag-breadcrumb {
  position: absolute;
  top: 0;
  padding: 0px 0px 0px 0px;
  font-size: 14px;
  border-radius: 2px;
  overflow: hidden;
  .dag-breadcrumb-wrap {
    background: @color-background-white;
    min-width: 200px;
    max-width: 1000px;
    height: 40px;
    line-height: 25px;
    box-shadow: 0px 0px 6px fade(#000, 15%);
    .dag-breadcrumb-click {
      float: left;
      height: 40px;
      padding-left: 15px;
      padding-right: 15px;
      line-height: 40px;
      border-right: 1px solid fade(@color-border, 30%);
      overflow: hidden;
      color: @color-primary;
      & > i {
        font-size: 20px;
      }
      &:hover {
        cursor: pointer;
        color: @color-primary-hover;
      }
      &:active {
        cursor: pointer;
        color: @color-primary-active;
      }
    }
    .dag-breadcrumb-content {
      float: left;
      height: 40px;
      line-height: 40px;
      max-width: 919px;
      margin-left: 15px;
      margin-right: 15px;
      & > span {
        vertical-align: middle;
        color: #333;
        transition: all 0.1s ease;
        &:not(:last-child):after {
          content: ">";
          display: inline-block;
          padding: 0px 8px;
          color: @color-title;
        }
        &.hover {
          cursor: pointer;
          &:hover {
            color: @color-primary;
          }
        }
      }
    }
  }
}
</style>
