<script>
import { Switch } from "iview";
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import infoTemplate from "t/vehicle";

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
        result = "./static/img/car/car1" + suffix + suffix2 + ".png";
        break;
      case "皮卡车":
      case "皮卡":
        result = "./static/img/car/car2" + suffix + suffix2 + ".png";
        break;
      case "双排座":
      case "单排座":
        result = "./static/img/car/car3" + suffix + suffix2 + ".png";
        break;
      case "19污泥车":
      case "19号污泥车":
      case "21污泥车":
      case "21号污泥车":
      case "泥污车":
        result = "./static/img/car/car4" + suffix + suffix2 + ".png";
        break;
      case "洒水车":
        result = "./static/img/car/car5" + suffix + suffix2 + ".png";
        break;
      case "扫路车":
        result = "./static/img/car/car6" + suffix + suffix2 + ".png";
        break;
      case "打药车":
        result = "./static/img/car/car7" + suffix + suffix2 + ".png";
        break;
      case "轿车 ":
        result = "./static/img/car/car8" + suffix + suffix2 + ".png";
        break;
      default:
        result = "./static/img/car/car9" + suffix + suffix2 + ".png";
    }
  } else {
    result = "./static/img/car/car" + suffix + suffix2 + ".png";
  }
  return result;
}

export default {
  moduleName: "vehicle",
  layerId: "vehicle",
  label: "车辆",
  mixins: [mix, filter],
  data() {
    return {
      typeLabel: "刷新间隔",
      type: "300",
      typeList: [
        { value: "30", label: "30秒" },
        { value: "10", label: "10秒" },
        { value: "15", label: "15秒" },
        { value: "60", label: "1分钟" },
        { value: "300", label: "5分钟" }
      ],
      carNum: false,
      offLineCar: false,
      formAppend: (
        <div class="carSwitch">
          <Switch v-model={this.carNum} onOn-change={this.change} />
          <label>显示车牌号</label>
          <Switch v-model={this.offLineCar} onOn-change={this.change} />
          <label>显示离线车辆</label>
        </div>
      ),
      formAppendHeight: 24,
      infoTemplate
    };
  },
  methods: {
    change() {
      this.layer.forEach(g => {
        const { type, isOnLine } = g.getAttributes();
        const showCar = isOnLine || this.offLineCar;
        if (type == "carNum") {
          g.setVisible(this.carNum && showCar);
        } else {
          g.setVisible(showCar);
        }
      });
    },
    getResT(data) {
      return <p>{data.title}</p>;
    },
    async refresh() {
      this.filterData = [];
      const results = [...(await umservice.getAllCarsOnlineState())];
      const onlineMap = new Map();
      const offlineMap = new Map();
      let offlinesize = 0,
        onlineSize = 0;
      // 生成树和图上元素
      results.forEach(e => {
        const {
          gpsDevice,
          gpstime,
          id,
          speed,
          location,
          longitude,
          latitude,
          isOnLine
        } = e;
        const {
          pmidepartment: department,
          equipmentTypeStr,
          gpsName,
          person
        } = gpsDevice;
        // 分组(树的二级菜单)
        const groupName = department.name || "其它";
        // 附加属性
        const attr = {
          id,
          gpsName,
          speed,
          department: groupName,
          driver: person ? person.realname : "",
          phone: person ? person.mobile : "",
          Time: gpstime ? dateToStr(new Date(gpstime.time), " ") : "",
          location,
          isOnLine
        };
        // 图标(图上用和tree用)
        const sIcon = getIcon(equipmentTypeStr, isOnLine, true);
        const icon = getIcon(equipmentTypeStr, isOnLine);
        const label = isOnLine
          ? equipmentTypeStr.trim() ? equipmentTypeStr : "在线"
          : "离线";
        // 添加图例
        this.$store.commit("addLegend", { label, icon: sIcon });
        // 车辆
        const { graphic } = newGraphic({
          coord: [longitude, latitude],
          visible: false,
          symbol: new KMap.PictureMarkerSymbol({
            src: icon
          }),
          attr: {
            ...attr,
            type: "car"
          }
        });
        // 车牌号
        const { graphic: txtGraphic } = newGraphic({
          coord: [longitude, latitude],
          visible: false,
          symbol: new KMap.SimpleTextSymbol({
            text: gpsName,
            fill: [255, 0, 0],
            font: "12px sans-serif",
            offsetY: -15
          }),
          attr: {
            ...attr,
            type: "carNum"
          }
        });
        this.layer.add(graphic);
        this.layer.add(txtGraphic);
        // tree节点
        const node = {
          title: gpsName,
          icon: sIcon,
          iconStyle: "margin-right: 5px",
          graphic: () => graphic
        };
        const map = isOnLine ? onlineMap : offlineMap;
        !map.has(groupName) && map.set(groupName, []);
        map.get(groupName).push(node);
        this.filterData.push(node);
        // 总数统计
        isOnLine ? onlineSize++ : offlinesize++;
      });
      // 刷新可见性
      this.change();
      // tree数据
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
