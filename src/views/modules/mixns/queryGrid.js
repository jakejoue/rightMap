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
      break;
    case "道路":
      return query.queryRoad(value, 0, 100);
      break;
    case "行政区":
      return query.queryGrid(value, "1", 0, 100);
      break;
    case "街道办":
      return query.queryGrid(value, "2", 0, 100);
      break;
    case "社区":
      return query.queryGrid(value, "3", 0, 100);
      break;
    case "工作网格":
      return query.queryGrid(value, "4", 0, 100);
      break;
    case "单元网格":
      return query.queryGrid(value, "5", 0, 100);
      break;
    default:
      throw new Error("未定义的查找的类型：" + searchType);
  }
}

export default queryGrid;
