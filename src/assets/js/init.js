// 地图初始化
import axios from 'axios';

let map = null;

export default {
  async beforeCreate() {
    map = new ol.Map({
      layers: [],
      controls: [],
      view: new ol.View({
        center: [0, 0],
        zoom: 3,
        minZoom: 3
      })
    });
    await axios.get("static/config.json");
  },
  mounted() {
    map.setTarget("mapTarget");
    const layer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
    this.$store.commit("setMap", map);
    this.$store.dispatch("addLayer", {
      name: "baseLayer",
      layer
    });
  }
}
