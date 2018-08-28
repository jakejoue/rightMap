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

var contentStr2 =
  "<ul>" +
  "<li><b>名称：</b>${OBJNAME}</li>" +
  "<li><b>编码：</b>${OBJCODE}</li>" +
  "<li><b>状态：</b>${OBJSTATE}</li>" +
  "<li><b>材料：</b>${MATERIAL}</li>" +
  "<li><b>地址：</b>${ADDRESS}</li>" +
  "<li><b>社区：</b>${COMMUNITY}</li>" +
  "<li><b>街道办：</b>${COMOFFICE}</li>" +
  "<li><b>大类：</b>${BCLASSSTR}</li>" +
  "<li><b>小类：</b>${SCLASSSTR}</li>" +
  "<li><b>初始时间：</b>${ORDATE}</li>" +
  "<li><b>数据来源：</b>${DATASOURCE}</li>" +
  "<li><b>主管部门编码：</b>${DEPTCODE1}</li>" +
  "<li><b>权属单位编码：</b>${DEPTCODE2}</li>" +
  "<li><b>养护单位编码：</b>${DEPTCODE3}</li>" +
  "<li><b>主管部门名称：</b>${DEPTNAME1}</li>" +
  "<li><b>权属单位名称：</b>${DEPTNAME2}</li>" +
  "<li><b>养护单位名称：</b>${DEPTNAME3}</li>" +
  "<li><b>图片查看：</b><a href='javascript:void(0)' onclick='tf.showPic(\"${BCLASS}${SCLASS}/${PIC}\")'>${PIC}</a></li>" +
  "</ul>";
var infoTemplate2 = new KMap.InfoTemplate();
infoTemplate2.setTitle("详细信息");
infoTemplate2.setContent(contentStr2);

tf.showPic = function (compPicId) {
  const picName = configData.picServerUrl + compPicId + ".jpg";
  let url = path + "/map/rightMap/static/compImg.html?" + picName;
  if (process.env.NODE_ENV == "development") {
    url = "./static/compImg.html?" + picName;
  }
  try {
    parent.kd.win.dialog({
      double: "right",
      width: 1000,
      height: 630,
      title: "图片",
      modal: true,
      url: url,
      btn: []
    });
  } catch (error) {
    window.open(url);
  }
}

export const compSymbol = new KMap.PictureMarkerSymbol({
  src: './static/img/comp.png',
  anchor: [0.5, 2.2]
});

export { infoTemplate, infoTemplate2 };
