import layer from './layers';
import legend from './legend';
import mapBase from './mapBase';

function resolve(filename, filetype = 'png') {
  return `./static/img/${filename}.${filetype}`;
}

const config = [{
  title: '清除图形',
  img: resolve('clearAll_16'),
  handler({ target }) {
    target.active = -1;
    map.getGraphics().clear();
    target.$store.commit("event/dispatch", { type: "clearAll" });
  }
},
{
  select: true,
  title: '测量长度',
  img: resolve('Measure_Distance16'),
  handler({ type, target }) {
    map.setAction(type ? new KMap.Action.MeasureLength({ actionName: 'measurelength', geodesic: true }) : undefined);
  }
},
{
  select: true,
  title: '测量面积',
  img: resolve('Measure_Area16'),
  handler({ type, target }) {
    map.setAction(type ? new KMap.Action.MeasureArea({ actionName: 'measurearea', geodesic: true }) : undefined);
  }
},
{
  title: '图层管理',
  img: resolve('layercatalog16'),
  component: layer
},
{
  title: '车辆图例',
  img: resolve('legend_16'),
  component: legend
},
{
  title: '显示街景',
  img: resolve('street_view_16'),
  handler({ target }) {
    target.$parent.$refs['streetMap'].show();
    target.active = -1;
  }
},
{
  title: '设置底图',
  img: resolve('mapBase_16'),
  component: mapBase
}];

export default config;
