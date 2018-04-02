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
      expand: false,
      layer: new KMap.GraphicsLayer("streetView")
    };
  },
  methods: {
    close() {
      this.show_ = false;
      this.expand = false;
      this.layer.clear();
    },
    resize() {
      let height = 0;
      this.show_ && (height = 50);
      this.expand && (height = 100);
      eventBus.$emit("resize", height);
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
    map.addGraphicsLayer(this.layer);
    eventBus.$on("streetView/show", coordinate => {
      this.layer.clear();
      coordinate = coordinate || map.getCenter();
      const { graphic } = newGraphic({
        coord: coordinate,
        symbol: new KMap.PictureMarkerSymbol({
          anchor: [0.5, 1],
          src: "./static/img/truemap.gif"
        }),
        attr: { resultID: "streetView" }
      });
      this.layer.add(graphic);
      map.setCenter(coordinate);
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
    eventBus.$on("streetView/moveCar", (lon, lat, yaw) => {
      query.project2map(lon, lat).then(result => {
        const coord = [result.x, result.y];
        let graphic = getGraphicsByName(
          "streetView",
          "resultID",
          this.layer
        )[0];
        if (graphic) {
          graphic.getGeometry().setCoordinates(coord);
          graphic.getSymbol().setAngle(yaw);
          map.setCenter(coord);
        }
      });
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
