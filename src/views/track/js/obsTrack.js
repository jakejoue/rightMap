import { Track, simplyPath } from './Track'

class obsTrack extends Track {
  constructor({
    play = () => {},
    pause = () => {},
    update = () => {},
    stop = () => {},
    error = () => {},
    initSuccess = () => {} //正确初始化后调用
  }) {
    super("obsTrack");

    this.LONOFFECT = $.g.configData.offset ?
      $.g.configData.offset.longitude : 0;
    this.LATOFFECT = $.g.configData.offset ?
      $.g.configData.offset.latitude : 0;

    this.server = $.g.gpsService;
    if (!this.server) {
      throw "GPS服务接口未初始化";
      return;
    }
    //采集员
    this.obs = null;
    this.obsG = null;
    this.obsTxt = null;

    //时间段
    this.sTime = null;
    this.eTime = null;

    //轨迹
    this.hint = 0;
    this.path = [];
    this.attr = [];

    //回掉函数
    this.callBack = {
      play,
      pause,
      update: e => {
        e.obsG.geometry.setCoordinates(e.getCurPoint());
        e.obsTxt.geometry.setCoordinates(e.getCurPoint());
        e.obsTxt.symbol.setText(e.attr[e.getCurIndex()].time.replace(" ", "\r\n"));
        update(e, e.attr[e.getCurIndex()]);
      },
      stop: e => {
        e.obsG = null;
        e.obsTxt = null;
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
   * @param {KMap.Graphic} obs 
   */
  setTarget(obs) {
    this.obs = obs;
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
      obsId: this.obs.getAttribute('Id')
    };
    this.getTrackLength(config);
  };
  //判断轨迹存在
  getTrackLength(config) {
    this.server.findObsTrackLogLength(config, count => {
      count = parseInt(count, 10);
      if (count === 0) {
        this.error("未查询到轨迹数据");
        return;
      } else {
        let start = 1;
        this.hint = 0
        this.path = [];
        this.attr = [];

        while (start * 800 < count) {
          this.getTrack(start - 1, 800, config);
          start++;
          this.hint++;
        }
        this.getTrack(start - 1, 800, config);
        this.hint++;
      }
    }, this.error);
  };
  //获取轨迹数据
  getTrack(start, pageSize, opts) {
    this.server.findObsTrackLogsJson(opts, start, pageSize, results => {
      this.path[results['currentPage']] = results.rows;
      this.hint--;
      if (this.hint == 0) {
        //合并和重复点删除
        this.path = [].concat(...this.path);
        this.path = simplyPath(this.path, { x: 'longitude', y: 'latitude' });
        //遍历出需要的属性
        this.path = this.path.map(ele => {
          let timeStr = "";
          if (ele.pdaTime) {
            let recordTime = new Date();
            recordTime.setTime(ele.pdaTime.time);
            timeStr = dateToStr(recordTime, ' ');
          }

          var x = ele['longitude'] + this.LONOFFECT;
          var y = ele['latitude'] + this.LATOFFECT;
          this.attr.push({
            time: timeStr
          });
          return [x, y];
        });
        this.handleTrack([this.path]);
      }
    }, this.error);
  };
  //处理轨迹数据
  handleTrack(path) {
    this.map = $.g.map;
    this.layer = new KMap.GraphicsLayer("obsTrackLayer");

    //采集员图标
    this.obsG = newGraphic({
      coord: path[0][0],
      symbol: new KMap.PictureMarkerSymbol({
        src: './static/images/observarTrack.gif'
      })
    });
    //采集员信息图标
    this.obsTxt = newGraphic({
      coord: path[0][0],
      symbol: new KMap.SimpleTextSymbol({
        text: this.attr[0].time.replace(" ", "\r\n"),
        fill: [128, 0, 0],
        font: '12px sans-serif',
        offsetX: 0,
        offsetY: -30
      })
    })
    this.layer.add(this.obsG.graphic);
    this.layer.add(this.obsTxt.graphic);
    //初始化轨迹
    this.initTrack(Object.assign({
      map: this.map,
      layer: this.layer,
      path: path,
      coordType: 1,
      lineSymbol: new KMap.SimpleLineSymbol({
        stroke: [255, 0, 0],
        width: 3
      }),
      dyLineSymbol: new KMap.SimpleLineSymbol({
        stroke: [0, 0, 254],
        width: 4
      })
    }, this.callBack));
    this.initSuccess(this);
  };
};

export default obsTrack;
