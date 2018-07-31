import layer from './layers';
import legend from './legend';
import mapBase from './mapBase';

function resolve(filename, filetype = 'png') {
  return `./static/img/${filename}.${filetype}`;
}

const config = [{
  id: "clearAll",
  title: '清除图形',
  img: resolve('clearAll_16'),
  handler({ target }) {
    target.active = -1;
    map.getGraphics().clear();
    eventBus.$emit("clearAll")
  }
},
{
  id: "MeasureDistance",
  title: '测量长度',
  select: true,
  img: resolve('Measure_Distance16'),
  handler({ type, target }) {
    map.setAction(type ? new KMap.Action.MeasureLength({ actionName: 'measurelength', geodesic: configData.geodesic }) : undefined);
  }
},
{
  id: "MeasureArea",
  title: '测量面积',
  select: true,
  img: resolve('Measure_Area16'),
  handler({ type, target }) {
    map.setAction(type ? new KMap.Action.MeasureArea({ actionName: 'measurearea', geodesic: configData.geodesic }) : undefined);
  }
},
{
  id: "layercatalog",
  title: '图层管理',
  img: resolve('layercatalog16'),
  component: layer
},
{
  id: "legend",
  title: '车辆图例',
  img: resolve('legend_16'),
  component: legend
},
{
  id: "streetView",
  title: '显示街景',
  img: resolve('street_view_16'),
  handler({ target }) {
    eventBus.$emit("streetView/show");
    target.active = -1;
  }
},
{
  id: "mapBase",
  title: '设置底图',
  img: resolve('mapBase_16'),
  component: mapBase
}];

export default config;
