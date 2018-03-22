<template>
  <section id="rightmap">
    <!-- 头部 -->
    <header v-if="!noHeader"></header>
    <!-- 内容 -->
    <article :class="[noHeader?'noHeader':'',noAside?'noAside':'']">
      <!-- 左边模板图标 -->
      <aside v-if="!noAside">
        <ul v-if="map">
          <li v-for="(item, index) in modules" :key="index" :title="item.title" @click="aIndex = aIndex == index ? -1 : index" :class="[aIndex==index?'select':'']">
            <img :src="item.img" :alt="item.title">
          </li>
        </ul>
      </aside>
      <!-- 地图部分 -->
      <main id="kmap">
        <street-map v-if="map" ref="streetMap"></street-map>
        <div id="mapTarget" :style="{'height':height+'%'}">
          <m-ctrl v-if="map" :class="aIndex==-1?'':'expand'"></m-ctrl>
          <m-tools v-if="map"></m-tools>
          <!-- 地图信息弹窗 -->
          <div id="kmap-popup" class="esriPopup">
            <div class="esriPopupWrapper">
              <div class="sizer">
                <div class="titlePane" unselectable="on">
                  <div id="kmap-popup-title" class="title" unselectable="on">
                    <!-- 标题 -->
                  </div>
                  <div id="kmap-popup-closer" title="关闭" class="titleButton close" unselectable="on">
                    <!-- 关闭按钮 -->
                  </div>
                </div>
              </div>
              <div class="sizer content">
                <div id="kmap-popup-content" class="contentPane">
                  <!-- 内容 -->
                </div>
              </div>
              <div class="pointer bottom">
              </div>
            </div>
          </div>
          <c-track></c-track>
        </div>
      </main>
      <!-- form对话框 -->
      <transition name="fade">
        <div id="mform" v-show="aIndex != -1" v-if="map&&!noAside">
          <section v-for="(item, index) in modules" :key="index" v-show="aIndex == index">
            <h2 class="title">
              <big>{{item.title}}</big>
              <Icon type="android-arrow-dropleft" class="close" @click.native="aIndex=-1"></Icon>
            </h2>
            <component :is="item.module" class="module" ref="modules"></component>
          </section>
        </div>
      </transition>
    </article>
    <!-- 底部 -->
    <footer v-if="!noFooter">
      <div></div>
      <p>所属权为个人所有</p>
    </footer>
  </section>
</template>

<script>
import mTools from "./mapTools/";
import streetMap from "./mapTools/streetMap";
import mCtrl from "./mapCtrl";
import cTrack from "./track";

import init from "assets/js/init";
import getModules from "./modules/";

export default {
  components: { mTools, mCtrl, streetMap, cTrack },
  mixins: [init],
  data() {
    return {
      height: 100,
      noHeader: false,
      noAside: false,
      noFooter: false,
      aIndex: -1,
      modules: getModules()
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
    this.$store.dispatch("event/on", {
      type: "resize",
      handler: height => {
        this.height = 100 - height;
        this.$nextTick(function() {
          this.map.updateSize();
        });
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "basic.less";
@import "config.less";

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
    background: #add2fe url("@{path}/logo-right.png") repeat-x;
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
    &.noHeader {
      padding-top: 0px;
    }
    &.noAside {
      main#kmap {
        width: 100%;
      }
    }
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
    main#kmap {
      .full;
      float: left;
      width: calc(~"100% - @{aside}");
      div#mapTarget {
        .full;
        position: relative;
        > div {
          z-index: 1;
        }
      }
    }
    // 功能操作窗口部分
    div#mform {
      .abs;
      .bcolor(white);
      left: @aside;
      top: @header;
      width: @m-width;
      height: calc(~"100% - @{header}");
      padding: @m-padding;
      section {
        .full;
        // 菜单栏
        h2.title {
          height: @m-title;
          big {
            color: #309bcd;
          }
          .close {
            cursor: pointer;
            float: right;
            font-size: @m-close-fontSize;
          }
        }
        // 具体的组件操作部分
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
