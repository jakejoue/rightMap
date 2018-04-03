import KQuery from 'assets/js/server/kquery';
import Action from 'assets/js/server/Action';
import GpsService from 'assets/js/server/gpsService';
import WebService from 'assets/js/server/WebService';

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
// 初始化查询相关方法
async function initServer(configData) {
  return new Promise((resolve, reject) => {
    const query = new KQuery({
      server: configData.geoServerUrl,
      appKey: configData.appKey
    });
    global.query = query;

    const action = new Action(path);
    global.action = action;

    const gpsService = new GpsService(
      configData.proxyUrl,
      configData.gpsServerUrl
    );
    global.gpsService = gpsService;

    const umservice = new WebService(
      configData.proxyUrl,
      configData.localWebserviceUrl
    );
    global.umservice = umservice;

    resolve({ query, action, gpsService, umservice });
  });
};
// 初始化地图
async function initMap(configData) {
  return new Promise((resolve, reject) => {
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
    initMapEvent(map);
    global.map = map;
    resolve(map);
  });
};
//初始化地图对话框
function initMapEvent(map) {
  const mapPopup = new KMap.Popup({
    "offset": [0, 0],
    "container": 'kmap-popup',
    "closer": 'kmap-popup-closer',
    "title": 'kmap-popup-title',
    "content": 'kmap-popup-content'
  });
  mapPopup.on("show", (evt) => {
    // 窗体切换事件
    const tab = $('#kmap-popup-title div.titleBar [InfoTag]');
    if (tab.length > 0) {
      const items = $('#kmap-popup-content [InfoTag]');
      if (items.length == tab.length) {
        tab.each(e => {
          $(tab[e]).click(() => {
            items.hide();
            $(items[e]).show()
          })
        });
        tab[0].click();
      }
    }
    // 设置窗体偏移
    const graphic = evt.target.getSelectedFeature();
    eventBus.$emit("infoWindow/show", graphic);
    if (graphic.getGeometry().getType() == 'point') {
      const id = graphic.getLayer().getId();
      const offset = configData.infoTOffset[id] || graphic.getAttribute('offset');
      offset && evt.target.setOffset(offset);
    }
  });
  map.infoWindow = mapPopup;
  map.addOverlay(mapPopup);
  // 地图点击绑定
  map.on('singleclick', onMapSingleClick, map);
};
//地图单击事件
function onMapSingleClick(e) {
  const map = this;
  const pixel = e.pixel;
  map.infoWindow.hide();
  map.forEachFeatureAtPixel(pixel, function(graphic, layer) {
    if (graphic.getVisible() && layer) {
      centerShow({ graphic, layer, center: false });
    }
  });
  eventBus.$emit('singleClick', e);
};
// 配置项请求，地图初始化
async function init() {
  // 请求配置文件
  return axios.all([
    axios.get("./static/config.json"),
    axios.get("./static/config.xml")
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
  })).then(configData => Promise.all([initMap(configData), initServer(configData)]));
}

export default {
  computed: {
    map() {
      return this.$store.state.map;
    }
  },
  mounted() {
    init().then(([map, server]) => {
      global.mapTip = new KMap.Interaction.MapTip();
      map.addInteraction(mapTip);
      this.$store.commit('setMap', map);
    });
  }
}
