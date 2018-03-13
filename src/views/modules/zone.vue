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
    }
  },
  mounted() {
    this.treeData = transform(configData.districtTree);
  }
};
</script>

<style lang="less" scoped>

</style>
