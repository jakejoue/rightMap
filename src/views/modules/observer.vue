<script>
import mix from "./mix";

export default {
  moduleName: "observer",
  label: "巡查员",
  mixins: [mix],
  data() {
    return {
      typeLabel: "刷新间隔",
      type: "30",
      typeList: [
        { value: "30", label: "30秒" },
        { value: "10", label: "10秒" },
        { value: "15", label: "15秒" },
        { value: "60", label: "60秒" },
        { value: "300", label: "300秒" }
      ]
    };
  },
  methods: {
    search(value) {
      this.data = [];
    },
    reset() {},
    getResT(data) {
      return (
        <div>
          <p>{data.name}</p>
          <p>{data.description}</p>
        </div>
      );
    },
    typeChange(value) {
      console.log(value);
    }
  }
};
</script>

<style lang="less" scoped>

</style>
