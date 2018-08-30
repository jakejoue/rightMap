// 模板的配置地方
const modules = [{
  id: "search",
  title: "查询",
  img: "./static/img/search_24.png",
  module: () => import('./search.vue')
},
{
  id: "observer",
  title: "人员监控",
  img: "./static/img/tracker_40.png",
  module: () => import('./observer.vue')
},
{
  id: "vehicle",
  title: "车辆监控",
  img: "./static/img/vehicle_40.png",
  module: () => import('./vehicle.vue')
},
{
  id: "monitor",
  title: "视频监控",
  img: "./static/img/monitor_40.png",
  module: () => import('./monitor.vue')
},
{
  id: "zone",
  title: "行政区划",
  img: "./static/img/xingzhengquyu.png",
  module: () => import('./zone.vue')
},
{
  id: "comp",
  title: "智能部件",
  img: "./static/img/bujian.png",
  module: () => import('./comp.vue')
},
{
  id: "garden",
  title: "园林绿化",
  img: "./static/img/tree40.png",
  module: () => import('./garden.vue')
},
{
  id: "uva",
  title: "无人机监控",
  img: "./static/img/uva_40.png",
  module: () => import('./uva.vue')
}];

export default (defaultModules = []) => {
  const configStr = location.search.slice(1).toLowerCase();
  const configArr = configStr ? configStr.split(',') : defaultModules;

  global.modules = configArr;

  const ret = [];
  configArr.forEach(e => {
    const item = modules.find(module => module.id == e);
    item && ret.push(item);
  });
  // 如果只不包含模块配置（要屏蔽模块使用noaside）
  if (!ret.length) {
    defaultModules.forEach(e => {
      const item = modules.find(module => module.id == e);
      item && ret.push(item);
    });
  }
  return {
    modules: ret,
    noHeader: configArr.includes("noheader"),
    noFooter: configArr.includes("nofooter"),
    noAside: configArr.includes("noaside")
  };
};
