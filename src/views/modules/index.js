// 模板的配置地方

export default {
  modules: [{
      title: "查询",
      img: "./static/img/search_24.png",
      module: () => import ('./search.vue')
    },
    {
      title: "人员监控",
      img: "./static/img/tracker_40.png",
      module: () => import ('./observer.vue')
    },
    {
      title: "车辆监控",
      img: "./static/img/vehicle_40.png",
      module: () => import ('./vehicle.vue')
    },
    {
      title: "视频监控",
      img: "./static/img/monitor_40.png",
      module: () => import ('./monitor.vue')
    },
    {
      title: "行政区划",
      img: "./static/img/xingzhengquyu.png",
      module: () => import ('./zone.vue')
    },
    {
      title: "智能部件",
      img: "./static/img/bujian.png",
      module: () => import ('./comp.vue')
    }
  ]
}