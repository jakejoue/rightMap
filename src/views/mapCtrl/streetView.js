export default (target) => {
  clearGraphicsByName("streetView", "resultID");
  mapTip.getLocation(({ coordinate }) => {
    const [x, y] = coordinate;
    const { graphic } = newGraphic({
      coord: [x, y],
      symbol: new KMap.PictureMarkerSymbol({
        scale: 0.6,
        anchor: [0.5, 1],
        src: './static/img/single_marker.png'
      }),
      attr: { "resultID": "streetView" }
    });
    map.getGraphics().add(graphic);
    target.$parent.$refs['streetMap'].show();
    // 坐标转换显示街景
    query.project2wgs(x, y).then(function(result) {
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
  }, "点击主干道显示街景");
};
