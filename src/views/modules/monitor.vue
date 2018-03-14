<script>
import mix from "./mixns/mix";

export default {
  moduleName: "monitor",
  label: "视频监控",
  mixins: [mix],
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
    async refresh() {
      const results = await umservice.getMonitorPage();
      console.log(results);
    }
  }
};
</script>

<style lang="less" scoped>

</style>
