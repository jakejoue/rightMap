const infoTemplate = new KMap.InfoTemplate();

//打开视频监控方法
global.tf.openMonitorW = function(id, type) {
  const style = "width=800,height=560,left=150,top=100,status=yes,toolbar=no,menubar=yes,scrollbars=1,location=no,resizable=1";
  const url = `${path}/monitor/MonitorAction!videoPlay.action?_type=${type}&monitor.id=${id}`;
  window.open(url, "", style);
};

infoTemplate.setTitle(
  `<div class='titleBar'>
    <a>详细信息</a>
    <a onclick='tf.openMonitorW("\${id}","\${type}")'>播放视频</a>
    </div>`
);

infoTemplate.setContent(
  "<ul>" +
  "<li><b>监控名称：</b>${name}</li>" +
  "<li><b>视频地址：</b>${serverIp}</li>" +
  "<li><b>视频通道：</b>${serverPort}</li>" +
  "</ul>"
);

export default infoTemplate;
