function location() {
  clearGraphicsByName("MapLocating", "resultID");
  mapTip.getLocation(({ coordinate }) => {
    const [x, y] = coordinate;
    query.getCaseLocation(x, y, '').then(results => {
      const markInfo = { x, y, location: results.address };
      if (!results["workgrid"]) {
        root.$Message.info("地图定位：没有定位到工作网格，请重新定位。");
      } else {
        const { graphic } = newGraphic({
          coord: [x, y],
          symbol: new KMap.PictureMarkerSymbol({
            scale: 0.6,
            anchor: [0.5, 1],
            src: './static/img/single_marker.png'
          }),
          attr: { ...markInfo, "resultID": "MapLocating" }
        });
        map.getGraphics().add(graphic);
      }
    }).catch(e => {
      root.$Message.error("地图定位：请求服务器失败，请重新尝试。");
    });
  }, "单击地图进行定位");
};

event.$on("interface/doMark", location);

export default location;
