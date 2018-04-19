//轨迹播放基类
class Track {
  constructor(name = "") {
    this.name = name;
  };
  //实际上的入口
  initTrack({
    map, //地图
    layer, //图层
    path = [], //路径
    lineSymbol, //路径样式
    dyLineSymbol, //动态线样式
    // 以下方法为回掉函数，不要重写
    play = () => {},
    pause = () => {},
    update = () => {},
    stop = () => {},
    defaultSpeed = 2,
    coordType = 0, //地理坐标系
    zoomLevel = (configData.maxZoom - 2) //播放时缩放级别
  }) {
    this.map = map;
    this.layer = layer;
    this.zoomLevel = zoomLevel;
    // 完整线
    this.line = newGraphic({
      coord: path,
      type: "POLYLINE",
      symbol: lineSymbol
    });
    this.line.geometry.calcAble(true);
    this.line.geometry.setCoordType(coordType);
    //动态线
    this.dyLine = newGraphic({
      type: "POLYLINE",
      symbol: dyLineSymbol
    });
    //方向
    this.backWard = false;
    //速度
    this.speed = this.forWardSpeed = this.backWardSpeed = defaultSpeed;
    //轨迹类
    this.contrail = new KMap.Contrail("", {
      line: this.line.geometry,
      speed: defaultSpeed
    });
    //初始化图层和相关元素
    this.map.addGraphicsLayer(this.layer);
    this.layer.add(this.line.graphic);
    this.layer.add(this.dyLine.graphic);
    //一些回掉函数
    this.callBack_ = {
      play,
      pause,
      update,
      stop
    };
    //地图缩放到默认级别和中心点
    this.map.centerAndZoom(path[0][0], this.zoomLevel);
  };
  //播放
  play() {
    this.callBack_.play(this);
    this.contrail.start();
    this.update_();
  };
  //更新
  update_() {
    if (this.contrail) {
      if (!this.contrail.isFinished() && this.contrail.getState() == 1) {
        //更新规矩类
        this.contrail.update();
        //更新动态线
        this.dyLine.geometry.setCoordinates(this.contrail.getActivePath());
        //判断线路是否超出地图区域（判断是否跟新地图中心点）
        var extent = KMap.Extent.expand(this.map.getExtent(), 0.9);
        if (!KMap.Extent.contains(extent, new KMap.Point(this.getCurPoint()))) {
          this.map.setCenter(this.getCurPoint());
        }
        //回掉函数（便于跟新其他元素）
        this.callBack_.update(this);
        //判断是否进行下一次更新
        if (!this.contrail.isFinished() && this.contrail.getState() == 1) {
          setTimeout(() => { this.update_() }, 5);
        } else {
          this.pause();
        }
      } else {
        this.pause();
      }
    }
  };
  //暂停
  pause() {
    this.callBack_.pause(this);
    this.contrail.pause();
  };
  //停止(对象销毁)
  stop() {
    this.callBack_.stop(this);
    this.contrail.pause();
    this.contrail = null;
    this.line = null;
    this.dyLine = null;
    this.layer.clear();
    this.map.removeGraphicsLayer(this.layer);
  };
  /**
   * 播放方向（正方或者倒放）
   * 正方为true，倒放为false
   * @param {boolen} dir 
   */
  setDirection(dir) {
    this.backWard = !dir;
    this.contrail.setBackword(this.backWard);
  };
  //获取当前的前进方向(path的)
  getPathDirection() {
    return this.contrail.getDirection();
  };
  //获取速度
  getSpeed() {
    return this.speed;
  };
  /**
   * 设置速度
   * @param {number} speed 
   */
  setSpeed(speed) {
    if (this.backWard) {
      this.setDirection(false);
      this.speed = this.backWardSpeed = speed;
    } else {
      this.setDirection(true);
      this.speed = this.forWardSpeed = speed;
    }
    this.contrail.setSpeed(speed);
  };
  //设置百分百
  setPercent(percent) {
    this.contrail.setPercent(percent);
  };
  //获取百分百
  getPercent() {
    return this.contrail.getPercent();
  };
  //获取当前基准点
  getCurPoint() {
    return this.contrail.getPosition();
  };
  getCurIndex() {
    return this.contrail.getIndex();
  };
  //滑动条操作回掉函数
  beforeSet() {
    this.pause();
  };
  setProgress(value) {
    this.setPercent(value);
    this.play();
  };
};

