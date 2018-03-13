<script>
import mix from "./mix";

export default {
  moduleName: "comp",
  mixins: [mix],
  data() {
    return {
      placeholder: "请输入部件编码",
      treeCheckable: true,
      wmsLayer: null
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
