<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import { infoTemplate } from "t/garden";

export default {
  moduleName: "garder",
  layerId: "garder",
  mixins: [mix, filter],
  data() {
    return {
      field: "name",
      filterField: ["name"],
      placeholder: "请输入编码",
      infoTemplate
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
