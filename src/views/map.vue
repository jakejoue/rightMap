<template>
  <section id="rightmap">
    <!-- 头部 -->
    <header></header>
    <!-- 内容 -->
    <article>
      <!-- 左边模板图标 -->
      <aside>
        <ul>
          <li v-for="(item, index) in modules" :key="index" :title="item.title" @click="switchmf(index)"></li>
        </ul>
      </aside>
      <!-- 地图部分 -->
      <main id="map"></main>
      <!-- form对话框 -->
      <transition name="fade">
        <div class="mform" v-show="aIndex != -1">
          <component v-for="(item, index) in modules" :key="index" :is="item.module" v-show="aIndex == index" class="module"></component>
        </div>
      </transition>
    </article>
    <!-- 底部 -->
    <footer>
      <div></div>
      <p>所属权为个人所有</p>
    </footer>
  </section>
</template>

<script>
import config from "./modules/";

export default {
  data() {
    return {
      modules: config.modules,
      mform: false,
      aIndex: -1
    };
  },
  methods: {
    switchmf(index) {
      this.aIndex = this.aIndex == index ? -1 : index;
    }
  },
  mounted() {
    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      target: "map",
      controls: [],
      view: new ol.View({
        center: [0, 0],
        zoom: 3,
        minZoom: 3
      })
    });
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";

#rightmap {
  .abs() {
    position: absolute;
  }

  .full;
  & > * {
    width: 100%;
  }
  @top: 34px;
  @left: 45px;
  @bottom: 25px;

  // 头
  header {
    .abs;
    top: 0;
    height: @top;
    background: #add2fe data-uri("static/img/logo-right.png") repeat-x;
    z-index: -1;
  }
  // 尾
  footer {
    .topline() {
      .border(top, #8db2e3);
    }

    .abs;
    .align(center);
    .bcolor(white);
    height: @bottom;
    bottom: 0;

    div {
      .topline;
      .bcolor(#D2E0F2);
      height: 5px;
    }
    p {
      .topline;
      color: #0c5eac;
    }
  }
  // 内容部分
  article {
    .full;
    padding-top: @top;
    // 左侧功能点击部分
    aside {
      .full;
      .bcolor(#77b3f2);
      width: @left;
      float: left;
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
      border-right: 0.6px solid #d7d7d7;
      // 图标大小和样式
      ul {
        margin-top: 10px;
        li {
          .bcolor(color("black"));
          height: @left;
          width: @left;
          cursor: pointer;
          margin-bottom: 6px;
        }
      }
    }
    // 地图部分
    main#map {
      .full;
      float: left;
      width: calc(~"100% - @{left}");
    }
    // 功能操作窗口部分
    div.mform {
      .abs;
      .bcolor(white);
      left: @left;
      top: @top;
      width: 300px;
      height: calc(~"100% - @{top}");
      padding: 10px;
      .module {
        .full;
      }
    }
  }
}
</style>
