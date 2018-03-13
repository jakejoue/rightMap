<script>
import infoTemplate from "t/comp";
import mix from "./mix";

export default {
  moduleName: "comp",
  mixins: [mix],
  data() {
    return {
      placeholder: "请输入部件编码",
      treeCheckable: true,
      wmsLayer: null,
      infoTemplate
    };
  },
  methods: {
    search(value) {},
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
      const features = KMap.Graphics.fromGeoJSON(data);
      if (features.length) {
        this.layer.add(features[0]);
        centerShow({
          center: false,
          graphic: features[0]
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
      title: e.name,
      children: e.layers.map(a =>
        Object.assign(a, {
          title: a.name,
          icon: `static/img/comp/${a.symbol}`
        })
      )
    }));
  }
};
</script>

<style lang="less" scoped>

</style>
