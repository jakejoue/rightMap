/*******************************************************************************************************
* 客户端 单点全景JS脚本
******************************************************************************************************/

/////全景对象
var TrueMapPanoKit = {
   
    __control:null,                                       //当前控件
    __controlList:[],                                     //控件数组
    __lastScript:null,                                    //脚本缓存  
    __head:document.getElementsByTagName("head")[0],      //head节点

    __panoList:[],                                  //单点全景列表
    __pano:null,                                     //单点全景对象
    
    //载入脚本
    LoadScript:function(url, param, callback){
        var script = document.createElement("script");
        var id = new Date().getTime();
        var sFullUrl = url;
        sFullUrl += "?rnd=";
        sFullUrl += id;
        sFullUrl += param;
        sFullUrl += "&callback=";
        sFullUrl += callback;
        script.type = "text/javascript";
        script.id = id;
        script.src = sFullUrl;
       
        TrueMapPanoKit.__head.appendChild(script);
        if(TrueMapPanoKit.__lastScript && TrueMapPanoKit.GetScript(TrueMapPanoKit.__lastScript))
            TrueMapPanoKit.GetScript(TrueMapPanoKit.__lastScript).parentNode.removeChild(TrueMapPanoKit.GetScript(TrueMapPanoKit.__lastScript));
        TrueMapPanoKit.__lastScript = id;
    },
    
    ///获得脚本引用
    GetScript:function(scriptId){ 
        return document.getElementById(scriptId)
    },
    
    //无刷新请求入口
    AjaxRequest:function(param,callback){
        var sPageUrl = TrueMapPanoKitRequestUrl;
        var sRequestBody = "";
        var sCallback = "";
        for (property in param){
            var sParamType = typeof param[property];       
            if(sParamType != "undefined" && sParamType != "function" && sParamType != "unknown"){
               sRequestBody += "&";
            
               sRequestBody += (property);
               sRequestBody += "=";
               if(sParamType == "object"){
                   /* Ajax.net JSON 序列化方法 */
                    sRequestBody += (Sys.Serialization.JavaScriptSerializer.serialize(param[property]));
               }
               else{
                  
                   sRequestBody += (param[property]);
               }
            }
        }
       
        TrueMapPanoKit.LoadScript(sPageUrl,sRequestBody,callback);
    },
    
    //无刷新返回入口
    AjaxReturn:function(objReturn){
        var strMethod = objReturn.method;
        switch(strMethod){
            case "GetAllPanoList":
               EventHandler.exec(TrueMapPanoKit,'GetAllPanoList', objReturn.panoList);
               break;
            case "GetSimplePanoByCircle":
               EventHandler.exec(TrueMapPanoKit,'GetSimplePanoByCircle', objReturn.pano);
               break;
            default:
                break;
        }
    },

    
    
         //注册事件
    Attach:function(eventName, eventMethod){
        EventHandler.attach(TrueMapPanoKit, eventName, eventMethod);
    },
    
    //函数开始----------------------------

    
    //获取所有全景列表
    GetAllPanoList:function()
    {
        var aParam = new Object();
        aParam["method"] = "GetAllPanoList";
        TrueMapPanoKit.AjaxRequest(aParam, "TrueMapPanoKit.AjaxReturn");  
    },
    SetPanoList:function(result)
    {
        if(result!=null)
        {
              TrueMapPanoKit.__panoList= result.panoList;
        }
    },
    //通过经纬度及半径获取单点全景对象
    GetSimplePanoByCircle:function(lon,lat,radius)
    {
        var aParam = new Object();
        aParam["lon"] = lon;
        aParam["lat"] = lat;
        aParam["radius"] = radius;
        aParam["method"] = "GetSimplePanoByCircle";
        TrueMapPanoKit.AjaxRequest(aParam, "TrueMapPanoKit.AjaxReturn");  
    },
    SetPano:function(result)
    {
        if(result!=null){
            if(result.pano!=null)
            {
                  TrueMapPanoKit.__pano= result.pano;
                  TrueMapPanoKit.ViewSimplePano(result.pano);
            }
            else
            {
                alert("没有全景数据！");
            }
        }
    },
    ViewSimplePano:function(pano)
    {
            if(pano==null)
                return;
            //var imageUrl = TrueMapImageKit.__control.GetImageUrl(); 
            //var _mPanoUrl = imageUrl.substr(0,imageUrl.indexOf("Image"));
            _mPanoUrl = panoUrl +"PanoImage/"+ pano.FileName;
             //alert(_mPanoUrl);
            var panoWindowUrl =JavaScriptServices +"/PanoView/LocalDemo.html?panoUrl="+_mPanoUrl;
            window.showModalDialog(panoWindowUrl, window, 'dialogHeight=420px;dialogWidth=640px;status=no;help=no;scroll=no;');
    }
};

TrueMapPanoKit.Attach('GetAllPanoList', TrueMapPanoKit.SetPanoList);
TrueMapPanoKit.Attach('GetSimplePanoByCircle', TrueMapPanoKit.SetPano);
