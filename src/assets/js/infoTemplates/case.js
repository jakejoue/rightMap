// 案件
var content =
  "<ul>" +
  "<li><b>案件号：</b><a href='javascript:displayCaseDetail();'>${Title}</a></li>" +
  "<li><b>案件类别：</b>${EventClassName}</li>" +
  "<li><b>单元网格：</b>${CellGridCode}</li>" +
  "<li><b>工作网格：</b>${WorkGridCode}</li>" +
  "<li><b>事发位置：</b>${Location}</li>" +
  "<li><b>问题描述：</b>${Content}</li>" +
  "</ul>";
var infoTemplate = new KMap.InfoTemplate();
infoTemplate.setTitle("详细信息");
infoTemplate.setContent(content);

export { infoTemplate };
