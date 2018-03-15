import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import event from './event';
import track from './track';

const store = new Vuex.Store({
  state: {
    // 地图对象
    map: null,
    // 右上角可管理图层
    ctrlLayers: [],
    // 车辆图例
    legend: []
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
    }
  },
  actions: {},
  modules: { event, track }
});

export default store;
