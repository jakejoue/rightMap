// JScript File
//公用方法
//自定义事件
//var EventHandler = {
//    __list:[],
//    attach:function(obj, ev, fun){
//        this.__list.push({o:obj, e:ev, f:fun})
//    },
//    remove:function(obj, method, fun){
//        for(var i=this.__list.length; i>=0; i--){
//            if(this.__list[i].o == obj && this.__list[i].e == method && this.__list[i].f == fun) arr.splice(i, 1);
//        }
//    },
//    exec:function(obj, method, args){
//        var arr = []
//        for(var i=0; i<this.__list.length; i++){
//            if(this.__list[i].o == obj && this.__list[i].e == method) arr.push(this.__list[i]);
//        }
//        for(var i=0; i<arr.length; i++){
//            arr[i].f(args);
//        }
//    }
//};

// JScript File
//公用方法
//自定义事件
var EventHandler = {
    __list:[],
    attach:function(obj, ev, fun){
        this.__list.push({o:obj, e:ev, f:fun})
    },
//    remove:function(obj, method, fun){
//        for(var i=this.__list.length; i>=0; i--){
//            if(this.__list[i].o == obj && this.__list[i].e == method && this.__list[i].f == fun) arr.splice(i, 1);
//        }
//    },
    //wlc20091102
    remove:function(obj, method, fun){
        var arr = [];
        arr = this.__list;
        for(var i=this.__list.length-1; i>=0; i--){
            if(this.__list[i].o == obj && this.__list[i].e == method && this.__list[i].f == fun) arr.splice(i, 1);
        }
        this.__list = arr;
    }, 
    exec:function(obj, method, args){
        var arr = []
        for(var i=0; i<this.__list.length; i++){
            if(this.__list[i].o == obj && this.__list[i].e == method) arr.push(this.__list[i]);
        }
        for(var i=0; i<arr.length; i++){
            arr[i].f(args);
        }
    }
};
//增加列表框
function ListAdd(oListbox, sName, sValue){
    var oOption = new Option(sName, sValue, false, false)
    oListbox[oListbox.length] = oOption;
};
//删除列表框
function ListRemove(oListbox, iIndex){
    oListbox.remove(iIndex);
};
//清除列表框
function ListClear(oListbox){
    for(var i = oListbox.options.length -1; i>=0; i--){
        ListRemove(oListbox, i);
    }
};
//JS解析URL(多个参数)
function GetRequestParam()
{
    var obj_ArrParam = new Array();
    var str_CurrentUrl = document.URL;
    var obj_RequestUrl = str_CurrentUrl.split('?');
    if(obj_RequestUrl[1])
    {
        var obj_ParamUrl = obj_RequestUrl[1].split('&');
        var length = obj_ParamUrl.length;
        for(var i = 0; i < length; i++)
        {
            var obl_Param = obj_ParamUrl[i].split('=');
            obj_ArrParam[obl_Param[0]] = obl_Param[1];
        }
    }
    return obj_ArrParam;
};
//JS解析URL（单个参数）
function GetSigleRequestParam(){
    var requestParam;
    var str_CurrentUrl = document.URL;
    var obj_RequestUrl = str_CurrentUrl.split('?');
    if(obj_RequestUrl[1])
    {
        var obl_Param = obj_RequestUrl[1].split('=');
        requestParam = obl_Param[1];
    }
    return requestParam;
};
//通过左中右相机设置按钮图片，并返回相机号
function SetFilterByCamNo(lcrCam)
{
        var CamNo;
    	if(lcrCam=="left")
	    {
	        CamNo = LeftCameraNo;
	        SetFilter("showleftn.png","showLeftBtn");
	        SetFilter("showcenter.png","showCenterBtn");
	        SetFilter("showright.png","showRightBtn");
	    }
	    if(lcrCam=="center"){
	        CamNo = CenterCameraNo;
	        SetFilter("showleft.png","showLeftBtn");
	        SetFilter("showcentern.png","showCenterBtn");
	        SetFilter("showright.png","showRightBtn");
	    }
	    if(lcrCam=="right"){
	        CamNo = RightCameraNo;
	        SetFilter("showleft.png","showLeftBtn");
	        SetFilter("showcenter.png","showCenterBtn");
	        SetFilter("showrightn.png","showRightBtn");
	    }
	    return CamNo;
}	
	
/**
 *  设置按钮图片
 * @requires filename,id
 * @param {String} filename 图片文件名
 * @param {String} id 图片id
 * @returns none
 * @type none
 */
function SetFilter(filename,id)
{
        $(id).style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=../images/"+filename+",sizingMethod='image')";

}

//时间转换成字符串，如：2009-10-15 16:09:07转成20091015160907
function DateTimeToStr(dateTime)
{
    if(dateTime!=null)
    {
        if(dateTime.length==19)
        {
            dateTime=dateTime.replace(/-/g,"");
            dateTime=dateTime.replace(/:/g,"");
            dateTime=dateTime.replace(/ /g,"");
            return dateTime;
        }
    }
    
}
//字符串转换成时间，如：20091015160907转成2009-10-15 16:09:07
function StrToDateTime(str) {
    if (str != null) {
        if (str.length == 14) {
            var dateTime;

            dateTime = str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8) + " " + str.substring(8, 10) + ":" + str.substring(10, 12) + ":" + str.substring(12, 14);
            //alert(dateTime);
            return dateTime;
        }
    }
}