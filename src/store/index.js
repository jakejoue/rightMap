import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

function has(param) {
  return () => new Promise((resolve, reject) => {
    param ? resolve(param) : reject(param);
  });
}

const store = new Vuex.Store({
  state: {
    // 地图对象
    map: null,
    // 所有图层
    layers: new Map()
  },
  getters: {
    getMap: ({ map }) => has(map)
  },
  mutations: {
    setMap(state, map) {
      (!state.map && map) && (state.map = map);
    }
  },
  actions: {
    async addLayer({ getters, state }, { name, layer }) {
      if (name && layer instanceof ol.layer.Base) {
        const map = await getters.getMap();
        state.layers.set(name, layer);
        map.addLayer(layer);
      }
    }
  },
  modules: {

  }
});

export default store;
