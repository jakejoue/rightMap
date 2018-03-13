<script>
import mix from "./mix";
import transform from "./transform";

export default {
  moduleName: "zone",
  mixins: [mix],
  data() {
    return {
      field: "name"
    };
  },
  methods: {
    search(value) {},
    reset() {},
    getResT(data) {
      return (
        <div>
          <p>{data.name}</p>
          <p>{data.description}</p>
        </div>
      );
    },
    treeClick({ name, deep }) {
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
      query.queryGrid(name, deep).then(results => {
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

          centerShow({
            show: false,
            graphic
          });
        }
      });
    }
  },
  mounted() {
    this.treeData = transform(configData.districtTree);
  }
};
</script>

<style lang="less" scoped>

</style>
