// 网格查询共用方法
export default {
  methods: {
    queryGrid(type, value) {
      switch (type) {
        case "兴趣点":
          query.queryPoint(value, 0, 1000).then(data => {
            data.items.forEach(item => {
              item.geo = KMap.Geometry.toWKT(
                new KMap.Point([item.x, item.y])
              );
              item.name = item.name || "";
              item.address = item.address || "";
              item.tel = item.tel || "";
            });
            return data;
          }).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        case "道路":
          query.queryRoad(value, 0, 100).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        case "行政区":
          query
            .queryGrid(value, "1", 0, 100).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        case "街道办":
          query
            .queryGrid(value, "2", 0, 100).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        case "社区":
          query
            .queryGrid(value, "3", 0, 100).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        case "工作网格":
          query
            .queryGrid(value, "4", 0, 100).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        case "单元网格":
          query
            .queryGrid(value, "5", 0, 100).then(this.showQueryTaskResults).catch(this.queryTaskErrorResults);
          break;
        default:
          console.log("未定义的查找的类型：" + searchType);
          return false;
      }
    },
    queryTaskErrorResults(err) {
      console.log(err);
      this.$Message.error("服务器故障无法完成查询");
    }
  }
};
