
//获取所有全景列表 
function GetAllPano()
{
    TrueMapPanoKit.GetAllPanoList();
}
//浏览全景
function ViewPano(x,y)
{
    //alert(x);
    TrueMapPanoKit.GetSimplePanoByCircle(y,x, 50);
}
 //划全景符号
function PanoPic() {

    for (var i = 0; i < TrueMapPanoKit.__panoList.length; i++) {
          //开始调用对方的画全景符号到地图上的方法
          parent.frameWebGIS.DrawPanoPic(TrueMapPanoKit.__panoList[i].Lat,TrueMapPanoKit.__panoList[i].Lon,TrueMapPanoKit.__panoList[i].Name);
    }
}
TrueMapPanoKit.Attach('GetAllPanoList',PanoPic);

