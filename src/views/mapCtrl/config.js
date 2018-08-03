import location from './location';
import streetView from './streetView';
import { isFunction } from 'util';

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
  }
];

// 最后一个元素（定位或者绘制越界）
if (!global.modules.includes("poifence")) {
  // 默认为定位
  config.push({
    title: '定位',
    class: 'location',
    handler() {
      location();
    }
  });
} else {
  // 父页面调用方法
  const getCoordinateExtent = function (g) {
    if (isFunction(parent.getCoordinateExtent)) {
      let pointstr = "";
      if (g) {
        pointstr = g.getGeometry().transform(configData.projection, configData.dataProjection).getCoordinates()[0].join(";");
      }
      parent.getCoordinateExtent(pointstr);
    }
  }
  // 初始化drawaction
  require("./DrawPOIFenceAction");
  const action = new KMap.Action.DrawPOIFenceAction({
    actionName: 'drawPOIFenceAction',
    layerSymbol: DRAWSYMBOL,
    showToolBar: false,
    drawType: 'polygon',
    drawEnd: function (e) {
      action.close();
      getCoordinateExtent(e.graphic);
    },
    editEnd: function (e) {
      getCoordinateExtent(e.graphics[0]);
    },
    deleteEnd: function (e) {
      getCoordinateExtent();
    }
  });
  // 绑定图层情况事件
  eventBus.$on("clearAll", () => {
    if (map.getAction() === action) {
      map.setAction(null);
      action.clearDraw();
    }
  });
  // action相关事件（接口调用）
  eventBus.$on("PoiDraw/addGraphic", g => {
    clearGraphicsByName("drawFence");
    map.setAction(action);
    action.close();
    action.clearDraw();
    action.addGraphics([g]);
    map.zoomByExtent(g.getGeometry().getExtent());
  });
  eventBus.$on("PoiDraw/clear", () => {
    action.clearDraw();
  });
  // 加载按钮
  config.push({
    title: '越界绘制',
    class: 'drawFence',
    handler() {
      clearGraphicsByName("drawFence");
      action.clearDraw();
      map.setAction(action);
    }
  });
}
export default config;
