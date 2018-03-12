<script>
import mix from "./mix";
//样式(兴趣点，线，面样式)
const POINT = new KMap.PictureMarkerSymbol({
  anchor: [0.5, 1],
  src: "static/img/point_32.png"
});
const MULTILINESTRING = new KMap.SimpleLineSymbol({
  stroke: [160, 0, 66, 0.8],
  width: 3
});
const MULTIPOLYGON = new KMap.SimpleFillSymbol({
  stroke: MULTILINESTRING,
  fill: [98, 194, 204, 0.5]
});
// 查询结果字段和字段名称
const configs = {
  兴趣点: {
    type: POINT,
    field: {
      名称: "name",
      地址: "address"
    }
  },
  道路: {
    type: MULTILINESTRING,
    field: {
      名称: "name"
    }
  },
  社区: {
    type: MULTIPOLYGON,
    field: {
      名称: "name",
      编码: "code",
      面积: "area"
    }
  },
  街道办: {
    type: MULTIPOLYGON,
    field: {
      名称: "name",
      编码: "code",
      面积: "area"
    }
  },
  行政区: {
    type: MULTIPOLYGON,
    field: {
      名称: "name",
      编码: "code",
      面积: "area"
    }
  },
  工作网格: {
    type: MULTIPOLYGON,
    field: {
      名称: "name",
      面积: "area"
    }
  },
  单元网格: {
    type: MULTIPOLYGON,
    field: {
      编码: "code",
      面积: "area"
    }
  }
};

// 生成infoTemplate
function getInfoTemplateByType(type) {
  const infoTemplate = new KMap.InfoTemplate();
  const templateSet = configData.infoTemplateSet;
  const temp = templateSet.filter(e => {
    return e.aliasName == type;
  })[0];
  let content = "<ul>";
  temp.template.forEach(e => {
    content += "<li><b>" + e.alias + "：</b>${" + e.name + "}</li>";
  });
  content += "</ul>";
  infoTemplate.setTitle("${name}");
  infoTemplate.setContent(content);
  return infoTemplate;
}

export default {
  moduleName: "search",
  mixins: [mix],
  data() {
    return {
      tip: "使用上面的查询框，根据名称来查询要素。",
      splitLine: false,
      type: "兴趣点",
      typeList: [
        { value: "兴趣点", label: "兴趣点" },
        { value: "道路", label: "道路" },
        { value: "社区", label: "社区" },
        { value: "街道办", label: "街道办" },
        { value: "行政区", label: "行政区" },
        { value: "工作网格", label: "工作网格" },
        { value: "单元网格", label: "单元网格" }
      ],
      page: true,
      showTotal: true,
      hasTree: false,
      config: {}
    };
  },
  methods: {
    typeChange() {
      this.$refs.cSearch.focus();
    },
    pageChange({ pageData }) {
      this.layer.clear();
      pageData.forEach(e => {
        this.layer.add(e.target.graphic);
      });
    },
    search(value) {
      this.loading(true, "正在查询...");
      switch (this.type) {
        case "兴趣点":
          query
            .queryPoint(value, 0, 1000)
            .then(data => {
              data.items.forEach(item => {
                item.geo = KMap.Geometry.toWKT(
                  new KMap.Point([item.x, item.y])
                );
                item.name = item.name || "";
                item.address = item.address || "";
                item.tel = item.tel || "";
              });
              return data;
            })
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        case "道路":
          query
            .queryRoad(value, 0, 100)
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        case "行政区":
          query
            .queryGrid(value, "1", 0, 100)
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        case "街道办":
          query
            .queryGrid(value, "2", 0, 100)
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        case "社区":
          query
            .queryGrid(value, "3", 0, 100)
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        case "工作网格":
          query
            .queryGrid(value, "4", 0, 100)
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        case "单元网格":
          query
            .queryGrid(value, "5", 0, 100)
            .then(this.showQueryTaskResults)
            .catch(this.queryTaskErrorResults);
          break;
        default:
          console.log("未定义的查找的类型：" + searchType);
          return false;
      }
    },
    reset() {
      this.layer.clear();
    },
    getResT(data) {
      return (
        <div style={{ minHeight: "50px", fontSize: "14px" }}>
          {Object.keys(this.config.field).map(e => {
            return (
              <p>
                {e}：{data[this.config.field[e]]}
              </p>
            );
          })}
        </div>
      );
    },
    showQueryTaskResults(results) {
      this.config = configs[this.type];
      const render = new KMap.SimpleRenderer(this.config.type);
      this.layer.setRenderer(render);
      this.layer.setInfoTemplate(getInfoTemplateByType(this.type));
      this.data = results.items.map(e => {
        const graphic = new KMap.Graphic();
        const g = KMap.Geometry.fromWKT(e.geo);
        graphic.setGeometry(g);
        graphic.setAttributes(e);
        e.graphic = graphic;
        return e;
      });
      this.loading(false);
      if (!results.total) {
        this.$Message.info("没有查询到任何结果");
      }
    },
    queryTaskErrorResults(err) {
      console.log(err);
      this.$Message.error("服务器故障无法完成查询");
    }
  }
};
</script>

<style lang="less" scoped>

</style>
