/**
 * 服务器查询接口
 * 
 * @param {Object.<string, string>} options 
 */
function KQuery({ server, appKey }) {
  this.server = server;
  this.appKey = appKey;

  this.axios = axios.create({
    responseType: 'text',
    timeout: 10000,
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  });
};


/**
 * 计算长度
 * 
 * @param {Array.<number>} arr [x1, y1, x2, y2, ...] 点数组 
 */
KQuery.prototype.getLength = function(arr) {
  var args = {
    "request": 'length',
    "arr": arr,
    "outputFormat": 'json'
  };
  return this.postData(args);
};

/**
 * 计算面积
 * 
 * @param {Array.<number>} arr [x1, y1, x2, y2,...] 点数组 
 */
KQuery.prototype.getArea = function(arr) {
  var args = {
    "request": 'area',
    "arr": arr,
    "outputFormat": 'json'
  };
  this.postData(args, callback);
};

/**
 * 坐标转换
 * 
 * @param {number} lon 经度 
 * @param {number} lat 纬度 
 */
KQuery.prototype.project2map = function(lon, lat) {
  var args = {
    "request": 'project2map',
    "lon": lon,
    "lat": lat,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 坐标转换
 * 
 * @param {number} x 坐标x 
 * @param {number} y 坐标y 
 */
KQuery.prototype.project2wgs = function(x, y) {
  var args = {
    "request": 'project2wgs',
    "x": x,
    "y": y,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 用坐标查询案件位置
 * 
 * @param {number} x 地图x坐标
 * @param {number} y 地图y坐标
 * @param {string} type 定位类型
 */
KQuery.prototype.getCaseLocation = function(x, y, type) {
  var args = {
    "request": 'getCaseLocation',
    "x": x,
    "y": y,
    "type": type,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 兴趣点查询
 *
 * @param {string} str 兴趣点关健字
 * @param {number} pageIndex 分页索引
 * @param {number} pageSize 分页大小
 */
KQuery.prototype.queryPoint = function(str, pageIndex, pageSize) {
  var args = {
    "request": 'queryPoint',
    "str": str,
    "pageIndex": pageIndex || 0,
    "pageSize": pageSize || 10,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 道路查询
 *
 * @param {string} str 道路关健字
 * @param {number} pageIndex 分页索引
 * @param {number} pageSize 分页大小
 */
KQuery.prototype.queryRoad = function(str, pageIndex, pageSize) {
  var args = {
    "request": 'queryRoad',
    "str": str,
    "pageIndex": pageIndex || 0,
    "pageSize": pageSize || 10,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 网格查询
 * 
 * @param {number} index 网格类型
 * @param {string} str 网格关健字
 */
KQuery.prototype.queryGrid = function(str, index, pageIndex, pageSize) {
  var args = {
    "request": 'queryGrid',
    "str": str,
    "index": index,
    "pageIndex": pageIndex || 0,
    "pageSize": pageSize || 10,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 用编码查询部件
 * 
 * @param {string} code 
 * @param {number} pageIndex 
 * @param {number} pageSize 
 */
KQuery.prototype.queryComp = function(code, pageIndex, pageSize) {
  var args = {
    "request": 'queryComp',
    "str": code,
    "pageIndex": pageIndex || 0,
    "pageSize": pageSize || 10,
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 框选部件
 * 
 * @param {string} poly WKT格式字符串
 * @param {string} layers 要框选的部件图层
 * @param {number} pageIndex 
 * @param {any} pageSize 
 */
KQuery.prototype.queryCompByPoly = function(poly, layers, pageIndex, pageSize) {
  var args = {
    "request": 'queryCompByPoly',
    "poly": poly,
    "layers": layers,
    "pageIndex": pageIndex || 0,
    "pageSize": pageSize || 10,
    "outputFormat": 'json'
  };
  return this.postData(args);
};

/**
 * 基础图层信息
 */
KQuery.prototype.getLayersInfo = function() {
  var args = {
    "request": 'getLayersInfo',
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 部件图层信息
 */
KQuery.prototype.getComplayerInfo = function() {
  var args = {
    "request": 'getComplayerInfo',
    "outputFormat": 'json'
  };
  return this.getData(args);
};

/**
 * 获取图片
 * @param {function} success 
 */
KQuery.prototype.getMapPic = function(opts, success) {
  var center = opts.center || [0, 0];
  var size = opts.size || [0, 0];
  var args = {
    'request': 'getMapPic',
    'x': center[0],
    'y': center[1],
    'w': size[0],
    'h': size[1],
    'scale': opts.scale,
    'dpi': opt.dpi,
    'outputFormat': 'image/png'
  };
  var url = this.buildUrl(args);
  success(url);
};

/**
 * 生成GET连接URL
 * 
 * @param {Object.<string,Object>} args 
 * @returns {string}
 */
KQuery.prototype.buildUrl = function(args) {
  var url = this.server + "/query?appKey=" + this.appKey;
  for (var key in args) {
    if (key && args[key]) {
      url += "&" + key + "=" + args[key];
    }
  }
  return url;
};

/**
 * 生成POST的XML数据
 * 
 * @param {Object.<string,Object>} args 
 * @returns {string}
 */
KQuery.prototype.buildData = function(args) {
  args.appKey = this.appKey;
  var content = '<' + args.request + ' service="query" version="1.0.0">{body}</' + args.request + '>';
  var body = '';
  for (var key in args) {
    if (key !== 'request' && args[key]) {
      body += '<' + key + '>';
      body += args[key];
      body += '</' + key + '>';
    }
  }
  return content.replace('{body}', body);
};


/**
 * 发送GET请求
 * 
 * @param {Object.<string, Object>} args 
 */
KQuery.prototype.getData = function(args) {
  var url = this.buildUrl(args);
  return this.axios.get(encodeURI(url)).then(({ data }) => data);
};

/**
 * 发送POST请求
 * 
 * @param {Object.<string, Object>} args 
 */
KQuery.prototype.postData = function(args) {
  var url = this.server + '/query';
  var content = this.buildData(args);
  return this.axios.post(encodeURI(url), content).then(({ data }) => data);
};

export default KQuery;
