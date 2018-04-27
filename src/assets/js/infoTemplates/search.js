// 生成infoTemplate
function getInfoTemplateByType(type) {
  const infoTemplate = new KMap.InfoTemplate();
  const templateSet = configData.infoTemplateSet;
  const temp = templateSet.filter(e => {
    return e.aliasName == type;
  })[0];
  let content = "<ul>";
  temp.template.forEach(e => {
    content += "<li><b>" + e.alias + "：</b>${" + e.name + "}</li>";
  });
  content += "</ul>";
  infoTemplate.setTitle("${name}");
  infoTemplate.setContent(content);
  return infoTemplate;
}

export default getInfoTemplateByType;
