<script>
import mix from "./mix";

export default {
  moduleName: "comp",
  mixins: [mix],
  data() {
    return {
      placeholder: "请输入部件编码",
      treeCheckable: true
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
    query.getComplayerInfo().then(data => {
      this.treeData = data.items.map(e => {
        return {
          title: e.name,
          children: e.layers.map(a =>
            Object.assign(a, {
              title: a.name,
              icon: `static/img/comp/${a.symbol}`
            })
          )
        };
      });
    });
  }
};
</script>

<style lang="less" scoped>

</style>
