import Vue from "vue";
import store from "store";

// 对外接口
global.interface = new Vue({
  id: 'interface',
  store,
  methods: {
    // 地图打点相关
    doMark() {
      event.$emit("interface/doMark")
    },
    getMapResult() {
      const graphic = getGraphicsByName("resultID", "MapLocating");
    },
    clearMapResult() {
      clearGraphicsByName("resultID", "MapLocating");
    },
    // 案件定位
    locateEvent() {}
  }
})
