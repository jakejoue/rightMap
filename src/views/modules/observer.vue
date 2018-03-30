<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import { infoTemplate } from "t/observer";

const onlineSymbol = new KMap.PictureMarkerSymbol({
  anchor: [0.5, 1],
  src: "./static/img/tracker_online25.png"
});
const offlineSymbol = new KMap.PictureMarkerSymbol({
  anchor: [0.5, 1],
  src: "./static/img/tracker_offline25.png"
});

export default {
  moduleName: "observer",
  layerId: "observer",
  label: "巡查员",
  mixins: [mix, filter],
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
      field: "name",
      filterField: ["name"],
      infoTemplate
    };
  },
  methods: {
    getResT(data) {
      return <p>{data.name}</p>;
    },
    // 后台请求进行数据刷新
    async refresh() {
      this.filterData = [];
      const data = await umservice.findAllOnLineObserverJson();

      this.layer.clear();
      const online = [];
      const offline = [];
      // 遍历
      data.forEach(e => {
        // 用到的字段
        const {
          id,
          realName: name,
          sex,
          mobile,
          gpstime,
          isOnline,
          longitude,
          latitude
        } = e;

        // 属性
        const attr = {
          id,
          name,
          sex: sex == 0 ? "未知" : sex === 1 ? "男" : "女",
          state: isOnline == 1 ? "在线" : "离线",
          mobile,
          timeStr: gpstime ? dateToStr(new Date(gpstime.time), " ") : ""
        };
        // 新建图形
        const { graphic } = newGraphic({
          coord: [longitude, latitude],
          symbol: isOnline ? onlineSymbol : offlineSymbol,
          attr,
          visible: !!isOnline
        });
        // 写成方法避免框架循环栈溢出
        const node = {
          name,
          icon: isOnline
            ? "./static/img/tracker_online25.png"
            : "./static/img/tracker_offline25.png",
          graphic: () => graphic
        };
        this.layer.add(graphic);
        e.isOnline ? online.push(node) : offline.push(node);
        this.filterData.push(node);
      });
      this.treeData = [
        {
          name: `在线(${online.length})`,
          children: online
        },
        {
          name: `离线(${offline.length})`,
          children: offline
        }
      ];
    }
  }
};
</script>

<style lang="less" scoped>

</style>
