import { Track, simplyPath, getGuseePath } from './Track'

class carTrack extends Track {
  constructor({
    play = () => {},
    pause = () => {},
    update = () => {},
    stop = () => {},
    error = () => {},
    initSuccess = () => {} //正确初始化后调用
  }) {
    super("carTrack");

    this.LONOFFECT = configData.offset ?
      configData.offset.longitude : 0;
    this.LATOFFECT = configData.offset ?
      configData.offset.latitude : 0;

    this.server = gpsService;

    //车辆
    this.car = null;
    this.carG = null;
    this.carTxt = null;

    this.isEHome = null;

    //时间段
    this.sTime = null;
    this.eTime = null;

    //轨迹
    this.path = [];
    this.attr = [];
    this.alarmSum = 0;
    //报警点是否已经加载过（避免重复请求）
    this.alarmLoaded = false;

    //回掉函数
    this.callBack = {
      play,
      pause,
      update: e => {
        e.carG.geometry.setCoordinates(e.getCurPoint());
        e.carG.symbol.setRotation(-e.getPathDirection());
        e.carTxt.geometry.setCoordinates(e.getCurPoint());
        e.carTxt.symbol.setText(e.attr[e.getCurIndex()].time.replace(" ", "\r\n"));
        update(e, this.updateAttr());
      },
      stop: e => {
        e.carG = null;
        e.carTxt = null;
        e.path = null;
        stop(e);
      }
    };
    //查询出错回掉函数
    this.error = error;
    //正确初始化后函数
    this.initSuccess = initSuccess;
  };
  /**
   * @api
   * @param {KMap.Graphic} car 
   */
  setTarget(car) {
    this.car = car;
    this.isEHome = car.getAttributes('ehome_flag');
  };
  /**
   * @api
   * @param {string} sTime 
   * @param {string} eTime 
   */
  setTime(sTime, eTime) {
    this.sTime = sTime;
    this.eTime = eTime;
  };
  /**
   * @api
   */
  playTrack() {
    const config = {
      sTime: this.sTime,
      eTime: this.eTime,
      carId: this.car.getAttribute('id')
    };
    this.getTrackLength(config);
  };
  //判断轨迹存在
  async getTrackLength(config) {
    let count = await this.server.findTrackLogLength(config).catch(err => {
      this.error();
      throw err;
    });
    count = parseInt(count, 10);
    if (count === 0) {
      this.error("未查询到轨迹数据");
      return;
    } else {
      let start = 0;
      this.path = [];
      this.attr = [];
      do {
        let results = await this.server.findTrackLogsWithParamsJson(config, start, 800).catch(err => {
          this.error();
          throw err;
        });
        this.path[results['currentPage']] = results.rows;
        start++;
      } while (start * 800 < count);
      this.collectTrack();
    }
  };
  //获取轨迹数据
  collectTrack(start, pageSize, opts) {
    //合并和重复点删除
    this.path = [].concat(...this.path);
    this.path = simplyPath(this.path, { x: 'longitude', y: 'latitude' });
    if (!this.path.length) {
      this.error("未查询到轨迹数据");
      return;
    }
    //遍历出需要的属性
    this.path = this.path.map(ele => {
      let recordTime = new Date();
      let timeStr = "";
      if (typeof ele.gpstime === "object") {
        recordTime.setTime(ele.gpstime.time);
        timeStr = dateToStr(recordTime, ' ');
      } else {
        timeStr = ele.gpstime;
      }
      if (ele.alarm === 1) {
        this.alarmSum += 1;
      }
      let x = ele['longitude'] + this.LONOFFECT;
      let y = ele['latitude'] + this.LATOFFECT;
      this.attr.push({
        gpstime: ele.gpstime,
        time: timeStr,
        direction: ele.direction,
        speed: ele.speed,
        statusString: ele.statusString || "",
        alarm: this.alarmSum,
        longitude: x,
        latitude: y
      });
      return [x, y];
    });
    this.handleTrack([this.path]);
  };
  //处理轨迹数据
  handleTrack(path) {
    this.map = map;
    this.layer = new KMap.GraphicsLayer("carTrackLayer");

    //车辆图标
    this.carG = newGraphic({
      coord: path[0][0],
      symbol: new KMap.PictureMarkerSymbol({
        src: './static/img/track-0.png'
      })
    });
    //车辆信息图标
    this.carTxt = newGraphic({
      coord: path[0][0],
      symbol: new KMap.SimpleTextSymbol({
        text: this.attr[0].time.replace(" ", "\r\n"),
        fill: [128, 0, 0],
        font: '12px sans-serif',
        offsetX: 0,
        offsetY: -30
      })
    })
    this.layer.add(this.carG.graphic);
    this.layer.add(this.carTxt.graphic);
    //初始化轨迹
    this.initTrack(Object.assign({
      map: this.map,
      layer: this.layer,
      path: path,
      coordType: 1,
      lineSymbol: new KMap.SimpleLineSymbol({
        stroke: [255, 102, 102, 1],
        width: 5
      }),
      dyLineSymbol: new KMap.SimpleLineSymbol({
        stroke: [0, 153, 254, 0.6],
        width: 5
      })
    }, this.callBack));
    const guessG = getGuseePath(path[0], this.attr);
    guessG.setSymbol(
      new KMap.SimpleLineSymbol({
        stroke: [0, 255, 0],
        width: 5,
        lineDash: [18, 10]
      })
    );
    this.layer.add(guessG);
    this.initSuccess(this);
  };
  updateAttr() {
    let acc, bLocate, alarmStr;
    const info = this.attr[this.getCurIndex()];

    let directionStr, speedStr;
    directionStr = getDirectionStr(info.direction);
    speedStr = parseFloat(info.speed).toFixed(2) + "Km/h";

    if (this.isEHome) {
      acc = bLocate = alarmStr = "未知";
    } else {
      acc = info.statusString[31];
      acc = acc ? ((acc === "1") ? "开" : "关") : "未知";
      bLocate = info.statusString[30];
      bLocate = bLocate ? ((bLocate === "1") ? "是" : "否") : "未知";
      alarmStr = info.alarm + "/" + this.alarmSum;
    }
    return { time: info.time, acc, bLocate, alarmStr, directionStr, speedStr };
  };
  /**
   * 显示滞留点
   * @param {number} timeLimit 
   */
  showRetentionPoint(timeLimit) {
    this.layer.forEach(g => {
      const alarmRetention = g.getAttribute('alarmRetention');
      if (alarmRetention) {
        this.layer.remove(g);
      }
    });
    if (timeLimit) {
      const timeFlag = timeLimit * 60000;
      const retentionArr = [];
      let startTime = null,
        lastItem = null;
      let alarm = null,
        startTimeStr = "",
        endTimeStr = "",
        geometry = null,
        gc = null,
        lat, lon, date;
      this.attr.forEach(item => {
        if (item.speed === 0) {
          if (!startTime) {
            startTime = item.gpstime;
          }
          if (item.gpstime.time - startTime.time >= timeFlag) {
            lastItem = item;
          }
        } else {
          if (lastItem) {
            lastItem.startgpstime = startTime;
            retentionArr.push(lastItem);
          }
          lastItem = null;
          startTime = null;
        }
      });

      var eventSymbol = new KMap.PictureMarkerSymbol({
        src: './static/img/stopPosition.png'
      });
      date = new Date();
      const infoTemplate = getRetentionPointInfo();
      retentionArr.forEach(alarm => {
        lon = alarm.longitude;
        lat = alarm.latitude;
        date.setTime(alarm.gpstime.time);
        endTimeStr = dateToStr(date, " ");
        date.setTime(alarm.startgpstime.time);
        startTimeStr = dateToStr(date, " ");
        const attr = {
          alarmRetention: true,
          startTime: startTimeStr,
          endTime: endTimeStr
        };
        geometry = new KMap.Point([lon, lat]);
        gc = new KMap.Graphic();
        gc.setGeometry(geometry);
        gc.setSymbol(eventSymbol);
        gc.setAttributes(attr);
        gc.setInfoTemplate(infoTemplate);
        this.layer.add(gc);
      });
    }
  };
  /**
   * 显示报警点
   * @param {boolen} show
   * @param {function} callback
   */
  showAlarmPoint(show, callBack = () => {}) {
    if (!this.alarmLoaded && show) {
      this.server.findTrackAlarmPageJson({
        sTime: this.sTime,
        eTime: this.eTime,
        carId: this.car.getAttribute('id')
      }, user_id).then(results => {
        const alarmArr = JSON.parse(results);
        const eventSymbol = new KMap.PictureMarkerSymbol({
          src: './static/img/eventPosition.png'
        });
        const infoTemplate = getAlarmPointInfo();
        let gc, lat, lon;
        for (var i = alarmArr.rows.length - 1; i >= 0; i--) {
          alarm = alarmArr.rows[i];
          lon = parseFloat(alarm.longitude) || 0;
          lat = parseFloat(alarm.latitude) || 0;
          alarm.alarmType = getAlarmType(alarm.alarmType);
          gc = newGraphic({
            coord: [lon, lat],
            symbol: eventSymbol,
            infoTemp: infoTemplate,
            attr: alarm
          });
          this.layer.add(gc.graphic);
        }
        this.alarmLoaded = true;
      }).catch(e => {
        root.$Message.warning('请求报警点数据失败!!!');
        callBack();
        return;
      });
    } else {
      this.layer.forEach(e => {
        const alarmType = e.getAttribute('alarmType');
        if (alarmType) {
          e.setVisible(show ? true : false);
        }
      });
    }
  }
};

