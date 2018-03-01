<script>
import mix from "./mix";

export default {
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
      ],
      treeData: [
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2" }]
        },
        {
          title: "root",
          children: [{ title: "node1" }, { title: "node2",
          children: [{ title: "node1" }, { title: "node2" }] }]
        }
      ]
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
