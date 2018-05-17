// 查询网格
async function queryGrid(type, value) {
  switch (type) {
    case "兴趣点":
      return query.queryPoint(value, 0, 1000).then(data => {
        data.items.forEach(item => {
          item.geo = KMap.Geometry.toWKT(
            new KMap.Point([item.x, item.y])
          );
          item.name = item.name || "";
          item.address = item.address || "";
          item.tel = item.tel || "";
        });
        return data;
      });
    case "道路":
      return query.queryRoad(value, 0, 100);
    case "行政区":
      return query.queryGrid(value, "1", 0, 100);
    case "街道办":
      return query.queryGrid(value, "2", 0, 100);
    case "社区":
      return query.queryGrid(value, "3", 0, 100);
    case "工作网格":
      return query.queryGrid(value, "4", 0, 100);
    case "单元网格":
      return query.queryGrid(value, "5", 0, 100);
    default:
      throw new Error("未定义的查找的类型：" + searchType);
  }
}

// 将查询结果添加到地图上（区域查询结果专用）
function addZoneToMap(results) {
  clearGraphicsByName('extent');
  if (results && results.items && results.items.length > 0) {
    let graphic, geometry, result;
    let graphics = [];
    for (var i = 0; i < results.items.length; i++) {
      result = results.items[i];
      geometry = KMap.Geometry.fromWKT(result.geo);
      graphic = new KMap.Graphic();
      graphic.setId("extent" + i);
      graphic.setGeometry(geometry);
      graphic.setAttributes({
        Name: "extent",
        Code: result.code,
        Type: result.type
      });
      graphic.setSymbol(MULTIPOLYGON);
      graphics.push(graphic);
    }
    map.getGraphics().addAll(graphics);

    centerShow({ graphics });
  }
}

export { queryGrid, addZoneToMap };
