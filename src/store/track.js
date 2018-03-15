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
      state = { type, time, target, show: true };
      console.log(state);
    },
    close(state) {
      state = { type: "", time: null, target: null, show: false };
      console.log(state);
    }
  }
};
