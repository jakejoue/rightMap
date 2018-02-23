<template>
  <div id="rightmap">
      <!-- 头部 -->
      <div class="head"></div>
      <!-- 内容 -->
      <div class="content">
        <!-- 左边模板图标 -->
        <aside class="modules">
          <ul><li
            v-for="(item, index) in modules"
            :key="index"
            :title="item.title"
            @click="switchmf(index)">
          </li></ul>
        </aside>
        <!-- 地图部分 -->
        <div id="map"></div>
        <!-- form对话框 -->
        <transition name="fade">
          <div class="mform" v-show="aIndex != -1">
            <component
              v-for="(item, index) in modules"
              :key="index"
              :is="item.module"
              v-show="aIndex == index"
              class="module">
            </component>
          </div>
        </transition>
      </div>
      <!-- 底部 -->
      <div class="foot">
          所属权为个人所有
      </div>
  </div>
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

div {
  .border-box;
}

#rightmap {
  .full;

  .abs {
    position: absolute;
  }

  div {
    width: 100%;
    @blue: blue;
    @head-color: @blue;
    @foot-color: @blue + 150;
    @aside-color: @blue + 100;

    @top: 30px;
    @left: 40px;
    @bottom: 20px;
    // 头
    &.head {
      .abs;
      top: 0;
      height: @top;
      .bcolor(@head-color);
    }
    // 尾
    &.foot {
      .abs;
      bottom: 0;
      height: @bottom;
      .align(center);
      .bcolor(@foot-color);
    }
    // 内容部分
    &.content {
      .full;
      padding-top: @top;
      // 左侧功能点击部分
      aside.modules {
        .full;
        .bcolor(@aside-color);
        width: @left;
        float: left;
        // 图标大小和样式
        ul {
          .full;
          list-style-type: none;
          li {
            height: @left;
            width: @left;
            cursor: pointer;
            margin-bottom: 3px;
            .bcolor(color("black"));
          }
        }
      }
      // 地图部分
      div#map {
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
}
</style>
