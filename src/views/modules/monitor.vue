<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import { infoTemplate } from "t/monitor.js";

function getNodeIcon(type, small = false) {
  var result = "./static/img/monitor/";
  switch (parseInt(type)) {
    case 1:
      result += `monitor1${small ? "_s" : ""}.png`;
      break;
    case 2:
      result += `monitor2${small ? "_s" : ""}.png`;
      break;
    case 3:
      result += `monitor3${small ? "_s" : ""}.png`;
      break;
    default:
      result += `monitor1${small ? "_s" : ""}.png`;
      break;
  }
  return result;
}

export default {
  moduleName: "monitor",
  layerId: "monitor",
  label: "视频监控",
  mixins: [mix, filter],
  data() {
    return {
      field: "name",
      infoTemplate,
      filterField: ["name"]
    };
  },
  methods: {
    getResT(data) {
      return <p>{data.name}</p>;
    }
  },
  async mounted() {
    const { list } = await umservice.getMonitorPage();
    const data = [];
    list.forEach(probe => {
      const { type, x = 0, y = 0 } = probe;

      const icon = getNodeIcon(type);
      const sicon = getNodeIcon(type, true);

      const { graphic } = newGraphic({
        coord: [x, y],
        symbol: new KMap.PictureMarkerSymbol({
          src: icon
        }),
        attr: probe
      });
      this.layer.add(graphic);

      data.push({
        ...probe,
        icon: sicon,
        iconStyle: "margin-right: 5px",
        graphic: () => graphic
      });
    });
    this.filterData = data;
    this.treeData = [
      {
        name: "视频监控",
        children: data
      }
    ];
  }
};
</script>

<style lang="less" scoped>

</style>
