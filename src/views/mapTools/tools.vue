<template>
  <div id="tools" class="unselectable">
      <ul>
          <li v-for="(item, i) in config" :key="item.id"
            @click="select(i)"
            :class="[item.select ? (active == i ? 'select' : '') : '']"
            :title="item.title">
            <img :src="item.img">
          </li>
      </ul>
      <section>
        <component v-for="(item, i) in config"
          class="content"
          :key="i"
          :is="item.component"
          :ref="item.id"
          v-show="i == content">
        </component>
      </section>
  </div>
</template>

<script>
import config from "./config";

export default {
  data: () => ({ active: -1, config, content: -1 }),
  methods: {
    select(newV, oldV = this.active) {
      const newItem = this.config[newV];
      const oldItem = this.config[oldV];

      this.active = -1;
      oldItem && oldItem.handler && oldItem.handler({
        type: false,
        target: this
      });

      if (newV != oldV) {
        this.active = newV;
        this.$refs[newItem.id] && (this.content = this.content == newV ? -1 : newV);
        newItem.handler && newItem.handler({
          type: true,
          target: this
        });
      }else {
        this.$refs[newItem.id] && (this.content = -1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";

div#tools {
  @bcolor: #f5f6f7;
  @bdcolor: #dfe0e0;
  @overcolor: #52bff7;
  @lcolor: #35ac46;

  .abs;
  right: 0;
  > ul {
    .border(bottom, @bdcolor);
    .border(left, @bdcolor);
    .bcolor(@bcolor);
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
    border-bottom-left-radius: 10px;
    font-size: 0;
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
    .abs;
    .bcolor(@bcolor);
    .border(@lcolor);
    right: 0;
    font-size: 15px;
    border-radius: 10px 0 0 10px;
    > .content {
      padding: 5px;
    }
  }
}
</style>
