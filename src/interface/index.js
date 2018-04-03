import Vue from "vue";
import store from "store";
import { mapMutations, mapActions } from "vuex";
import { isString } from "util";

// 对外接口
global.interface = new Vue({
  id: 'interface',
  store,
  methods: {
    ...mapActions(['getLayer']),
    ...mapMutations(['addLayer']),
    // 地图打点相关
    doMark() {
      eventBus.$emit("interface/doMark")
    },
    getMapResult() {
      const graphic = getGraphicsByName("MapLocating", "resultID")[0];
      if (graphic) {
        return { ...graphic.getAttribute('markInfo') };
      }
    },
    clearMapResult() {
      clearGraphicsByName("MapLocating", "resultID");
    },
    // 播放街景
    playStreetmap(coord) {
      eventBus.$emit('streetView/show', coord);
    },
    moveCar(lon, lat, yaw) {
      eventBus.$emit('streetView/moveCar', lon, lat, yaw);
    },
    // 定位采集员
    locateObserver(observerJson) {
      let observer = JSON.parse(observerJson);
      observer = observer.length && observer.length > 0 ? observer[0] : observer;
      const id = observer['id'];
      this.getLayer('observer').then(layer => {
        const graphic = getGraphicsByName(id, 'id', layer)[0];
        graphic && centerShow({ graphic, layer });
      })
    },
    // 案件定位
    async locateEvent(eventInfos) {
      clearGraphicsByName('event');
      const { infoTemplate } = require('t/case.js');

      eventInfos = JSON.parse(eventInfos);
      if (eventInfos.length) {
        const graphics = [];
        while (eventInfos.length) {
          const eventInfo = eventInfos[0];
          eventInfos.shift();
          const { id: Id, eventCodeStr: Title } = eventInfo;
          const results = await umservice.getEventById(Id).catch(err => {
            console.log('查询案件详情失败');
            return eventInfo;
          });
          const { graphic } = newGraphic({
            coord: [results.abs_x, results.abs_y],
            symbol: new KMap.PictureMarkerSymbol({
              anchor: [0.5, 1],
              src: "./static/img/caseSymbol_1.png"
            }),
            attr: {
              "Name": "event",
              "Id": Id,
              "Title": Title,
              "EventClassName": results.eventclassname,
              "Location": results.location,
              "CellGridCode": results.cellgridcode,
              "WorkGridCode": results.workgridcode,
              "Content": results.note,
              "offset": [-1, -35]
            },
            infoTemplate
          });
          map.getGraphics().add(graphic);
          graphics.push(graphic);
        }
        graphics.length && centerShow({ graphic: graphics[0] });
      }
    },
    // 查询区域
    queryRegion(type, key, value) {
      clearGraphicsByName('extent');
      type = String(type);
      key = String(key);
      value = String(value);
      if (key === '0') {
        map.zoomToFullExtent();
        return;
      }
      const march = configData.infoTemplateSet.filter(e => {
        return e.hasOwnProperty(type) && e[type] == key;
      });
      if (march.length) {
        const { addZoneToMap } = require("../views/modules/mixns/queryGrid");
        const sType = march[0].type;
        query.queryGrid(value, sType, 0, 100).then(results => {
          addZoneToMap(results);
        })
      }
    },
    // 根据图层类型和要素编码查询区域
    queryRegionByCode(type, code) {
      this.queryRegion('type', type, code);
    },
    // 根据图层类型和要素名称查询区域
    queryRegionByName(type, name) {
      this.queryRegion('type', type, name);
    },
    // 绘制用户绘制的越界报警边界
    drawCustomFence(polygonJson) {
      if (!(isString(polygonJson) && polygonJson.trim().length)) {
        return;
      }
      var ringStr = polygonJson.replace(new RegExp(";", "ig"), "],[");
      ringStr = "[[[" + ringStr + "]]]";
      try {
        var pathArray = JSON.parse(ringStr);
        const { graphic } = newGraphic({
          type: "POLYGON",
          coord: pathArray,
          attr: {
            "Name": "extent"
          },
          symbol: KMap.SimpleFillSymbol({
            stroke: new KMap.SimpleLineSymbol({
              stroke: [255, 0, 0, 1],
              width: 2
            }),
            fill: [0, 0, 0, 0.2]
          })
        });
        map.getGraphics().add(graphic);
        map.zoomByExtent(polygon.getExtent());
      }
      catch (ex) {
        console.log(ex);
      }
    }
  }
})
