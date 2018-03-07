import layer from './layers';
import mapBase from './mapBase';

function resolve(filename, filetype = 'png') {
  return `static/img/${filename}.${filetype}`;
}

const config = [{
    title: '清除图形',
    img: resolve('clearAll_16'),
    handler({target}) {
      target.active = -1;
    }
  },
  {
    select: true,
    title: '测量长度',
    img: resolve('Measure_Distance16')
  },
  {
    select: true,
    title: '测量面积',
    img: resolve('Measure_Area16'),
  },
  {
    title: '图层管理',
    img: resolve('layercatalog16'),
    component: layer
  },
  {
    title: '车辆图例',
    img: resolve('legend_16')
  },
  {
    title: '显示街景',
    img: resolve('street_view_16'),
    handler({type, target}) {
      type && target.$parent.$refs['streetMap'].show();
    }
  },
  {
    select: true,
    title: '设置底图',
    img: resolve('mapBase_16'),
    component: mapBase
  }
];

export default config;
