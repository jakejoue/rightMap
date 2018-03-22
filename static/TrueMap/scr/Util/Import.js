
//IP地址(部署本产品后需根据IIS服务器所分配的IP地址来修改此变量)
var JavaScriptServices = "..";//后台服务URL
document.write('<script type="text/javascript" src="'+ JavaScriptServices +'/scr/Util/MicrosoftAjax.js"></script>');
document.write('<script type="text/javascript" src="'+ JavaScriptServices +'/scr/Util/MicrosoftAjaxResources.js"></script>');
document.write('<script type="text/javascript" src="'+ JavaScriptServices +'/scr/Util/Common.js"></script>');
document.write('<script type="text/javascript" src="'+ JavaScriptServices +'/scr/TrueMapKit/TrueMapPanoKit.js"></script>');



//配置文件
var Services = "http://192.168.2.5/TrueMapService/";//后台服务URL

var TrueMapPanoKitRequestUrl = Services + "/Services/PanoService.aspx";

//全景数据地址
var panoUrl = "http://192.168.2.5/mms/";    //全景数据服务地址

