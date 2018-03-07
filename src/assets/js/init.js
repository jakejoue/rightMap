// 地图初始化
import axios from 'axios';

// 解析xml配置文件
function parseUrlConfig(xml) {
  const webConfig = {};
  var cases = $(xml).find("when");
  var matchItem = null;
  var wsUrl = "",
    mapUrl = "",
    gpsUrl = "",
    geoUrl = "",
    picUrl;
  $(cases).each(function(index, item) {
    var configIP = item.attributes[0].textContent || item.attributes[0].text;
    if (configIP === location.hostname) {
      matchItem = item;
      wsUrl = $(matchItem).find("WebService")[0];
      mapUrl = $(matchItem).find("MapService")[0];
      gpsUrl = $(matchItem).find("GPSService")[0];
      geoUrl = $(matchItem).find("GeoService")[0];
      picUrl = $(matchItem).find("MapPicService")[0];
      return false;
    }
  });
  if (wsUrl !== "" && mapUrl !== "") {
    webConfig.localWebserviceUrl = $(wsUrl).text();
    webConfig.mapServerUrl = $(mapUrl).text();
    webConfig.gpsServerUrl = $(gpsUrl).text();
    webConfig.geoServerUrl = $(geoUrl).text();
    webConfig.picServerUrl = $(picUrl).text();
  } else {
    alert("配置文件未正确设置");
  }
  return webConfig;
};
// 创建地图图层组
function creatBaseLayer(id, layers, visible = true) {
  const layerGroup = new KMap.GroupLayer(id);
  for (var i = 0; i < layers.length; i++) {
    const layer = createLayer(layers[i]);
    layerGroup.push(layer)
  }
  layerGroup.setVisible(visible);
  return layerGroup;
};

async function init() {
  // 请求配置文件
  return axios.all([
    axios.get("static/config.json"),
    axios.get("static/config.xml")
  ]).then(axios.spread(({ data: mapConfig }, { data: webConfig }) => {
    webConfig = parseUrlConfig(webConfig);
    // 合并配置项
    const configData = Object.assign({}, mapConfig, webConfig);
    // 代理地址
    configData.proxyUrl = path + "/mapProxy.do";
    // 赋值到全局
    global.configData = configData;
    // 进入下初始化阶段
    return configData;
  })).then(configData => {
    // 初始化kmap的配置项
    const config = {
      projection: configData.projection,
      geodesic: configData.geodesic,
      center: configData.centerPoint,
      resolutions: (!configData.resolutions) ? undefined : configData.resolutions,
      minResolution: configData.minResolution,
      maxResolution: configData.maxResolution,
      resolution: configData.resolution,
      minZoom: configData.minZoom,
      maxZoom: configData.maxZoom,
      zoom: configData.zoom
    };
    global.mapConfig = config;
    // 初始化地图对象和底图
    const map = new KMap.Map('mapTarget', config);
    map.setFullExtent(configData.extent);
    // 矢量地图
    global.baseMap = creatBaseLayer('矢量', configData.baseMap);
    // 影像地图
    global.imageMap = creatBaseLayer('影像', configData.imageMap, false);
    map.addBaseLayer(baseMap);
    map.addBaseLayer(imageMap);
    global.map = map;
    return map;
  });
}

let map = null;

export default {
  computed: {
    map() {
      return this.$store.state.map;
    }
  },
  beforeCreate() {
    init().then(map => {
      this.$store.commit('setMap', map);
    });
  }
}
