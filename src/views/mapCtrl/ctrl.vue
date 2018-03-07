<template>
  <div id="tools">
    <ul>
      <li v-for="(item, i) in config" :key="i" @click="select(item)" :title="item.title">
        <div class="full" :class="item.class"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import config from "./config";

export default {
  data: () => ({ active: -1, config, content: false }),
  methods: {
    select(item) {
      item.handler && item.handler();
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";
@import "config.less";

div#tools {
  @bcolor: #fff;
  @bdcolor: #666;
  @overcolor: #ddd;

  .abs;
  left: 15px;
  top: 25px;
  
  &.expand {
    left: @m-width + 15px;
  }

  > ul {
    .bcolor(@bcolor);
    .border(@bdcolor);
    font-size: 0;
    border-radius: 10px;

    li {
      .border(bottom, @bdcolor);
      .align(center);
      cursor: pointer;
      line-height: 100%;
      height: 31px;
      width: 32px;

      &:hover {
        .bcolor(@overcolor);
      }
      &:first-child {
        border-radius: 10px 10px 0 0;
      }
      &:last-child {
        border-bottom: none;
        border-radius: 0 0 10px 10px;
      }
    }
  }
}
</style>
