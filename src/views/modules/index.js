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
},
{
  id: "garden",
  title: "园林绿化",
  img: "./static/img/tree40.png",
  module: () => import ('./garden.vue')
},
{
  id: "uva",
  title: "无人机监控",
  img: "./static/img/uva_40.png",
  module: () => import ('./uva.vue')
}];

const defaultConfig = [
  "search",
  "observer",
  "vehicle",
  "monitor",
  "zone",
  "comp"
];

export default () => {
  const params = location.search.slice(1);
  const config = params ? params.split(',') : defaultConfig;
  const ret = [];
  config.forEach(e => {
    const item = modules.find(a => a.id == e);
    item && ret.push(item);
  });
  return ret;
};
