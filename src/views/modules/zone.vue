<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import getTreeJson from "./mixns/getTreeJson";
import { queryGrid, addZoneToMap } from "./mixns/queryGrid";

export default {
  moduleName: "zone",
  mixins: [mix, filter],
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
    treeClick({ code: value, layerName: type }) {
      clearGraphicsByName("extent");
      queryGrid(type, value)
        .then(addZoneToMap)
        .catch(err => {
          this.loading(false);
          console.log(err);
          this.data = [];
          this.$Message.error("服务器故障无法完成查询");
        });
    },
    select({ target }) {
      this.treeClick(target);
    }
  },
  mounted() {
    this.filterData = configData.districtTree;
    this.treeData = getTreeJson(configData.districtTree);
  }
};
</script>

<style lang="less" scoped>

</style>
