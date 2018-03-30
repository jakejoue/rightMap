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
      const graphic = getGraphicsByName("MapLocating", "resultID")[0];
      if (graphic) {
        return { ...graphic.getAttribute('markInfo') };
      }
    },
    clearMapResult() {
      clearGraphicsByName("MapLocating", "resultID");
    },
    // 播放街景
    playStreetmap(coord) {
      event.$emit('streetView/show', coord);
    },
    moveCar(lon, lat, yaw) {
      event.$emit('streetView/moveCar', lon, lat, yaw);
    },
    // 案件定位
    locateEvent() {}
  }
})
