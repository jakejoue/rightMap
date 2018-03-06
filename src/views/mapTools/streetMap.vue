<template>
  <div id="streetMap" v-show="show_" :class="expand?'full':''">
      <ul>
          <li @click="expand = !expand" :title="expand?'最小化':'全屏'">
              <Icon :type="expand?'android-contract':'android-expand'"></Icon>
          </li>
          <li title="关闭" @click="close">
              <Icon type="android-close"></Icon>
          </li>
      </ul>
      <iframe class="full" src="https://www.baidu.com" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_: false,
      expand: false
    };
  },
  methods: {
    show() {
      this.show_ = true;
    },
    close() {
      this.show_ = false;
      this.expand = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";
div#streetMap {
  height: 50%;
  &.full {
    .full;
  }
  ul {
    .abs;
    .bcolor(white);
    right: 0;
    font-size: 0;
    li {
      .border(gray);
      display: inline-block;
      padding: 7px 12px;
      font-size: 15px;
      cursor: pointer;

      &:hover {
        color: #35ac46;
        .bcolor(#EEEEEE);
      }
    }
  }
  iframe {
    width: 100%;
  }
}
</style>
