global.path = "http://" + location.host + "/" + location.pathname.split('/')[1];

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
        extent: layerProps.extent || mapConfig.extent,
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
        proxy: layerProps.proxy || mapConfig.proxyUrl + "?",
        dataType: layerProps.dataType
      });
  }
  throw "unknow layer type:" + layerProps.type;
};
global.createLayer = createLayer;

/**
 * 地图缩放到目标并打开infowindow
 */
function centerShow({
  graphic,
  layer,
  zoom = 14,
  show = true,
  center = true
}) {
  map.infoWindow.hide();
  const geom = graphic.getGeometry();
  const extent = geom.getExtent();
  let centerPoint, config = {};
  if (geom.getType() == "point") {
    centerPoint = geom.getCoordinates();
    config = { maxZoom: zoom };
  } else {
    centerPoint = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
  }
  config = Object.assign({}, config, {
    easing(n) {
      if (n == 1 && show) {
        showInfo();
      }
      return n;
    }
  });
  center && map.zoomByExtent(extent, config) || showInfo();
  // 显示infowindow
  function showInfo() {
    let template = graphic.getInfoTemplate();
    if (layer && !template) {
      template = layer.getInfoTemplate();
      graphic.setLayer(layer);
    }
    if (template) {
      map.infoWindow.setSelectedFeature(graphic);
      map.infoWindow.show(centerPoint);
    }
  };
};
global.centerShow = centerShow;
