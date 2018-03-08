import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 地图对象
    map: null,
    // 右上角可管理图层
    ctrlLayers: []
  },
  getters: {},
  mutations: {
    setMap(state, map) {
      (!state.map && map instanceof KMap.Map) && (state.map = map);
    },
    addCtrlLayer({ ctrlLayers }, { label, layer }) {
      ctrlLayers.push({ label, layer });
    }
  },
  actions: {},
  modules: {}
});

export default store;
