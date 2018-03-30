import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import track from './track';

const store = new Vuex.Store({
  state: {
    // 地图对象
    map: null,
    // 右上角可管理图层
    ctrlLayers: [],
    // 车辆图例
    legend: [],
    // 图层(业务图层)，不需要vue相关组件的响应，所以这里用Map（map等数据结构，vuex不能正确监听）
    layers: new Map()
  },
  getters: {},
  mutations: {
    setMap(state, map) {
      (!state.map && map instanceof KMap.Map) && (state.map = map);
    },
    addCtrlLayer({ ctrlLayers }, { label, layer }) {
      ctrlLayers.push({ label, layer });
    },
    addLegend({ legend }, { label, icon }) {
      const target = legend.filter(e => e.label = label)[0];
      if (!target) {
        legend.push({ label, icon });
      } else {
        target.icon = icon;
      }
    },
    addLayer({ layers }, { id, layer }) {
      layers.set(id, layer);
    }
  },
  actions: {
    getLayer({ state }, id) {
      return new Promise((resolve, reject) => {
        const layer = state.layers.get(id);
        layer ? resolve(layer) : reject(layer);
      });
    }
  },
  modules: { track }
});

export default store;
