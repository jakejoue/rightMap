<template>
  <section id="rightmap">
    <!-- 头部 -->
    <header></header>
    <!-- 内容 -->
    <article>
      <!-- 左边模板图标 -->
      <aside>
        <ul>
          <li v-for="(item, index) in modules" :key="index" :title="item.title" @click="aIndex = aIndex == index ? -1 : index" :class="[aIndex==index?'select':'']">
            <img :src="item.img" :alt="item.title">
          </li>
        </ul>
      </aside>
      <!-- 地图部分 -->
      <main id="map"></main>
      <!-- form对话框 -->
      <transition name="fade">
        <div id="mform" v-show="aIndex != -1">
          <section v-for="(item, index) in modules" :key="index" v-show="aIndex == index">
            <h2>
              <span>{{item.title}}</span>
              <Icon type="android-arrow-dropleft" class="close" @click.native="aIndex=-1"></Icon>
            </h2>
            <component :is="item.module" class="module" ref="modules"></component>
          </section>
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
      aIndex: -1,
      modules: config.modules
    };
  },
  watch: {
    // 监听显示的模板，触发show和close事件
    aIndex(newV, oldV) {
      const modules = this.$refs.modules;
      oldV != -1 && modules[oldV].$emit("close");
      newV != -1 && modules[newV].$emit("show");
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
  .full;

  > * {
    width: 100%;
  }

  // 头
  header {
    .abs;
    height: @header;
    top: 0;
    z-index: -1;
    background: #add2fe data-uri("static/img/logo-right.png") repeat-x;
  }
  // 尾
  footer {
    .topline() {
      .border(top, #8db2e3);
    }

    .abs;
    .align(center);
    .bcolor(white);
    height: @footer;
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
    padding-top: @header;

    // 左侧功能点击部分
    aside {
      .full;
      .bcolor(#77b3f2);
      width: @aside;
      float: left;
      // 图标大小和样式
      ul {
        margin-top: 10px;
        li {
          cursor: pointer;
          height: 46px;
          border-radius: 2px;
          margin-bottom: 6px;
          &:hover,
          &.select {
            .border(#dedede);
            .bcolor(#8ec2fe);
          }
        }
      }
    }
    // 地图部分
    main#map {
      .full;
      float: left;
      width: calc(~"100% - @{aside}");
    }
    // 功能操作窗口部分
    div#mform {
      .abs;
      .bcolor(white);
      left: @aside;
      top: @header;
      width: @m-width;
      height: calc(~"100% - @{header}");
      padding: 15px 20px;
      section {
        .full;
        h2 {
          height: @m-title;
          span {
            color: #309bcd;
          }
          .close {
            cursor: pointer;
            float: right;
            font-size: @m-close-fontSize;
          }
        }
        .module {
          .full;
          height: calc(~"100% - (@{footer} + @{m-title})");
        }
      }
    }
    // 共同部分
    aside,
    div#mform {
      .border(right, #D7D7D7, 0.6px);
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
