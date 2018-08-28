// 案件
var content =
  "<ul>" +
  "<li><b>案件号：</b><a href='javascript:tf.displayCaseDetail(\"${Id}\");'>${Title}</a></li>" +
  "<li><b>案件类别：</b>${EventClassName}</li>" +
  "<li><b>案件来源：</b>${Resource}</li>" +
  "<li><b>上报时间：</b>${ReportTime}</li>" +
  "<li><b>案件级别：</b>${Level}</li>" +
  "</ul>";
var infoTemplate = new KMap.InfoTemplate();
infoTemplate.setTitle("详细信息");
infoTemplate.setContent(content);

// 打开案件详情
global.tf.displayCaseDetail = function (Id) {
  if (!Id) return;

  var url = path + "/business/eventBasicInfo!showEventDetail.action?event.id=" + Id;
  parent.kd.win.dialog({
    width: 3000,
    height: 3000,
    title: ' 案件信息展示',
    url: url,
    btn: []
  });
}

/**
 * 案件等级,1,一般；2，重大；3，特大
 */
var EVENT_LEVEL = {
  "1": "一般",
  "2": "重大",
  "3": "特大",
  "4": "应急",
};

/**
 * 案件来源
 */
var EVENT_RESOURCE = {
  "10": "公众举报",
  "20": "案件巡查员上报",
  "30": "网站举报",
  "40": "传真举报",
  "50": "信访举报",
  "60": "媒体曝光",
  "70": "邮件举报",
  "80": "其他上报",
  "90": "案件巡查员自查自纠",
  "100": "领导批示",
  "110": "考评举报",
  "120": "视频登记",
  "130": "短信举报",
  "140": "智能部件",
  "150": "12345转办",
  "160": "纠风在线",
  "170": "城市管家",
  "180": "创文办转办(巡查员上报)",
  "190": "案件网格员上报(高新)",
  "200": "微信管家(高新)",
  "210": "创文办转办"
};

export const caseSymbol = new KMap.PictureMarkerSymbol({
  anchor: [0.5, 1],
  src: "./static/img/caseSymbol_1.png"
});

export { infoTemplate, EVENT_LEVEL, EVENT_RESOURCE };
