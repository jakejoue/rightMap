import getContent from './track';

var contentStr =
  "<ul InfoTag>" +
  "<li><b>型号：</b>${model}</li>" +
  "<li><b>标识码：</b>${markId}</li>" +
  "<li><b>生产商：</b>${manu}</li>" +
  "<li><b>创建人：</b>${user_name}</li>" +
  "<li><b>创建时间：</b>${create_time}</li>" +
  "<li><b>出厂时间：</b>${produce_date}</li>" +
  "<li><b>在线状态：</b>${isOnline}</li>" +
  "<li><b>最后在线时间：</b>${pda_time}</li>" +
  "<li><b>备&nbsp;&nbsp;&nbsp;&nbsp;注：</b>${note}</li>" +
  "</ul>" + getContent('uva');

var infoTemplate = new KMap.InfoTemplate();
infoTemplate.setTitle(`
    <div class='titleBar'>
        <a InfoTag href='javascript:void(0);'>详细信息</a>
        <a InfoTag href='javascript:void(0);'>轨迹回放</a>
    </div>
`);
infoTemplate.setContent(contentStr);

export { infoTemplate };
