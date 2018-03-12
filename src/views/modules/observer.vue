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
    // 后台请求进行数据刷新
    refresh() {
      umservice.findAllOnLineObserverJson().then(data => {
        const online = [];
        const offline = [];
        data.forEach(e => {
          e.title = e.realName;
          e.status ? online.push(e) : offline.push(e);
        });
        this.treeData = [
          {
            title: `在线(${online.length})`,
            children: online
          },
          {
            title: `离线(${offline.length})`,
            children: offline
          }
        ];
      });
    }
  }
};
</script>

<style lang="less" scoped>

</style>
