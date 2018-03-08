<script>
import mix from "./mix";

export default {
  moduleName: 'comp',
  mixins: [mix],
  data() {
    setTimeout(() => {
      this.treeData = [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                  attr: "d"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ];
    }, 2000);
    return {
      placeholder: "请输入部件编码",
      treeData: [],
      treeCheckable: true
    };
  },
  methods: {
    search(value) {},
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
