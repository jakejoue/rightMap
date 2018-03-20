<template>
  <div id="mapBase">
    <span v-for="(item, i) in config" :key="i" :class="[active==i?'select':'']">
      <img :src="item.img" @click="switchBaseMap(i)">
      <p>{{item.title}}</p>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: [
        { img: "./static/img/cn_canvas.jpg", title: "矢量" },
        { img: "./static/img/tempimagery.jpg", title: "影像" }
      ],
      active: 0
    };
  },
  methods: {
    switchBaseMap(i) {
      if (this.active != i) {
        this.active = i;
        baseMap.setVisible(this.active == 0);
        imageMap.setVisible(this.active == 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";

div#mapBase {
  padding: 0 2px;
  font-size: 13.6px;
  > span {
    margin: 6px;
    display: inline-block;
    p {
      text-align: center;
    }
    img {
      cursor: pointer;
      width: 110px;
      vertical-align: bottom;
    }
    &.select {
      p {
        .bcolor(#B9E0F7);
      }
      img {
        .border(#0b7ac0, 3px);
      }
    }
  }
}
</style>
