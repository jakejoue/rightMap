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
        <li><b>姓&nbsp;&nbsp;&nbsp;&nbsp;名：</b>\${Name}</li>
        <li><b>性&nbsp;&nbsp;&nbsp;&nbsp;别：</b>\${Sex}</li>
        <li><b>在&nbsp;&nbsp;&nbsp;&nbsp;线：</b>\${State}</li>
        <li><b>联系电话 ：</b>\${Mobile}</li>
        <li><b>定位时间 ：</b>\${TimeStr}</li>
    </ul>
    ${getContent('observer')}
 `);

export default infoTemplate;
