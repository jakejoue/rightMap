import { parseString } from 'xml2js'
import axios from 'axios';

export default class WebService {
  constructor(proxyUrl, webServiceUrl) {
    this.axios = axios.create({
      baseURL: proxyUrl + '?' + webServiceUrl,
      responseType: 'document'
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

  // xml2json简单包装
  xml2json(xml) {
    return new Promise((resolve, reject) => {
      parseString(xml, function(err, result) {
        err ? reject(err) : resolve(result);
      });
    });
  };

  // 查询
  invoke(url, { namespace, method, data, dataType }) {
    return this.axios.post(url, data, {
      headers: { SOAPAction: namespace + method }
    }).then(async ({ data }) => {
      try {
        const content = data.getElementsByTagName('return')[0].textContent;
        let result = [];
        if (dataType == 'xml') {
          result = await this.xml2json(content) || [];
        } else {
          result = JSON.parse(content);
        }
        return result;
      } catch (error) {
        return [];
      }
    })
  };
}