/**
 * 线段抽稀
 * @param {Array.<object>} path 处理前数据
 * @param {{x:string, y:string, em:number}} opts x，y字段名称，em抽吸程度（默认为 0）
 */
function simplyPath(path = null, { x = 'x', y = 'y', em = 0 }) {
  if (!path) return path;
  // 去除不在图幅范围内的点
  path = path.filter(e => {
    return KMap.Extent.contains(configData.extent, [e[x], e[y]]);
  });
  if (path.length < 5) {
    return path;
  };

  var startIdx = 0;
  var endIdx = path.length - 1;

  var stack = [];
  stack.push([startIdx, endIdx]);

  while (stack.length > 0) {
    var stackEle = stack.shift();
    var startIndex = stackEle[0];
    var endIndex = stackEle[1];
    var size = endIndex - startIndex + 1;
    if (size < 3) {
      path[startIndex]['save'] = true;
      path[endIndex]['save'] = true;
      continue;
    }

    var maxLength = 0;
    var index = startIndex;

    var p1 = path[startIndex];
    var p2 = path[endIndex];
    var A, B, C;
    A = p2[y] - p1[y];
    B = p1[x] - p2[x];
    C = p2[x] * p1[y] - p1[x] * p2[y];

    for (var i = startIndex + 1; i < endIndex; i++) {
      //计算距离
      var lenght = 0;
      var p = path[i];
      if (p1[x] == p2[x]) {
        lenght = Math.abs(p[x] - p1[x]);
      } else if (p1[y] == p2[y]) {
        lenght = Math.abs(p[y] - p1[y]);
      } else {
        lenght = Math.abs((A * p[x] + B * p[y] + C) / Math.sqrt(A * A + B * B));
      }
      if (maxLength <= lenght) {
        maxLength = lenght;
        index = i;
      }
    }
    //当线段种所有的点到基准线的距离都小于em时候
    if (maxLength <= em) {
      path[startIndex]['save'] = true;
      path[endIndex]['save'] = true;
      if (maxLength != 0) {
        path[index]['save'] = true;
      }
    } else {
      stack.push([startIndex, index]);
      stack.push([index, endIndex]);
    }
  };
  var line = [];
  path.forEach(function(e) {
    if (e['save']) {
      delete e['save'];
      line.push(e);
    }
  });
  return line;
};

/**
 * 获取虚线路径
 * @param {Array.<KMap.Point>} pointPath 
 * @param {Array.<String>} timeArray
 * @param {String} timeFieldName 
 * @param {Number} tdis 
 */
function getGuseePath(pointPath, timeArray, timeFieldName = 'time', tdis = 120) {
  var guessTrack = []; //所有path
  var sP = null, //path开始点
    eP = null, //path结束点
    p1 = null,
    p2 = null,
    dis = null;
  for (var i = 0; i < timeArray.length - 1; i++) {
    p1 = timeArray[i][timeFieldName];
    p2 = timeArray[i + 1][timeFieldName];
    if (!p1 || !p2) {
      continue;
    }
    if (sP == null) {
      sP = i;
    }
    dis = (new Date(p2) - new Date(p1)) / 1000;
    //判断终点
    if (dis <= 0) {
      continue
    } else if (dis > tdis) {
      eP = i + 1;
      guessTrack.push([sP, eP]);
      sP = i + 1;
      eP = null;
      continue;
    } else {
      sP = i + 1;
      continue;
    }
  };
  guessTrack = guessTrack.map(function(e) {
    var start = e[0];
    var end = e[1];
    var path = [];
    for (var i = start; i <= end; i++) {
      path.push(pointPath[i]);
    }
    return path;
  });
  var guessGraphic = new KMap.Graphic();
  if (guessTrack.length > 0) {
    var guessLine = new KMap.Polyline();
    guessTrack.forEach(function(path) {
      guessLine.addPath(path);
    });
    guessGraphic.setGeometry(guessLine);
  }
  return guessGraphic;
};
export { Track, simplyPath, getGuseePath };
