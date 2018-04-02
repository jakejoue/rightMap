<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import { infoTemplate } from "t/garden";

export default {
  moduleName: "uva",
  layerId: "uva",
  mixins: [mix, filter],
  data() {
    return {
      field: "name",
      filterField: ["name"],
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
