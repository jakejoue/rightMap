<script>
import { Switch } from "iview";
import mix from "./mix";

export default {
  moduleName: 'vehicle',
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
      treeData: [],
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
