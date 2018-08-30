<template>
  <!-- 地图信息弹窗 -->
  <div id="kmap-popup" class="esriPopup">
    <div class="esriPopupWrapper">
      <div class="sizer">
        <div class="titlePane" unselectable="on">
          <div id="kmap-popup-title" class="title" unselectable="on">
            <!-- 标题 -->
          </div>
          <span class="titleSwitchButton" v-show="graphics.length > 1">
            <Icon type="ios-arrow-back" title="上一个" @click.native="pre"/>
            <span v-html="getNum()"></span>
            <Icon type="ios-arrow-forward" title="下一个" @click.native="next" />
          </span>
          <div id="kmap-popup-closer" title="关闭" class="titleButton close" unselectable="on" @click="restore">
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
</template>

<script>
// infoWindow
function initInfoWindow(map) {
  const mapPopup = new KMap.Popup({
    offset: [0, 0],
    container: "kmap-popup",
    closer: "kmap-popup-closer",
    title: "kmap-popup-title",
    content: "kmap-popup-content"
  });
  mapPopup.on("show", evt => {
    // 窗体切换事件
    const tab = $("#kmap-popup-title div.titleBar [InfoTag]");
    if (tab.length > 0) {
      const items = $("#kmap-popup-content [InfoTag]");
      if (items.length == tab.length) {
        tab.each(e => {
          $(tab[e]).click(() => {
            items.hide();
            $(items[e]).show();
          });
        });
        tab[0].click();
      }
    }
    // 设置窗体偏移
    const graphic = evt.target.getSelectedFeature();
    eventBus.$emit("infoWindow/show", graphic);
    if (graphic.getGeometry().getType() == "point") {
      const id = graphic.getLayer().getId();
      const offset =
        configData.infoTOffset[id] || graphic.getAttribute("offset");
      offset && evt.target.setOffset(offset);
    }
  });
  map.infoWindow = mapPopup;
  map.addOverlay(mapPopup);
}

// singleClick
function initSingleClickEvent(map) {
  //地图单击事件
  function onMapSingleClick(e) {
    const map = this;
    const pixel = e.pixel;
    map.infoWindow.hide();
    // 获取所有可以可见有infowindow的图形
    const gs = [];
    map.forEachFeatureAtPixel(pixel, function(graphic, layer) {
      if (graphic.getVisible() && layer) {
        if (graphic.getInfoTemplate() || layer.getInfoTemplate()) {
          if (!graphic.getLayer()) {
            graphic.setLayer(layer);
          }
          gs.push(graphic);
        }
      }
    });
    root.$store.commit("mapPopup/show", gs);
    // 传递点击事件
    eventBus.$emit("singleClick", e);
    // debug log
    console.log(fromMap(e.coordinate));
  }
  map.on("singleclick", onMapSingleClick, map);
}

export default {
  data() {
    return { graphicIndex: 0 };
  },
  computed: {
    graphics() {
      return this.$store.state.mapPopup.graphics;
    }
  },
  watch: {
    graphics(newV, oldV) {
      this.showGInIndex(0);
    }
  },
  methods: {
    getNum() {
      return ` ${this.graphicIndex + 1} / ${this.graphics.length} `;
    },
    pre() {
      const index = this.graphicIndex - 1;
      this.showGInIndex(index);
    },
    next() {
      const index = this.graphicIndex + 1;
      this.showGInIndex(index);
    },
    showGInIndex(index) {
      if (this.graphics[index]) {
        this.graphicIndex = index;
        centerShow({ graphic: this.graphics[index], center: false });
      }
    },
    restore() {
      this.$store.commit("mapPopup/hide");
    }
  },
  mounted() {
    initInfoWindow(map);
    initSingleClickEvent(map);
  }
};
</script>

<style lang="less" scoped>
.titleSwitchButton {
  color: black;
  font-size: 12px;
  float: right;
  padding-right: 30px;
  line-height: 18px;
  i {
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
  }
  * {
    vertical-align: middle;
  }
}
</style>
