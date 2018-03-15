<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import transform from "./mixns/transform";
import queryGrid from "./mixns/queryGrid";

export default {
  moduleName: "zone",
  mixins: [mix, queryGrid, filter],
  data() {
    return {
      field: "name",
      filterField: ["name"]
    };
  },
  methods: {
    getResT(data) {
      return <p>{data.name}</p>;
    },
    treeClick({ name: value, layerName: type }) {
      map.getGraphics().forEach(function(g) {
        var attributes = g.getAttributes();
        if (
          attributes &&
          attributes.hasOwnProperty("Name") &&
          attributes.Name === "extent"
        ) {
          map.getGraphics().remove(g);
        }
      });
      this.queryGrid(type, value);
    },
    showQueryTaskResults(results) {
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

        centerShow({ graphic });
      }
    },
    select({ target }) {
      this.treeClick(target);
    }
  },
  mounted() {
    this.filterData = configData.districtTree;
    this.treeData = transform(configData.districtTree);
  }
};
</script>

<style lang="less" scoped>

</style>
