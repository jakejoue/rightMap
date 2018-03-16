//用于操作track的store

export default {
  namespaced: true,
  state: {
    // 轨迹类别(observer, car)
    type: "",
    // 查询时间段
    time: null,
    // 当前选中的graphic
    target: null,
    //轨迹操作窗口显示
    show: false
  },
  mutations: {
    show(state, { type, time, target }) {
      state.show = true;
      state.type = type;
      state.time = time;
      state.target = target;

    },
    close(state) {
      state.show = false;
      state.type = "";
      state.time = null;
      state.target = null;;
    }
  }
};
