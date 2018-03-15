import getContent from './track';

const infoTemplate = new KMap.InfoTemplate();

infoTemplate.setTitle(`
    <div class='titleBar'>
        <a InfoTag href='javascript:void(0);'>详细信息</a>
        <a InfoTag href='javascript:void(0);'>轨迹回放</a>
    </div>
`);

infoTemplate.setContent(`
    <ul InfoTag>
        <li><b>车牌号：</b>\${gpsName}<b style="margin-left:20px">速度：</b>\${Speed}km/h</li>
        <li><b>所属单位：</b>\${department}</li>
        <li><b>司机姓名：</b>\${driver}</li>
        <li><b>司机电话：</b>\${phone}</li>
        <li><b>定位时间：</b>\${Time}</li>
        <li style='display:flex;'>
            <b>车辆位置：</b>
            <span class='spanTitle' style='max-width:220px' title='\${location}' >\${location}</span>
        </li>
    </ul>
    ${getContent('car')}
`);

export default infoTemplate;
