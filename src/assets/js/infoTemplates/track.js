import store from 'store/';

//轨迹info相关
const shourInput = "<input type='text' class='timeSet hourSet beginTime' onblur=timePickerFunc(0,0)>";
const sminuteInput = "<input type='text' class='timeSet minuteSet beginTime' onblur=timePickerFunc(1,1)>";
const ehourInput = "<input type='text' class='timeSet hourSet endTime' onblur=timePickerFunc(2,0)>";
const eminuteInput = "<input type='text' class='timeSet minuteSet endTime' onblur=timePickerFunc(3,1)>";

const content = "<ul InfoTag class='track hidden'>" +
  "<li interval='oneHour' class='button' onclick='global.tf.playTrack(this, ${type})' >回放最近一小时</li>" +
  "<li interval='today' class='button' onclick='global.tf.playTrack(this, ${type})' >回放今天所有时段</li>" +
  "<li interval='yestoday' class='button' onclick='global.tf.playTrack(this, ${type})' >回放昨天所有时段</li>" +
  "<li interval='custom' class='custom button' onclick='global.tf.playTrack(this, ${type})' >回放自定义时间</li>" +
  "<li>开始时间：<input class='Wdate beginTime' type='text' onblur='timePickerFunc(4)' onfocus=\"" + wdateClick + "\"/>" + "&nbsp;&nbsp;" + shourInput + "&nbsp;&nbsp;" + sminuteInput + "</li>" +
  "<li>结束时间：<input class='Wdate endTime' type='text' onblur='timePickerFunc(5)' onfocus=\"" + wdateClick + "\"/>" + "&nbsp;&nbsp;" + ehourInput + "&nbsp;&nbsp;" + eminuteInput + "</li>" +
  "</ul>";

const regx = /\$\{type\}/gi;

function getContent(type) {
  return content.replace(regx, '"' + type + '"');
};

// 点击
global.tf.playTrack = function playTrack(item, type) {
  $(item).addClass("selected").siblings().removeClass("selected");
  var mode = $(item).attr("interval");
  var timeSet = {};
  if (mode === "custom") {
    timeSet = getTimeSetting();
    if (!checkTimeLimites(timeSet.sTime, timeSet.eTime)) {
      root.$Message.warning("开始时间应该小于结束时间");
      return;
    }
    if (timeSet.sDate !== timeSet.eDate) {
      root.$Message.warning("暂时只支持查询同一天的车辆历史轨迹");
      return;
    }
  } else {
    var sTime = new Date();
    var eTime = new Date();
    var hour;
    switch (mode) {
      case "oneHour":
        inValideTime = false;
        hour = eTime.getHours();
        hour = hour - 1 >= 0 ? hour - 1 : 0;
        sTime.setHours(hour);
        break;
      case "today":
        inValideTime = false;
        hour = 0;
        sTime.setHours(0, 0, 0, 0);
        break;
      case "yestoday":
        inValideTime = false;
        eTime.setHours(0, 0, 0, 0);
        eTime.setSeconds(-1);
        sTime.setHours(0, 0, 0, 0);
        sTime.setHours(-24);
        break;
      default:
        return;
    }
    timeSet.sDate = sTime.toLocaleDateString();
    timeSet.eDate = eTime.toLocaleDateString();
    timeSet.sTime = dateToStr(sTime, "T");
    timeSet.eTime = dateToStr(eTime, "T");
  }
  const target = map.infoWindow.getSelectedFeature();
  if (target) {
    (async () => {
      map.infoWindow.hide();
      await store.commit('track/close');
      store.commit('track/show', {
        type,
        time: {
          sTime: timeSet.sTime.replace("T", " "),
          eTime: timeSet.eTime.replace("T", " ")
        },
        target: target
      });
    })();
  }
};


export default getContent;
