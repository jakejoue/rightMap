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
    <iframe id="trueMap" class="full" src="./static/TrueMap/TME.html" frameborder="0"></iframe>
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
      clearGraphicsByName("streetView", "resultID");
    },
    resize() {
      let height = 0;
      this.show_ && (height = 50);
      this.expand && (height = 100);
      event.$emit("resize", height);
    }
  },
  watch: {
    show_() {
      this.resize();
    },
    expand() {
      this.resize();
    }
  },
  mounted() {
    event.$on("streetView/show", coordinate => {
      clearGraphicsByName("streetView", "resultID");
      coordinate = coordinate || map.getCenter();
      const { graphic } = newGraphic({
        coord: coordinate,
        symbol: new KMap.PictureMarkerSymbol({
          scale: 0.6,
          anchor: [0.5, 1],
          src: "./static/img/single_marker.png"
        }),
        attr: { resultID: "streetView" }
      });
      map.getGraphics().add(graphic);
      // 坐标转换显示街景
      const [x, y] = coordinate;
      query.project2wgs(x, y).then(function(result) {
        var point = [result.lon, result.lat];
        var truemapObj = document.getElementById("trueMap");
        if (
          truemapObj !== undefined &&
          truemapObj !== null &&
          truemapObj.contentWindow.showVisionByLngLat !== undefined &&
          truemapObj.contentWindow.showVisionByLngLat !== null &&
          $.isFunction(truemapObj.contentWindow.showVisionByLngLat)
        ) {
          try {
            truemapObj.contentWindow.showVisionByLngLat(point[0], point[1]);
          } catch (e) {
            console.log(e);
          }
        }
      });
      this.show_ = true;
    });
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
