export default ({
  namespaced: true,
  state: {
    events: {}
  },
  mutations: {
    on({ events }, { type, handler }) {
      events[type] || (events[type] = []);
      events[type].push(handler);
    },
    un({ events }, { type, handler }) {
      if (events[type]) {
        for (const i in events[type]) {
          if (events[type][i] === handler) {
            events[type].splice(i, 1);
            return;
          }
        }
      }
    },
    dispatch({ events }, { type, event }) {
      if (events[type]) {
        events[type].forEach(e => {
          e(event);
        });
      }
    }
  },
  actions: {
    on({ state, commit }, { type, handler }) {
      commit('un', { type, handler });
      commit('on', { type, handler });
    },
    un({ state, commit }, { type, handler }) {
      commit('un', { type, handler });
    }
  }
});
