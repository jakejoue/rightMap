import Axios from "axios";

function GpsService(proxyurl, url) {
  this.axios = axios.create({
    baseURL: proxyurl + '?' + url,
    responseType: 'document',
    headers: {
      "Content-Type": "application/json"
    }
  });
}

//获取采集员轨迹是否存在
GpsService.prototype.findObsTrackLogLength = function({ sTime, eTime, obsId }) {
  var lendata = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:mon="http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/">' +
    '<soapenv:Header/>' +
    '    <soapenv:Body>' +
    '        <mon:findObsTrackLogLength>' +
    '            <beginDateStr>' + sTime + '</beginDateStr>' +
    '            <endDateStr>' + eTime + '</endDateStr>' +
    '            <obsId>' + obsId + '</obsId>' +
    '        </mon:findObsTrackLogLength>' +
    '    </soapenv:Body>' +
    '</soapenv:Envelope>';
  return this.invoke("/mongoService/findObsTrackLogLength", {
    namespace: "http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/",
    method: "findObsTrackLogLength",
    data: lendata
  });
};

//获取采集员轨迹详情
GpsService.prototype.findObsTrackLogsJson = function({ sTime, eTime, obsId }, start, pageSize) {
  var trackdata = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:mon="http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/">' +
    '<soapenv:Header/>' +
    '    <soapenv:Body>' +
    '        <mon:findObsTrackLogsJson>' +
    '            <beginDateStr>' + sTime + '</beginDateStr>' +
    '            <endDateStr>' + eTime + '</endDateStr>' +
    '            <obsId>' + obsId + '</obsId>' +
    '            <start>' + start + '</start>' +
    '            <pageSize>' + pageSize + '</pageSize>' +
    '        </mon:findObsTrackLogsJson>' +
    '    </soapenv:Body>' +
    '</soapenv:Envelope>';
  return this.invoke("/mongoService/findObsTrackLogsJson", {
    namespace: "http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/",
    method: "findObsTrackLogsJson",
    data: trackdata
  });
};

//获取车辆轨迹是否存在
GpsService.prototype.findTrackLogLength = function({ sTime, eTime, carId }) {
  var lendata = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:mon="http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/">' +
    '<soapenv:Header/>' +
    '    <soapenv:Body>' +
    '        <mon:findTrackLogLength>' +
    '            <beginDateStr>' + sTime + '</beginDateStr>' +
    '            <endDateStr>' + eTime + '</endDateStr>' +
    '            <gpsdeviceid>' + carId + '</gpsdeviceid>' +
    '        </mon:findTrackLogLength>' +
    '    </soapenv:Body>' +
    '</soapenv:Envelope>';
  return this.invoke("/mongoService/findTrackLogLength", {
    namespace: "http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/",
    method: "findTrackLogLength",
    data: lendata
  });
};

//获取车辆轨迹详情
GpsService.prototype.findTrackLogsWithParamsJson = function({ sTime, eTime, carId }, start, pageSize) {
  var trackdata = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:mon="http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/">' +
    '<soapenv:Header/>' +
    '    <soapenv:Body>' +
    '        <mon:findTrackLogsWithParamsJson>' +
    '            <beginDateStr>' + sTime + '</beginDateStr>' +
    '            <endDateStr>' + eTime + '</endDateStr>' +
    '            <gpsdeviceid>' + carId + '</gpsdeviceid>' +
    '            <start>' + start + '</start>' +
    '            <pageSize>' + pageSize + '</pageSize>' +
    '        </mon:findTrackLogsWithParamsJson>' +
    '    </soapenv:Body>' +
    '</soapenv:Envelope>';
  return this.invoke("/mongoService/findTrackLogsWithParamsJson", {
    namespace: "http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/",
    method: "findTrackLogsWithParamsJson",
    data: trackdata
  });
};

//获取车辆轨迹报警点
GpsService.prototype.findTrackAlarmPageJson = function({ sTime, eTime, carId }, userId) {
  var alarmdata = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:mon="http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '    <mon:findTrackAlarmPageJson>' +
    '        <beginDateStr>' + sTime + '</beginDateStr>' +
    '        <endDateStr>' + eTime + '</endDateStr>' +
    '        <alarmType>' + '' + '</alarmType>' +
    '        <gpsName>' + '' + '</gpsName>' +
    '        <carNumber>' + '' + '</carNumber>' +
    '        <gpsdeviceid>' + carId + '</gpsdeviceid>' +
    '        <departmentId>' + '' + '</departmentId>' +
    '        <departmentName>' + '' + '</departmentName>' +
    '        <personId>' + '' + '</personId>' +
    '        <personName>' + '' + '</personName>' +
    '        <userId>' + userId + '</userId>' +
    '        <start>' + '0' + '</start>' +
    '        <pageSize>' + '8000' + '</pageSize>' +
    '    </mon:findTrackAlarmPageJson>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return this.invoke("/mongoService/findTrackAlarmPageJson", {
    namespace: "http://mongo.gpsapplication.soap.webservice.esb.digitalcity.kingdom.com/",
    method: "findTrackAlarmPageJson",
    data: alarmdata
  });
};

// 查询
GpsService.prototype.invoke = function(url, { namespace, method, data, dataType }) {
  return this.axios.post(url, data, {
    headers: { SOAPAction: namespace + method }
  }).then(async ({ data }) => {
    try {
      const content = data.getElementsByTagName('return')[0];
      let result = [];
      if (dataType == 'xml') {
        result = await this.xml2json(content) || [];
      } else {
        result = JSON.parse(content.textContent);
      }
      return result;
    } catch (error) {
      return [];
    }
  })
};

export default GpsService;
