/**
* 坐标转换，百度地图坐标转换成腾讯地图坐标
* lng 百度经度（pointy）
* lat 百度纬度（pointx）
* @returns [lng,lat]
*/
export const BMapToTencentMap = (lng, lat) =>  {
    if (lng == null || lng == '' || lat == null || lat == '')
      return [lng, lat];
    const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    const x = parseFloat(lng) - 0.0065;
    const y = parseFloat(lat) - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    const t_lng = (z * Math.cos(theta)).toFixed(7);
    const t_lat = (z * Math.sin(theta)).toFixed(7);
    return [t_lng, t_lat];
}
  
/**
 * 腾讯地图转换成百度地图坐标
 * @param lng 腾讯经度（pointy）
 * @param lat 腾讯纬度（pointx）
 * @returns [lng,lat]
 */
export const TencentMapToBMap = (lng, lat) =>  {
    if (lng == null || lng == '' || lat == null || lat == '')
        return [lng, lat];
    const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    const x = parseFloat(lng);
    const y = parseFloat(lat);
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    const bd_lng = (z * Math.cos(theta) + 0.0065).toFixed(5);
    const bd_lat = (z * Math.sin(theta) + 0.006).toFixed(5);
    return [bd_lng, bd_lat];
}

/**
 * 处理时间
 * @param {Date}date
 * @param {String}formateStyle 显示格式
 * @param {Boolean}noTime 不显示时分秒，默认显示
 * @return {String}处理以后的时间字符串
 */
export const FormatTime = (date, formateStyle, noTime) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
  
    let _date = [year, month, day].map(formatNumber)
    if(formateStyle!='年月日'){
      let _style = formateStyle || '/'
      _date = _date.join(_style) 
    }else{
      _date=`${_date[0]}年${_date[1]}月${_date[2]}日`
    }
    
    if(noTime){
      return _date
    }else{
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      return _date + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
}
// 个位数前补0
const formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 判断字符宽度，以汉字宽度为单位1
 * @param {String}chr 字符
 * @return {Number}返回字符相对于汉字的宽度比例
 */
export const GetBitWidth = (chr) => {
    let seven = /[ABCDEFGHJKLMNOPQRSTUVWXYZ]/,
      six = /[ilI\d]/,
      three = /[ilI·]/;
    if (seven.test(chr)) {
      return 0.7
    }
    if (six.test(chr)) {
      return 0.6
    }
    if (three.test(chr)) {
      return 0.3
    }
    if (!/[^\x00-\xff]/.test(chr)) {
      return 0.5
    }
    return 1
}

/**
 * 获取变量类型
 * @param {*}some
 * @return {String} including:
 * Object、Array、Set、Number、String、Boolean、Undefined、Null、Date、...
 */
export const GetType = (some) => {
    const someType = Object.prototype.toString.call(some);
    const theType = (someType.match(/[^(\[object )]\w+[^\]]/g))[0];
    return theType;
}

/**
 * 将参数处理成 & 拼接的字符串
 * @param {Object} params 
 * @return {String} 
 */
export const SerializeParams = (params) => {
    let dataString = '';
    for (let key in params) {
      if (GetType(params[key]) === 'String') {
        dataString += `${key}=${params[key]}&`;
      } else {
        dataString += `${key}=${JSON.stringify(params[key])}&`;
      }
    }
    return dataString
}

/**
 * 按属性首字母升序排列对象
 * @param {Object} paramsObj 
 * @return {Object} 
 */
export const AscendingPropertyByLetter = (paramsObj) => {
    let paramsKey = Object.keys(paramsObj);
    paramsKey.sort((s1, s2) => {
      const x1 = s1.toUpperCase();
      const x2 = s2.toUpperCase();
      if (x1 < x2) return -1;
      if (x1 > x2) return 1;
      return 0;
    })
    let dataSort = {};
    paramsKey.forEach((it) => {
      dataSort[it] = paramsObj[it];
    })
    return dataSort;
}  

/**
 * 处理字符串高亮, 以关键字为分界线
 * 将目标字符串处理成数组
 * @param {String}str 目标字符串
 * @param {String}key 高亮关键字
 * @return {Array}
 */
export const GetLightArr = (str, key) => {
    key = key.toString().split("");
    key.forEach((item)=>{
      str = str.toString().replace(new RegExp(`${item}`, 'g'), `%%%${item}%%%`);
    })
    str = str.split('%%%')
    let res=[];
    str.forEach((it)=>{
      if(!!it){
        if(key.indexOf(it)!==-1){
          res.push({
            val: it,
            lighter: true
          })
        }else{
          res.push({
            val: it
          })
        }
      }
    });
    return res;
}

/**
 * 生成随机数
 * @param {Number}n 随机数位数
 * @return {Number}
 */
export const GetRandom = (n) => {
    return Math.floor(Math.random() * Math.pow(10, n));
}

/**
 * 防抖
 * @return {Function(fn, delay)}
 */
export const Debounce = () => {
    let timer;
    return (fn, delay) => {
      clearTimeout(timer);
      delay = delay||500;
      timer = setTimeout(()=>{
        fn & fn();
        clearTimeout(timer);
      }, delay)
    }
}
  
  
/**
 * 节流
 * @return {Function(fn, delay)}
 */
export const Throttle = () => {
    let timer = null, 
      stop = false;
    return (fn, interval) => {
      interval = interval || 500;
      if(stop) 
        return;
      stop = true;
      timer = setTimeout(()=>{
        fn & fn();
        stop = false;
        clearTimeout(timer);
      }, interval)
    }
}

