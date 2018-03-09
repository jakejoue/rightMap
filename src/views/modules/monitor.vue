<script>
import mix from "./mix";

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
    }
  }
};
</script>

<style lang="less" scoped>

</style>
