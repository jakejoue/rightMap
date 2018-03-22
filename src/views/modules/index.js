// 模板的配置地方
const modules = [{
  id: "search",
  title: "查询",
  img: "./static/img/search_24.png",
  module: () => import ('./search.vue')
},
{
  id: "observer",
  title: "人员监控",
  img: "./static/img/tracker_40.png",
  module: () => import ('./observer.vue')
},
{
  id: "vehicle",
  title: "车辆监控",
  img: "./static/img/vehicle_40.png",
  module: () => import ('./vehicle.vue')
},
{
  id: "monitor",
  title: "视频监控",
  img: "./static/img/monitor_40.png",
  module: () => import ('./monitor.vue')
},
{
  id: "zone",
  title: "行政区划",
  img: "./static/img/xingzhengquyu.png",
  module: () => import ('./zone.vue')
},
{
  id: "comp",
  title: "智能部件",
  img: "./static/img/bujian.png",
  module: () => import ('./comp.vue')
}];

export default () => {
  const params = location.search.slice(1);
  const config = params ? params.split(',') : [];
  if (config.length) {
    return modules.filter(e => config.includes(e.id));
  } else {
    return modules;
  }
};
