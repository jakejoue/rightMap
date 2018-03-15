<script>
import infoTemplate from "t/comp";
import mix from "./mixns/mix";

// 查询结果样式
const lineSymbol = new KMap.SimpleLineSymbol({
  stroke: [147, 112, 219],
  width: 4
});
const fillSymbol = new KMap.SimpleFillSymbol({
  stroke: lineSymbol,
  fill: [0, 229, 238, 0.5]
});
const markSymbol = new KMap.SimpleMarkerSymbol({
  anchor: undefined,
  opacity: undefined,
  radius: 8,
  offset: undefined,
  fill: [0, 229, 238, 0.5],
  stroke: [147, 112, 219],
  width: 1
});

export default {
  moduleName: "comp",
  layerId: "comp",
  mixins: [mix],
  data() {
    return {
      hasResult: false,
      placeholder: "请输入部件编码",
      treeCheckable: true,
      wmsLayer: null,
      infoTemplate,
      field: "name"
    };
  },
  methods: {
    async search(value) {
      this.layer.clear();
      map.infoWindow.hide();
      const { total, items } = await query.queryComp(value, 0, 1);
      if (total == 0) {
        this.$Message.info("没有查询到任何结果");
      } else {
        const geometry = KMap.Geometry.fromWKT(items[0].geo);
        const g = new KMap.Graphic();
        g.setGeometry(geometry);
        g.setAttributes(items[0].attrs);
        switch (geometry.getType()) {
          case "point":
            g.setSymbol(markSymbol);
            break;
          case "polyline":
            g.setSymbol(lineSymbol);
            break;
          case "polygon":
            g.setSymbol(fillSymbol);
            break;
        }
        this.layer.add(g);
        centerShow({ graphic: g, zoom: configData.maxZoom });
      }
    },
    reset() {},
    getResT(data) {
      return (
        <div>
          <p>{data.name}</p>
          <p>{data.description}</p>
        </div>
      );
    },
    treeCheck(data, filter) {
      const layers = filter("layer");
      this.wmsLayer.updateParams({
        LAYERS: layers.join(",")
      });
      this.wmsLayer.setVisible(!!layers.length);
      this.$store.dispatch(`event/${layers.length ? "on" : "un"}`, {
        type: "singleClick",
        handler: this.clickHandler
      });
    },
    // 单击地图查询元素事件
    async clickHandler({ coordinate }) {
      this.layer.clear();
      var resolution = map.getResolution();
      var projection = configData.projection;
      var params = { INFO_FORMAT: "application/json" };
      var url = this.wmsLayer.getFeatureInfoUrl(
        coordinate,
        resolution,
        projection,
        params
      );
      const { data } = await axios.get(url);
      const graphics = KMap.Graphics.fromGeoJSON(data);
      if (graphics.length) {
        this.layer.add(graphics[0]);
        centerShow({
          center: false,
          graphic: graphics[0]
        });
      }
    }
  },
  async mounted() {
    // 初始化图层
    const mapInfo = await query.getLayersInfo();
    this.wmsLayer = new KMap.WMSLayer("comp", {
      format: "image/png",
      layers: "",
      url: configData.geoServerUrl + "/" + mapInfo.compmap + "/wms",
      srs: configData.projection,
      projection: configData.projection
    });
    this.wmsLayer.setVisible(false);
    map.addDynamicLayer(this.wmsLayer);
    // 初始化树
    const data = await query.getComplayerInfo();
    this.treeData = data.items.map(e => ({
      name: e.name,
      children: e.layers.map(a =>
        Object.assign(a, {
          icon: `static/img/comp/${a.symbol}`
        })
      )
    }));
  }
};
</script>

<style lang="less" scoped>

</style>
