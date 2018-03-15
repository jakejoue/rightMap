var inValideTime = false;
var wdateClick = "WdatePicker({skin:'whyGreen',isShowClear:false,readOnly:true,maxDate:'%y-%M-%d'})";
/**
 * 将时间对象转换成时间字符串
 * @param {Date} datetime 
 * @param {string} spliter 
 */
function dateToStr(datetime, spliter) {
    spliter = spliter || " ";
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1; /*js从0开始取 */
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minutes = datetime.getMinutes();
    var second = datetime.getSeconds();
    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (second < 10) {
        second = "0" + second;
    }
    var time = year + "-" + month + "-" + date + spliter + hour + ":" + minutes + ":" + second; /*example:2009-06-12 17:18:05	*/
    datetime = null;
    return time;
};

/**
 * 时间验证
 */
function timePickerFunc(mode, bHour) {
    var inputValue = "";
    var curTimePicker = null;
    var regular = null;
    switch (mode) {
        case 0:
            curTimePicker = $(".hourSet.beginTime");
            break;
        case 1:
            curTimePicker = $(".minuteSet.beginTime");
            break;
        case 2:
            curTimePicker = $(".hourSet.endTime");
            break;
        case 3:
            curTimePicker = $(".minuteSet.endTime");
            break;
        case 4:
            curTimePicker = $(".Wdate.beginTime");
            break;
        case 5:
            curTimePicker = $(".Wdate.endTime");
            break;
    }
    inputValue = curTimePicker.val();
    if (mode < 4) {
        if (mode == 0 || mode == 2) {
            regular = /^([0-1]?[0-9]|2[0-3])$/;
        } else if (mode == 1 || mode == 3) {
            regular = /^([0-5]?[0-9])$/;
        }
        if (regular.test(inputValue)) {
            if (parseInt(inputValue, 10) > 0 && parseInt(inputValue, 10) < 10 && inputValue.length == 1 || inputValue === "0") {
                curTimePicker.val("0" + inputValue);
            }
            inValideTime = false;
        } else {
            curTimePicker.val("00");
            inValideTime = true;
        }
    } else { /*判断日期是否合法*/
        if (inputValue == "") {
            curTimePicker.focus();
            inValideTime = true;
        } else {
            inValideTime = false;
        }
    }
};

/**
 * 初始化事件选择器时间
 */
function initTime() {
    var endTime = new Date();
    var beginTime = new Date();
    beginTime.setTime(endTime.getTime() - 7200000); /*两小时前*/
    var dateStr = dateToStr(beginTime, 'T').split('T')[0];
    $('.Wdate.beginTime').val(dateStr); /* 2015-09-09 */
    $('.Wdate.endTime').val(dateStr);
    $(".hourSet.beginTime").val(getFullTime(beginTime.getHours()));
    $(".minuteSet.beginTime").val(getFullTime(beginTime.getMinutes()));
    $(".hourSet.endTime").val(getFullTime(endTime.getHours()));
    $(".minuteSet.endTime").val(getFullTime(endTime.getMinutes()));

    function getFullTime(hourOrMinute) {
        return hourOrMinute < 10 ? ("0" + hourOrMinute) : hourOrMinute;
    }
};

/*
 * 获得地图弹窗上用户设置的查询时间 
 */
function getTimeSetting() {
    if ($('.Wdate.beginTime').val() === "") {
        initTime();
    }
    var sDateStr = $('.Wdate.beginTime').val();
    var eDateStr = $('.Wdate.endTime').val();
    var sHour = parseInt($(".hourSet.beginTime").val(), 10);
    var sMinute = parseInt($(".minuteSet.beginTime").val(), 10);
    var eHour = parseInt($(".hourSet.endTime").val(), 10);
    var eMinute = parseInt($(".minuteSet.endTime").val(), 10);
    sHour = sHour < 10 ? "0" + sHour : sHour;
    sMinute = sMinute < 10 ? "0" + sMinute : sMinute;
    eHour = eHour < 10 ? "0" + eHour : eHour;
    eMinute = eMinute < 10 ? "0" + eMinute : eMinute;
    var result = {};
    result.sDate = sDateStr;
    result.eDate = eDateStr;
    result.sTime = sDateStr + "T" + sHour + ":" + sMinute + ":00";
    result.eTime = eDateStr + "T" + eHour + ":" + eMinute + ":00";
    return result;
}

/***
 * 检查用户设置的结束时间是否大于开始时间 
 */
function checkTimeLimites(sTime, eTime) { /*检查结束时间是否大于开始时间 */
    sTime = str2Date(sTime, 'T');
    eTime = str2Date(eTime, 'T');
    return eTime > sTime;
};

/**
 * 字符串转为时间
 * @param {string} datetime 
 * @param {string} spliter 
 */
function str2Date(datetime, spliter) {
    var dateStr = datetime.split(spliter)[0];
    var timeStr = datetime.split(spliter)[1];
    var dateArr = dateStr.split('-');
    var timeArr = timeStr.split(':');
    var time = new Date();
    time.setFullYear(parseInt(dateArr[0], 10), parseInt(dateArr[1], 10), parseInt(dateArr[2], 10));
    time.setHours(parseInt(timeArr[0], 10), parseInt(timeArr[1], 10), parseInt(timeArr[2], 10), 0);
    return time;
};