import Vue from "vue";
import store from "store";
import { mapMutations, mapActions } from "vuex";
import { isString, isFunction, isArray } from "util";

// 对外接口
global.interface = new Vue({
  id: 'interface',
  store,
  methods: {
    ...mapActions(['getLayer']),
    ...mapMutations(['addLayer']),
    /************************************地图打点相关*********************************** */
    doMark(callback, failed) {
      eventBus.$emit("interface/doMark", callback, failed);
    },
    clearMark() {
      clearGraphicsByName("MapLocating", "resultID");
    },
    getMapResult() {
      const graphic = getGraphicsByName("MapLocating", "resultID")[0];
      if (graphic) {
        let markInfo = graphic.getAttribute('markInfo');
        markInfo = markInfo && { ...markInfo };
        return markInfo;
      }
    },
    clearMapResult() {
      const graphic = getGraphicsByName("MapLocating", "resultID")[0];
      if (graphic) {
        graphic.setAttribute('markInfo', null);
      }
    },
    /************************************街景相关*********************************** */
    // 播放街景
    playStreetmap(coord) {
      eventBus.$emit('streetView/show', coord);
    },
    moveCar(lon, lat, yaw) {
      eventBus.$emit('streetView/moveCar', lon, lat, yaw);
    },
    /************************************要素定位相关*********************************** */
    // 定位到任意图层名，键值对相等的graphic并打开infowindow到指定zoom
    locateObj(attrName, attrValue, layerId, zoom, show) {
      this.getLayer(layerId).then(layer => {
        const graphic = getGraphicsByName(attrValue, attrName, layer)[0];
        graphic && centerShow({ graphic, layer, zoom, show });
      });
    },
    // 定位采集员
    locateObserver(observerJson, zoom, show) {
      const observers = JSON.parse(observerJson);
      if(isArray(observers)) {
        const graphics = [];
        observers.forEach(observer => {
          const id = observer['id'];
          this.getLayer('observer').then(layer => {
            const graphic = getGraphicsByName(id, 'id', layer)[0];
            graphic && graphics.push(graphic);
          })
        });
        graphics.length && centerShow({ graphics, layer, zoom, show });
      }
    },
    // 案件定位
    async locateEvent(eventInfos, zoom, show = false) {
      clearGraphicsByName('event');
      eventInfos = JSON.parse(eventInfos);
      // 如果有效参数
      if (eventInfos.length) {
        // 引入案件部件infowindow
        const { infoTemplate, caseSymbol, EVENT_LEVEL, EVENT_RESOURCE } = require('t/case.js');
        const { infoTemplate2, compSymbol } = require('t/comp.js');
        // 支持多定位的graphics
        const graphics = [];
        while (eventInfos.length) {
          const eventInfo = eventInfos[0];
          eventInfos.shift();
          const { id: Id, eventCodeStr: Title } = eventInfo;
          let results = await umservice.getEventById(Id).catch(err => {
            console.log('查询案件详情失败');
            return eventInfo;
          });
          if (isArray(results) && results.length == 0) {
            results = eventInfo;
          }
          const { graphic } = newGraphic({
            coord: toMap([results.abs_x, results.abs_y]),
            symbol: caseSymbol,
            attr: {
              "Name": "event",
              "Id": Id,
              "Title": Title,
              "EventClassName": results.eventclassname,
              "Resource": EVENT_RESOURCE[results.event_resource],
              "ReportTime": (results.report_time || "").replace('T', ' ').substring(0, 19),
              "Level": EVENT_LEVEL[results.event_level],
              "offset": [0, -40]
            },
            infoTemplate
          });
          map.getGraphics().add(graphic);
          graphics.push(graphic);

          // 关联部件
          const compId = eventInfo.geo_component;
          if (compId) {
            const compInfo = await query.queryComp(compId, 0, 1);
            if (compInfo.items && compInfo.total > 0) {
              const attrs = compInfo.items[0];
              const { graphic } = newGraphic({
                coord: toMap([results.abs_x, results.abs_y]),
                symbol: compSymbol,
                attr: { "Name": "event", "offset": [0, -65], ...attrs },
                infoTemplate: infoTemplate2
              });
              map.getGraphics().add(graphic);
            }
          }
        }
        graphics.length && centerShow({ graphics, zoom, show });
      }
    },
    /************************************查询相关*********************************** */
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
    /************************************区域绘制相关*********************************** */
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
          symbol: DRAWSYMBOL
        }, configData.dataProjection, configData.projection);
        eventBus.$emit("PoiDraw/addGraphic", graphic);
      } catch (ex) {
        console.log(ex);
      }
    },
    // 绘制区域报警
    drawDistrictFence(value, callback) {
      eventBus.$emit("PoiDraw/clear");
      const { addZoneToMap } = require("../views/modules/mixns/queryGrid");
      query.queryGrid(value, null, 0, 100).then(results => {
        addZoneToMap(results, "drawFence", DRAWSYMBOL);
        var gs = getGraphicsByName("drawFence");
        if (isFunction(callback)) {
          if (gs.length) {
            callback(gs[0].getAttribute("Code"));
          } else {
            callback(null);
          }
        }
      });
    }
  }
})
