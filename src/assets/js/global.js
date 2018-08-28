import { isArray } from "util";

// 弹出框事件
global.tf = {}

// 默认线和面样式
const MULTILINESTRING = new KMap.SimpleLineSymbol({
  stroke: [160, 0, 66, 0.8],
  width: 3
});
const MULTIPOLYGON = new KMap.SimpleFillSymbol({
  stroke: MULTILINESTRING,
  fill: [98, 194, 204, 0.5]
});
global.MULTILINESTRING = MULTILINESTRING;
global.MULTIPOLYGON = MULTIPOLYGON;

// 越界线绘制样式
const DRAWSYMBOL = new KMap.SimpleFillSymbol({
  stroke: new KMap.SimpleLineSymbol({
    stroke: [255, 0, 0, 1],
    width: 2
  }),
  fill: [0, 0, 0, 0.2]
});
global.DRAWSYMBOL = DRAWSYMBOL;

/*****************************地图坐标转换*********************************** */

function fromMap(coordinate, to = configData.dataProjection) {
  if (isArray(coordinate) && coordinate.length >= 2) {
    const [x, y] = KMap.Projection.transform([+coordinate[0], +coordinate[1]], configData.projection, to);
    if (isNaN(x) || isNaN(y)) {
      return [0, 0];
    }
    return [x, y];
  } else {
    return [0, 0];
  }
}
global.fromMap = fromMap;
function toMap(coordinate, source = configData.dataProjection) {
  if (isArray(coordinate) && coordinate.length >= 2) {
    const [x, y] = KMap.Projection.transform([+coordinate[0], +coordinate[1]], source, configData.projection);
    if (isNaN(x) || isNaN(y)) {
      return [0, 0];
    }
    return [x, y];
  } else {
    return [0, 0];
  }
}
global.toMap = toMap;

/*****************************地图交互相关方法(需要全局map对象已经初始化)*********************************** */

/**
 * 地图缩放到目标并打开infowindow
 */
function centerShow({
  graphic,
  graphics,
  layer,
  zoom = configData.maxZoom,
  center = true,
  show = true
}) {
  map.infoWindow.hide();
  let geom, extent;
  if (isArray(graphics) && graphics.length) {
    graphics.forEach(g => {
      const extent_ = g.getGeometry().getExtent();
      if (!extent) extent = extent_;
      else {
        extent[0] = Math.min(extent[0], extent_[0]);
        extent[1] = Math.min(extent[1], extent_[1]);
        extent[2] = Math.max(extent[2], extent_[2]);
        extent[3] = Math.max(extent[3], extent_[3]);
      }
    });
    graphic = graphics[0];
    geom = graphic.getGeometry();
  } else if (graphic) {
    geom = graphic.getGeometry();
    extent = geom.getExtent();
  } else {
    return;
  }
  let centerPoint, config = {};
  if (geom.getType() == "point") {
    centerPoint = geom.getCoordinates();
    config = { maxZoom: zoom };
  } else {
    centerPoint = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
  }
  config.easing = function (n) {
    n >= 1 && showInfo();
    return n;
  }
  center ? map.zoomByExtent(extent, config) : showInfo();
  // 显示infowindow
  function showInfo() {
    if (!show) return;
    let template = graphic.getInfoTemplate();
    if (layer && !template) {
      template = layer.getInfoTemplate();
      graphic.setLayer(layer);
    }
    if (template) {
      map.infoWindow.setSelectedFeature(graphic);
      map.infoWindow.show(centerPoint);
    }
  }
}
global.centerShow = centerShow;

// 按照名称清除默认的绘画图层
function clearGraphicsByName(value, key = "Name", layer) {
  layer = layer || map.getGraphics();
  layer.forEach(function (g) {
    const Name = g.getAttribute(key);
    if (Name === value) {
      layer.remove(g);
    }
  });
}
global.clearGraphicsByName = clearGraphicsByName;

// 按照名称获取默认的绘画图层
function getGraphicsByName(value, key = "Name", layer) {
  layer = layer || map.getGraphics();
  const rets = [];
  layer.forEach(function (g) {
    const Name = g.getAttribute(key);
    if (Name === value) {
      rets.push(g)
    }
  });
  return rets;
}
global.getGraphicsByName = getGraphicsByName;

/*****************************其他方法*********************************** */

/**
 * 创建图层
 * @private
 * @param {*} layerProps
 */
function createLayer(layerProps) {
  var layerId = layerProps.id;
  switch (layerProps.type) {
    case "ArcGISRest":
      return new KMap.ArcGISRestLayer(layerId, {
        projection: layerProps.projection,
        url: layerProps.url,
        extent: layerProps.extent || configData.extent,
        tile: layerProps.tile,
        ratio: layerProps.ratio
      });
    case "TileWMS":
      return new KMap.TileWMSLayer(layerId, {
        url: layerProps.url,
        layers: layerProps.layers,
        format: layerProps.format,
        srs: layerProps.srs,
        projection: layerProps.projection
      });
    case "AMapLayer":
      return new KMap.AMapLayer(layerId, {
        url: layerProps.url,
        projection: layerProps.projection
      });
    case "ArcGISTile":
      return new KMap.ArcGISTileLayer(layerId, {
        projection: layerProps.projection,
        url: layerProps.url,
        proxy: layerProps.proxy || configData.proxyUrl + "?",
        dataType: layerProps.dataType
      });
    case "BaiduLayer":
      return new KMap.BaiduLayer(layerId, {
        url: layerProps.url,
      });
    case "GroupLayer":
      {
        const layerGroup = new KMap.GroupLayer(layerId);
        for (var i = 0; i < layerProps.layers.length; i++) {
          const layer = createLayer(layerProps.layers[i]);
          layerGroup.push(layer)
        }
        layerGroup.setVisible(layerProps.visible);
        return layerGroup;
      }
  }
  throw "unknow layer type:" + layerProps.type;
}
global.createLayer = createLayer;

//新建Graphic对象
function newGraphic({
  type = 'POINT',
  coord = [],
  symbol,
  attr,
  infoTemplate,
  visible = true
}, dataProjection, graphicProjection) {
  let graphic = new KMap.Graphic();
  let geometry;
  switch (type.toUpperCase()) {
    case 'POINT':
      geometry = new KMap.Point(coord);
      break;
    case 'POLYLINE':
      geometry = new KMap.Polyline(coord);
      break;
    case 'POLYGON':
      geometry = new KMap.Polygon(coord);
      break;
    case 'MULTIPOINT':
      geometry = new KMap.MultiPoint(coord);
      break;
    case 'MULTIPOLYGON':
      geometry = new KMap.MultiPolygon(coord);
      break;
  }
  if (dataProjection && graphicProjection) {
    geometry = geometry.transform(dataProjection, graphicProjection);
  }
  graphic.setGeometry(geometry);
  graphic.setVisible(visible);

  attr && graphic.setAttributes(attr);
  symbol && graphic.setSymbol(symbol);
  infoTemplate && graphic.setInfoTemplate(infoTemplate);
  return { graphic, geometry, symbol };
}
global.newGraphic = newGraphic;

// 生成时间戳
function timestamp() {
  return new Date().getTime();
}
global.timestamp = timestamp;
