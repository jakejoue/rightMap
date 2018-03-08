import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 地图对象
    map: null,
    // 右上角可管理图层
    ctrlLayer: new Map()
  },
  getters: {
    ctrlLayer({ ctrlLayer }) {
      const layers = [];
      ctrlLayer.forEach(({ key, value }) => {
        layers.push({ label: key, layer: value });
      });
      return layers;
    }
  },
  mutations: {
    setMap(state, map) {
      (!state.map && map instanceof KMap.Map) && (state.map = map);
    },
    addCtrlLayer({ ctrlLayer }, { label, layer }) {
      ctrlLayer.set(label, layer);
    }
  },
  actions: {},
  modules: {}
});

export default store;
