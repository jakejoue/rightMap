<script>
import { Switch } from "iview";
import mix from "./mixns/mix";

// map对象转json
function map2Json(/**@type {Map}*/ map) {
  const arr = [];
  map.forEach((value, key) => {
    arr.push({
      title: `${key}(${value.length})`,
      children: value
    });
  });
  return arr;
}

//获取不同类别的图标
function getIcon(type, bOnLine, bSmall = false) {
  var result = "";
  var suffix = bSmall ? "_s" : "";
  var suffix2 = bOnLine === 1 ? "_on" : "_off";
  if (bOnLine === 1) {
    switch (type) {
      case "中联中型作业车":
      case "中型货车":
      case "小型货车":
        result = "/static/img/car/car1" + suffix + suffix2 + ".png";
        break;
      case "皮卡车":
      case "皮卡":
        result = "/static/img/car/car2" + suffix + suffix2 + ".png";
        break;
      case "双排座":
      case "单排座":
        result = "/static/img/car/car3" + suffix + suffix2 + ".png";
        break;
      case "19污泥车":
      case "19号污泥车":
      case "21污泥车":
      case "21号污泥车":
      case "泥污车":
        result = "/static/img/car/car4" + suffix + suffix2 + ".png";
        break;
      case "洒水车":
        result = "/static/img/car/car5" + suffix + suffix2 + ".png";
        break;
      case "扫路车":
        result = "/static/img/car/car6" + suffix + suffix2 + ".png";
        break;
      case "打药车":
        result = "/static/img/car/car7" + suffix + suffix2 + ".png";
        break;
      case "轿车 ":
        result = "/static/img/car/car8" + suffix + suffix2 + ".png";
        break;
      default:
        result = "/static/img/car/car9" + suffix + suffix2 + ".png";
    }
  } else {
    result = "/static/img/car/car" + suffix + suffix2 + ".png";
  }
  return result;
}

export default {
  moduleName: "vehicle",
  label: "车辆",
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
      formAppend: (
        <div class="carSwitch">
          <Switch onOn-change={this.carNum} />
          <label>显示车牌号</label>
          <Switch onOn-change={this.offLineCar} />
          <label>显示离线车辆</label>
        </div>
      ),
      formAppendHeight: 26
    };
  },
  methods: {
    carNum(value) {
      console.log("carNum", value);
    },
    offLineCar(value) {
      console.log("carNum", value);
    },
    search(value) {},
    reset() {},
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
    },
    async refresh() {
      const results = [...(await umservice.getAllCarsOnlineState())];
      const onlineMap = new Map();
      const offlineMap = new Map();
      let offlinesize = 0,
        onlineSize = 0;
      console.log(results[0]);
      results.forEach(e => {
        e.isOnLine ? onlineSize++ : offlinesize++;
        const gpsDevice = e.gpsDevice;
        const department = gpsDevice.pmidepartment;
        // 分组(树的二级菜单)
        const groupName = department.name || "其它";

        const { graphic } = newGraphic({
          coord: [e.longitude, e.latitude],
          visible: !!e.isOnLine
        });

        const node = {
          title: e.gpsDevice.gpsName,
          icon: getIcon(gpsDevice.equipmentType, e.isOnLine, true)
        };
        let map = e.isOnLine ? onlineMap : offlineMap;
        !map.has(groupName) && map.set(groupName, []);
        map.get(groupName).push(node);
      });

      this.treeData = [
        {
          title: `在线(${onlineSize})`,
          children: map2Json(onlineMap)
        },
        {
          title: `离线(${offlinesize})`,
          children: map2Json(offlineMap)
        }
      ];
    }
  }
};
</script>

<style lang="less" scoped>
div.carSwitch {
  margin: 2px 0;
  > * {
    vertical-align: middle;
  }
  label {
    margin: 0 10px 0 3px;
  }
}
</style>
