import { parseString } from 'xml2js'
import Axios from 'axios';

export default class WebService {
  constructor(proxyUrl, webServiceUrl) {
    this.axios = Axios.create({
      baseURL: proxyUrl + '?' + webServiceUrl,
      responseType: 'text',
      headers: {
        "Content-Type": "application/json"
      }
    });
  };

  // 采集员
  findAllOnLineObserverJson() {
    var data = '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<findAllOnLineObserverJson xmlns="http://observer.um.soap.webservice.esb.digitalcity.kingdom.com/">' +
      '</findAllOnLineObserverJson>' +
      '</soap:Body>' +
      '</soap:Envelope>';
    var options = {
      namespace: 'http://observer.um.soap.webservice.esb.digitalcity.kingdom.com/',
      method: 'findAllOnLineObserverJson',
      data: data
    };
    return this.invoke("/ObsBusinessService/findAllOnLineObserverJson", options);
  };

  // 车辆
  getAllCarsOnlineState() {
    var data =
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gps="http://gps.um.soap.webservice.esb.digitalcity.kingdom.com/">' +
      '   <soapenv:Header/>' +
      '   <soapenv:Body>' +
      '      <gps:getAllCarsOnlineState>' +
      '         <!--Optional:-->' +
      '         <UserId>' + user_id + '</UserId>' +
      '      </gps:getAllCarsOnlineState>' +
      '   </soapenv:Body>' +
      '</soapenv:Envelope>';
    var options = {
      namespace: 'http://gps.um.soap.webservice.esb.digitalcity.kingdom.com/',
      method: 'getAllCarsOnlineState',
      data: data
    };
    return this.invoke("/GpsCarQueryService/getAllCarsOnlineState", options);
  };

  getMonitorPage() {
    var data =
      '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      '  <SOAP-ENV:Body>' +
      '    <tns:getMonitorPage xmlns:tns="http://video.um.soap.webservice.esb.digitalcity.kingdom.com/">' +
      '      <arg0/>' +
      '      <arg1>0</arg1>' +
      '      <arg2>9999</arg2>' +
      '    </tns:getMonitorPage>' +
      '  </SOAP-ENV:Body>' +
      '</SOAP-ENV:Envelope>';
    var options = {
      namespace: 'http://video.um.soap.webservice.esb.digitalcity.kingdom.com/',
      method: 'getMonitorPage',
      data: data,
      dataType: 'xml'
    };
    return this.invoke("/VideoService/getMonitorPage", options);
  };

  // xml2json简单包装
  xml2json(xml) {
    xml = xml.outerHTML;
    return new Promise((resolve, reject) => {
      parseString(xml, { explicitArray: false, ignoreAttrs: true }, function(err, result) {
        err ? reject(err) : resolve(result['return']);
      });
    });
  };

  // 查询
  invoke(url, { namespace, method, data, dataType }) {
    return this.axios.post(url, data, {
      headers: { SOAPAction: namespace + method }
    }).then(async ({ data }) => {
      try {
        const content = $(data).find("return")[0];
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
}
