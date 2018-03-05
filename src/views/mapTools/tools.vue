<template>
  <div id="tools">
      <ul>
          <li v-for="(item, i) in config" :key="i"
            @click="select(i)"
            :class="[item.select ? (active == i ? 'select' : '') : '']"
            :title="item.title">
            <img :src="item.img">
          </li>
      </ul><br>
      <section v-show="content">
        <component v-for="(item, i) in config"
          :key="i"
          :is="item.component"
          :ref="item.title"
          v-show="active == i">
        </component>
      </section>
  </div>
</template>

<script>
import config from "./config";

export default {
  data: () => ({ active: -1, config, content: false }),
  methods: {
    select(newV, oldV = this.active) {
      const newItem = this.config[newV];
      const oldItem = this.config[oldV];

      this.active = -1;
      this.content = false;
      oldItem && oldItem.handler && oldItem.handler({
        type: false,
        target: this
      });

      if (newV != oldV) {
        this.active = newV;
        this.$refs[newItem.title] && (this.content = true);
        newItem.handler && newItem.handler({
          type: true,
          target: this
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";
@import "config.less";

div#tools {
  @bcolor: #f5f6f7;
  @bdcolor: #dfe0e0;
  @overcolor: #52bff7;
  @lcolor: #35ac46;

  .abs;
  top: @header;
  right: 0;
  > ul {
    .border(bottom, @bdcolor);
    .border(left, @bdcolor);
    .bcolor(@bcolor);
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
    border-bottom-left-radius: 10px;
    font-size: 0;
    float: right;
    li {
      .border(left, @overcolor);
      cursor: pointer;
      padding: 10px;
      display: inline-block;
      line-height: 100%;

      &:hover,
      &.select {
        .bcolor(@overcolor);
      }
      &.select {
        border-right: solid;
        border-color: @lcolor;
        border-width: 1.2px;
      }
      &:first-child {
        border-left: none;
        border-bottom-left-radius: 10px;
      }
      &:last-child {
        border-right: none;
      }
      img {
        size: 16px 16px;
      }
    }
  }
  > section {
    .bcolor(@bcolor);
    .border(@lcolor);
    float: right;
    padding: 5px;
    font-size: 15px;
    border-radius: 10px 0 0 10px;
  }
}
</style>