function getDirectionStr(dir) {
  var result = "";
  var direction = parseInt(dir, 10);
  if (direction > 270) {
    result = "正西偏北";
  } else if (direction === 270) {
    result = "正西";
  } else if (direction > 180) {
    result = "正西偏南";
  } else if (direction === 180) {
    result = "正南";
  } else if (direction > 90) {
    result = "正东偏南";
  } else if (direction === 90) {
    result = "正东";
  } else if (direction > 0) {
    result = "正东偏北";
  } else if (direction === 0) {
    result = "正北";
  }
  return result;
};

function getRetentionPointInfo() {
  var content =
    "<ul style='list-style: none'>" +
    "<li><b>滞留开始时间：</b>${startTime}</li>" +
    "<li><b>滞留结束时间：</b>${endTime}</li>" +
    "</ul>";
  var infoTemplate = new KMap.InfoTemplate();
  infoTemplate.setTitle("详细信息");
  infoTemplate.setContent(content);
  return infoTemplate;
};

function getAlarmPointInfo() {
  const content = "<hr>" +
    "<ul style='list-style: none'>" +
    "<li><b>车牌号：</b>${gpsName}</li>" +
    "<li><b>车辆编号：</b>${carNumber}</li>" +
    "<li><b>所属单位：</b>${departmentName}</li>" +
    "<li><b>报警类型：</b>${alarmType}</li>" +
    "<li><b>报警位置：</b>${longitude}， ${latitude}</li>" +
    "<li><b>最早报警时间：</b>${minGpstime}</li>" +
    "<li><b>最晚报警时间：</b>${maxGpstime}</li>" +
    "<li><b>报警内容：</b>${content}</li>" +
    "<li><b>司机姓名：</b>${personName}</li>" +
    "<li><b>行驶速度：</b>${speed}Km/h</li>" +
    "</ul>";
  const infoTemplate = new KMap.InfoTemplate();
  infoTemplate.setTitle("详细信息");
  infoTemplate.setContent(content);
  return infoTemplate;
};

function getAlarmType(colValue) {
  if (colValue == 1) {
    return colValue = '超速报警';
  } else if (colValue == 2) {
    return colValue = '疲劳驾驶';
  } else if (colValue == 3) {
    return colValue = '预警';
  } else if (colValue == 4) {
    return colValue = 'GNSS模块发生故障';
  } else if (colValue == 5) {
    return colValue = 'GNSS天线未接或被剪断';
  } else if (colValue == 6) {
    return colValue = 'GNSS天线短路';
  } else if (colValue == 7) {
    return colValue = '终端主电源欠压';
  } else if (colValue == 8) {
    return colValue = '终端主电源掉电';
  } else if (colValue == 10) {
    return colValue = 'TTS模块故障';
  } else if (colValue == 19) {
    return colValue = '滞留报警';
  } else if (colValue == 20) {
    return colValue = '越界报警';
  } else if (colValue == 21) {
    return colValue = '进出路线';
  } else if (colValue == 23) {
    return colValue = '路线偏离报警';
  } else if (colValue == 25) {
    return colValue = '车辆油量异常';
  } else {
    return colValue = '其它';
  }
};

export default carTrack;
