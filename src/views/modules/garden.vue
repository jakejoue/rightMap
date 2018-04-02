<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";

export default {
  moduleName: "garder",
  layerId: "monitor",
  mixins: [mix, filter],
  data() {
    return {
      field: "name",
      filterField: ["name"],
      placeholder: "请输入编码"
    };
  },
  methods: {
    getResT(data) {
      return <p>{data.name}</p>;
    }
  },
  async mounted() {}
};
</script>
