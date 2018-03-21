const config = [
{
  title: '街景',
  class: 'streetView',
  handler(target) {
    clearGraphicsByName("streetView", "resultID");
    map.setAction(new KMap.Action.MapTip({
      actionName: "streetView",
      message: "点击主干道显示街景",
      handerClick({ event: evt }) {
        // 加载地图点
        const [x, y] = evt.coordinate;
        const { graphic } = newGraphic({
          coord: [x, y],
          symbol: new KMap.PictureMarkerSymbol({
            anchor: [0.5, 1],
            src: './static/img/bubble30.png'
          }),
          attr: { "resultID": "streetView" }
        });
        map.getGraphics().add(graphic);
        target.$parent.$refs['streetMap'].show();
        // 坐标转换显示街景
        query.project2wgs(evt.coordinate[0], evt.coordinate[1]).then(function(result) {
          var point = [result.lon, result.lat];
          var truemapObj = document.getElementById("trueMap");
          if (truemapObj !== undefined && truemapObj !== null &&
            truemapObj.contentWindow.showVisionByLngLat !== undefined && truemapObj.contentWindow.showVisionByLngLat !== null &&
            $.isFunction(truemapObj.contentWindow.showVisionByLngLat)) {
            try {
              truemapObj.contentWindow.showVisionByLngLat(point[0], point[1]);
            } catch (e) {
              console.log(e);
            }
          }
        })
      }
    }));
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
},
{
  title: '定位',
  class: 'location',
  handler() {
    clearGraphicsByName("MapLocating", "resultID");
    map.setAction(new KMap.Action.MapTip({
      actionName: "location",
      message: "单击地图进行定位",
      handerClick: ({ event }) => {
        const [x, y] = event.coordinate;
        query.getCaseLocation(x, y, '').then(results => {
          const markInfo = { x, y, location: results.address };
          if (!results["workgrid"]) {
            root.$Message.info("地图定位：没有定位到工作网格，请重新定位。");
          } else {
            const { graphic } = newGraphic({
              coord: [x, y],
              symbol: new KMap.PictureMarkerSymbol({
                anchor: [0.5, 1],
                src: './static/img/bubble30.png'
              }),
              attr: { ...markInfo, "resultID": "MapLocating" }
            });
            map.getGraphics().add(graphic);
          }
        }).catch(e => {
          root.$Message.error("地图定位：请求服务器失败，请重新尝试。");
        });
      }
    }));
  }
}];

export default config;
