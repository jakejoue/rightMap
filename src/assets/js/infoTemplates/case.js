// 案件
var content =
  "<ul>" +
  "<li><b>案件号：</b><a href='javascript:tf.displayCaseDetail(\"${Id}\");'>${Title}</a></li>" +
  "<li><b>案件类别：</b>${EventClassName}</li>" +
  "<li><b>单元网格：</b>${CellGridCode}</li>" +
  "<li><b>工作网格：</b>${WorkGridCode}</li>" +
  "<li><b>事发位置：</b>${Location}</li>" +
  "<li><b>问题描述：</b>${Content}</li>" +
  "</ul>";
var infoTemplate = new KMap.InfoTemplate();
infoTemplate.setTitle("详细信息");
infoTemplate.setContent(content);

// 打开案件详情
global.tf.displayCaseDetail = function(Id) {
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

export { infoTemplate };