/**
 * 拼接url
 * @param {String} baseUrl 
 * @param {Object} params 
 * @return {String}  
 */
export const urlSplice = (baseUrl, params) => {
    if(!params || !params instanceof Object) return baseUrl || '';
    Object.keys(params).forEach((key,idx)=>{
        const connection = idx === 0 ? '?' : '&';
        baseUrl += `${connection}${key}=${params[key]}`
    })
    return baseUrl
};

/**
 * canvas文字折行
 * @param ctx canvas实例
 * @param text 文本内容
 * @param x x轴坐标
 * @param y y轴坐标
 * @param w 每行最大宽度
 * @param fontStyle 文本样式
 * @param rowNum 最多显示行数
 * @return {number} 文本实际行数
**/ 
export function canvasFontBreak(ctx, text, x, y, w, fontStyle, rowNum) {
    ctx.save();
    ctx.font = fontStyle.font;
    ctx.fillStyle = fontStyle.fillStyle;
    ctx.lineHeight = fontStyle.lineHeight;
    const chr = text.split('');
    const row = [];
    let temp = '';
    let len = temp.length;
    let oneChrWidth = 0;
    if (chr.length > 0) {
        let _i = 0;
        // console.log(chr[_i], !!chr[_i], chr[_i] == '');
        while ((!/[^\x00-\xff]/.test(chr[_i]) || /[‘“’”]/.test(chr[_i])) && chr[_i]) {//若不是双字节
            ++_i;
        }
        oneChrWidth = ctx.measureText(chr[_i]).width;
        oneChrWidth = Number(oneChrWidth.toFixed());
    }
  
    // 末尾是，！。》不换行， 《 换行
    let flag = false;//是否第一次超出限制宽度
    for (let a = 0; a < chr.length; a++) {
        let currLen = len;
        if (chr[a] && !/[^\x00-\xff]/.test(chr[a])) {
            currLen += 0.5;
        }
        else {
            ++currLen;
        }
        if (currLen * oneChrWidth < w || flag == false) {
            if (currLen * oneChrWidth > w)
                flag = true;//第一次超出限制宽度
            temp += chr[a];
            len = currLen;
            if (a == chr.length - 1)
                row.push(temp);
        }
        else {
            flag = false;
            if (/[，。！》]/im.test(chr[a])) {
                // 因为是特殊符号，所以宽度超了，也要加上
                temp += chr[a];
            }
            else {
                a--;//因为算上当前字符，宽度超了，所以减去它
            }
            if (/[《]/im.test(chr[a])) {
                // 因为是特殊符号，所以删除这个字符，放到下一行去
                temp = temp.substr(0, temp.length - 1);
                a--;
            }
            row.push(temp);
            temp = '';
            len = temp.length;
        }
    }
    if (row.length > rowNum) {
        let lastLine = row[rowNum - 1];
        const lastThreeChr = lastLine.slice(lastLine.length - 3, lastLine.length);
        let lastThreeLen = 0;
        for (let i = 0; i < 3; i++) {
            if (/[^\x00-\xff]/.test(lastThreeChr[i])) {
                lastThreeLen += 0.33;
            }
            else {
                ++lastThreeLen;
            }
        }
        lastThreeLen = Math.ceil(lastThreeLen);
        lastLine = `${lastLine.slice(0, lastLine.length - lastThreeLen)}...`;
        row[rowNum - 1] = lastLine;
    }
    const lines = Math.min(row.length, rowNum);
    for (let b = 0; b < lines; b++) {
        ctx.fillText(row[b], x, y + b * fontStyle.lineHeight);
    }
    return lines;
}
  
/**
 * 绘制一个有填充色的圆角矩形 
 * @param cxt:canvas的上下文环境 
 * @param x:左上角x轴坐标 
 * @param y:左上角y轴坐标 
 * @param width:矩形的宽度 
 * @param height:矩形的高度 
 * @param radius:圆的半径 
 * @param fillColor:填充颜色 
 **/
export function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
    //圆的直径必然要小于矩形的宽高          
    if (2 * radius > width || 2 * radius > height) { return false; }
  
    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
    cxt.fill();
    cxt.restore();
}

function drawRoundRectPath(cxt, width, height, radius) {
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
  
    //矩形下边线  
    cxt.lineTo(radius, height);
  
    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
  
    //矩形左边线  
    cxt.lineTo(0, radius);
  
    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
  
    //上边线  
    cxt.lineTo(width - radius, 0);
  
    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
  
    //右边线  
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}
  
/**
 * 设置cookie
 * @param {String} N cookie名称
 * @param {String} V cookie值
 * @param {Number} Q 过期时间，单位：分钟
 */
export function setRegionCookie(N, V, Q) {
  var L = new Date();
  var domain = document.domain;
  var a = domain.split('.');
  if (a.length >=2) {
     domain = '.'+a[a.length-2]+'.'+a[a.length-1];
     if(Q){
        var z = new Date(L.getTime() + Q * 60000);
        document.cookie = N + "=" + V + ";path=/;domain=" + domain + ";expires=" + z.toGMTString() + ";";
     }else{
        document.cookie = N + "=" + V + ";path=/;domain=" + domain + ";";
     }
  }
};



module.exports = {
    BMapToTencentMap,
    TencentMapToBMap,
    FormatTime,
    GetBitWidth,
    GetRandom,
    GetType,
    GetLightArr,
    SerializeParams,
    AscendingPropertyByLetter,
    Debounce,
    Throttle,
    urlSplice,
    canvasFontBreak,
    fillRoundRect,
    setRegionCookie
}