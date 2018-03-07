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
