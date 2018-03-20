const config = [
{
  title: '街景',
  class: 'streetView'
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
    map.setAction(
      new KMap.Action.MapLocation({
        actionName: "location",
        locationFunction: ([x, y]) => {
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
      })
    )
  }
}];

export default config;
