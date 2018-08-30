let configData = {};

// 全局配置
global.path = "http://" + location.host + "/" + location.pathname.split('/')[1];
if (process.env.NODE_ENV == 'development') {
  global.path = "/proxy";
}
global.user_id = (function getUserId() {
  var cookie = document.cookie;
  var params = cookie.split(";");
  var itemArr, userId = "";
  for (var i = 0; i < params.length; i++) {
    itemArr = params[i].split("=");
    if (itemArr[0].indexOf("user_id") > -1) {
      userId = itemArr[1];
      break;
    }
  }
  return userId || "000000004d753da2014d756719870008";
})();

// 解析xml配置文件
function parseUrlConfig(xml) {
  const webConfig = {};
  var cases = $(xml).find("when");
  var matchItem = null;
  var wsUrl = "",
    mapUrl = "",
    gpsUrl = "",
    geoUrl = "",
    mapPicUrl = "";
  $(cases).each(function (index, item) {
    var configIP = item.attributes[0].textContent || item.attributes[0].text;
    if (configIP === location.hostname) {
      matchItem = item;
      wsUrl = $(matchItem).find("WebService")[0];
      mapUrl = $(matchItem).find("MapService")[0];
      gpsUrl = $(matchItem).find("GPSService")[0];
      geoUrl = $(matchItem).find("GeoService")[0];
      mapPicUrl = $(matchItem).find("MapPicService")[0];
      return false;
    }
  });
  if (wsUrl !== "" && mapUrl !== "") {
    webConfig.localWebserviceUrl = $(wsUrl).text();
    webConfig.mapServerUrl = $(mapUrl).text();
    webConfig.gpsServerUrl = $(gpsUrl).text();
    webConfig.geoServerUrl = $(geoUrl).text();
    webConfig.picServerUrl = $(mapPicUrl).text();
  } else {
    alert("配置文件未正确设置");
  }
  return webConfig;
}
// 请求配置文件
async function getConfig() {
  configData = await axios.all([
    axios.get("./static/config.json"),
    axios.get("./static/config.xml")
  ]).then(axios.spread(({ data: mapConfig }, { data: webConfig }) => {
    webConfig = parseUrlConfig(webConfig);
    const config = Object.assign({}, mapConfig, webConfig);
    return config;
  }));
  configData.proxyUrl = path + "/mapProxy.do";
  global.configData = configData;
}

/* *****************************ServerInit************************** */

import KQuery from 'assets/js/server/kquery';
import Action from 'assets/js/server/Action';
import GpsService from 'assets/js/server/gpsService';
import WebService from 'assets/js/server/WebService';

// 初始化查询方法类
function initServer() {
  global.query = new KQuery({
    server: configData.geoServerUrl,
    appKey: configData.appKey
  });
  global.action = new Action(path);
  global.gpsService = new GpsService(
    configData.proxyUrl,
    configData.gpsServerUrl
  );
  global.umservice = new WebService(
    configData.proxyUrl,
    configData.localWebserviceUrl
  );
}

/* *****************************MapInit**************************** */

// 初始化坐标系
function initPorj() {
  KMap.Projection.initGCJ02MCProj();
  KMap.Projection.initBDMCProj();
}

// 初始化地图
function initMap(mapTarget) {
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

  initPorj();
  const map = new KMap.Map(mapTarget, config);
  map.setFullExtent(configData.extent);

  var baseMap = createLayer({ id: "矢量", type: "GroupLayer", layers: configData.baseMap, visible: true });
  var imageMap = createLayer({ id: "影像", type: "GroupLayer", layers: configData.imageMap, visible: false });
  map.addBaseLayer(baseMap);
  map.addBaseLayer(imageMap);

  global.map = map;
}

async function init(mapTarget) {
  await getConfig();
  initServer();
  initMap(mapTarget);
}

import getWidgetConfigs from "./modules/index";

export default {
  data() {
    return {
      noHeader: false,
      noAside: false,
      noFooter: false,
      aIndex: -1,
      modules: []
    }
  },
  computed: {
    map() {
      return this.$store.state.map;
    }
  },
  mounted() {
    init("mapTarget").then(() => {
      // init Modules
      const { modules, noHeader, noFooter, noAside } = getWidgetConfigs(configData.defaultModules);
      this.modules = modules;
      this.noHeader = noHeader;
      this.noFooter = noFooter;
      this.noAside = noAside;
      // set Map
      global.mapTip = new KMap.Interaction.MapTip();
      map.addInteraction(mapTip);
      this.$store.commit('setMap', map);
      this.$nextTick(function() {
        // 读取配置会造成mapsize改变，这里要更新map
        map.updateSize();
        this.mapReady = true;
      });
    });
  }
}

export { configData }
