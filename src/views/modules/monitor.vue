<script>
import mix from "./mix";

export default {
  mixins: [mix],
  data() {
    return {
      treeData: []
    };
  },
  methods: {
    search(value) {
    },
    reset() {
      this.data = [];
    },
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
