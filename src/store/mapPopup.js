//用于操作mapPopup的store

export default {
  namespaced: true,
  state: {
    graphics: []
  },
  mutations: {
    show(state, graphics = []) {
      state.graphics = graphics;
    },
    hide(state) {
      state.graphics = [];
    }
  }
};
