var contentStr =
  "<ul>" +
  "<li><b>名&nbsp;&nbsp;&nbsp;&nbsp;称：</b>${OBJNAME}</li>" +
  "<li><b>编&nbsp;&nbsp;&nbsp;&nbsp;码：</b>${OBJCODE}</li>" +
  "<li><b>状&nbsp;&nbsp;&nbsp;&nbsp;态：</b>${OBJSTATE}</li>" +
  "<li><b>材&nbsp;&nbsp;&nbsp;&nbsp;料：</b>${MATERIAL}</li>" +
  "<li><b>所属部门：</b>${DEPTNAME1}</li>" +
  "</ul>";
var infoTemplate = new KMap.InfoTemplate();
infoTemplate.setTitle("详细信息");
infoTemplate.setContent(contentStr);

export { infoTemplate };
