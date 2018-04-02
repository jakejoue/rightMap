import Axios from "axios";

class Action {
  constructor(path) {
    this.axios = Axios.create({
      baseURL: path
    });
  };
  // 车辆信息
  getCars() {
    return this.getData(`supervision/queryForMap!getAllCarsOnlineState.action?id=${user_id}&timestamp=${timestamp()}`);
  };
  // 视频监控
  getMonitors() {
    return this.getData(`monitor/MonitorAction!listData.action?start=0&limit=9999&timestamp=${timestamp()}`);
  };
  // 无人机
  getAllUVA() {
    return this.getData("supervision/queryForMap!findAllUva.action");
  };
  // get
  getData(url, options) {
    return this.axios.get(url).then(({ data }) => data);
  };
}

export default Action;
