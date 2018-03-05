import layer from './layers';

function resolve(filename, filetype = 'png') {
  return `static/img/${filename}.${filetype}`;
}

const config = [{
    title: '清除图形',
    img: resolve('clearAll_16'),
    handler({type}) {
        type && alert('清除图形');
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
    img: resolve('street_view_16')
  },
  {
    select: true,
    title: '设置底图',
    img: resolve('mapBase_16')
  }
];

export default config;
