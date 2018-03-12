import { parseString } from 'xml2js'
import axios from 'axios';

export default class WebService {
  constructor(proxyUrl, webServiceUrl) {
    // this.proxyUrl = proxyUrl;
    // this.webServiceUrl = webServiceUrl;
    this.axios = axios.create({
      baseURL: proxyUrl + '?' + webServiceUrl,
      responseType: 'text'
    });
  };

  // 采集员查询
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
      data: data,
      dataType: 'json'
    };
    return this.invoke("/ObsBusinessService/findAllOnLineObserverJson", options);
  };

  invoke(url, { namespace, method, data, dataType }) {
    return this.axios.post(url, data, {
      headers: { SOAPAction: namespace + method }
    }).then(respones => {
      console.log(respones);
    })
  }
}
