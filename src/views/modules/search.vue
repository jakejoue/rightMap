<script>
import mix from "./mix";

export default {
  moduleName: 'search',
  mixins: [mix],
  data() {
    return {
      tip: '使用上面的查询框，根据名称来查询要素。',
      splitLine: false,
      type: "兴趣点",
      typeList: [
        { value: "兴趣点", label: "兴趣点" },
        { value: "道路", label: "社区" },
        { value: "街道办", label: "街道办" },
        { value: "行政区", label: "行政区" },
        { value: "工作网格", label: "工作网格" },
        { value: "单元网格", label: "单元网格" }
      ],
      page: true,
      showTotal: true,
    };
  },
  methods: {
    search(value) {
      this.data = [
        {
          name: "titleA",
          description: "哈哈哈哈哈哈"
        },
        {
          name: "titleB",
          description: "啊啊啊啊啊啊"
        },
        {
          name: "titleC",
          description: "哇哇哇哇哇哇"
        },
        {
          name: "titleA",
          description: "哈哈哈哈哈哈"
        },
        {
          name: "titleB",
          description: "啊啊啊啊啊啊"
        },
        {
          name: "titleC",
          description: "哇哇哇哇哇哇"
        },
        {
          name: "titleA",
          description: "哈哈哈哈哈哈"
        },
        {
          name: "titleB",
          description: "啊啊啊啊啊啊"
        },
        {
          name: "titleC",
          description: "哇哇哇哇哇哇"
        },
        {
          name: "titleA",
          description:
            "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }
      ];
    },
    reset() {
      this.data = [];
    },
    getResT(data) {
      return (
        <div>
          <p>{ data.name }</p>
          <p>{ data.description }</p>
        </div>
      );
    }
  }
};
</script>

<style lang="less" scoped>

</style>
