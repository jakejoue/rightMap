import { isFunction } from 'util';

function getBuiltEditWindow() {
  let w;
  top.$("div.om-dialog.om-widget.om-widget-content.om-corner-all.om-draggable").each(function() {
    if (w) {
      if ($(this).css("z-index") > w.css("z-index")) {
        w = $(this);
      }
    } else {
      w = $(this);
    }
  });
  if (w) {
    return w.find("iframe")[0].contentWindow;
  }
}

function location(callback, failed) {
  clearGraphicsByName("MapLocating", "resultID");
  mapTip.getLocation(({ coordinate }) => {
    const [x, y] = coordinate;
    query.getCaseLocation(x, y, '').then(results => {
      const markInfo = { x, y, location: results.address };
      if (!results["workgrid"]) {
        root.$Message.info("地图定位：没有定位到工作网格，请重新定位。");
        isFunction(failed) && failed();
      } else {
        const { graphic } = newGraphic({
          coord: [x, y],
          symbol: new KMap.PictureMarkerSymbol({
            scale: 0.6,
            anchor: [0.5, 1],
            src: './static/img/single_marker.png'
          }),
          attr: { markInfo, "resultID": "MapLocating" }
        });
        if (!getGraphicsByName("MapLocating", "resultID").length) {
          map.getGraphics().add(graphic);
          isFunction(callback) && callback();
          const builtEditWindow = getBuiltEditWindow();
          if (builtEditWindow && isFunction(builtEditWindow.mapClick)) {
            builtEditWindow.mapClick();
          }
        }
      }
    }).catch(e => {
      root.$Message.error("地图定位：请求服务器失败，请稍后重新尝试");
    });
  }, "单击地图进行定位");
}

eventBus.$on("interface/doMark", location);

export default location;
