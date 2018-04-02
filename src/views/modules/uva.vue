<script>
import mix from "./mixns/mix";
import filter from "./mixns/filter";
import { infoTemplate } from "t/garden";

export default {
  moduleName: "uva",
  layerId: "uva",
  mixins: [mix, filter],
  data() {
    return {
      field: "name",
      filterField: ["name"],
      infoTemplate,
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
    getResT(data) {
      return <p>{data.name}</p>;
    },
    refresh() {
      const online = [];
      const offline = [];
      action.getAllUVA().then(uavs => {
        this.layer.clear();
        this.filterData = [];
        for (var i = 0; i < uavs.length; i++) {
          uav = uavs[i];
          var date = new Date();
          var attr = {};
          attr.markId = uav.markId;
          attr.model = uav.model;
          attr.direction = uav.direction;
          uav.isOnline = uav.online || uav.isOnline || uav.isOnLine;
          attr.isOnline = uav.isOnline === 1 ? "在线" : "离线";
          attr.x_speed = uav.x_speed;
          attr.y_speed = uav.y_speed;
          attr.z_speed = uav.z_speed;
          attr.longitude = parseFloat(uav.latitude) || 0;
          attr.latitude = parseFloat(uav.longitude) || 0;
          attr.pmiUser = uav.pmiUser;
          date.setTime(uav.produ_date.time);
          attr.produ_date = dateToStr(date, " ");
          date.setTime(uav.pda_time.time);
          attr.pda_time = dateToStr(date, " ");
          date.setTime(uav.create_time.time);
          attr.create_time = dateToStr(date, " ");
          attr.Id = uav.id;
          attr.height = uav.height;
          attr.manu = uav.manu;
          attr.note = uav.note;
          //
          const { graphic } = newGraphic({
            coord: [attr.longitude, attr.latitude],
            attr,
            symbol: new KMap.PictureMarkerSymbol({
              anchor: [0.5, 1],
              src: `./static/img/uva25_${attr.isOnline ? "on" : "off"}.png`
            })
          });
          this.layer.add(graphic);
          this.filterData.push({
            name: attr.markId
          });
          const children = attr.isOnline ? online : offline;
          children.push({
            name: attr.markId,
            graphic: () => graphic,
            icon: `./static/img/uva25_${attr.isOnline ? "on" : "off"}.png`
          });
        }
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
