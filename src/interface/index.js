import Vue from "vue";
import store from "store";
import { mapMutations, mapActions } from "vuex";

// 对外接口
global.interface = new Vue({
  id: 'interface',
  store,
  methods: {
    ...mapActions(['getLayer']),
    ...mapMutations(['addLayer']),
    // 地图打点相关
    doMark() {
      event.$emit("interface/doMark")
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
      event.$emit('streetView/show', coord);
    },
    moveCar(lon, lat, yaw) {
      event.$emit('streetView/moveCar', lon, lat, yaw);
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
      clearGraphicsByName('caseEvent');
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
              "Name": "caseEvent",
              "Id": Id,
              "Title": Title,
              "EventClassName": results.eventclassname,
              "Location": results.location,
              "CellGridCode": results.cellgridcode,
              "WorkGridCode": results.workgridcode,
              "Content": results.note
            },
            infoTemplate
          });
          map.getGraphics().add(graphic);
          graphics.push(graphic);
        }
        graphics.length && centerShow({ graphic: graphics[0] });
      }
    }
  }
})
