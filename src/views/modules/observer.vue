<script>
import mix from "./mix";

const onlineSymbol = new KMap.PictureMarkerSymbol({
  anchor: [0.5, 1],
  src: "static/img/tracker_online25.png"
});
const offlineSymbol = new KMap.PictureMarkerSymbol({
  anchor: [0.5, 1],
  src: "static/img/tracker_offline25.png"
});

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
      ],
      field: "realName"
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
        this.layer.clear();
        const online = [];
        const offline = [];
        // 遍历
        data.forEach(e => {
          // 新建图形
          const { graphic } = newGraphic({
            coord: [e.latitude, e.longitude],
            symbol: e.status ? onlineSymbol : offlineSymbol,
            attr: e,
            visible: !!e.status
          });
          // 写成方法避免框架循环栈溢出
          const node = {
            realName: e.realName,
            icon: e.status
              ? "static/img/tracker_online25.png"
              : "static/img/tracker_offline25.png",
            graphic: () => graphic
          };
          this.layer.add(graphic);
          e.status ? online.push(node) : offline.push(node);
        });
        this.treeData = [
          {
            realName: `在线(${online.length})`,
            children: online
          },
          {
            realName: `离线(${offline.length})`,
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
