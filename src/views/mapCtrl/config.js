import location from './location';
import streetView from './streetView';

const config = [
{
  title: '街景',
  class: 'streetView',
  handler(target) {
    streetView(target);
  }
},
{
  title: '放大地图范围',
  class: 'plus',
  handler() {
    map.zoomIn();
  }
},
{
  title: '全图',
  class: 'global',
  handler() {
    map.zoomToFullExtent();
  }
},
{
  title: '缩小地图范围',
  class: 'minus',
  handler() {
    map.zoomOut();
  }
},
{
  title: '定位',
  class: 'location',
  handler() {
    location();
  }
}];

export default config;
