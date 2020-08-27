import { SerializeParams, AscendingPropertyByLetter } from 'commonMethod';
import { HexMD5 } from 'your.md5.file';

export const HttpMethod = {
  'GET': 'get',
  'POST': 'post'
}

export const ContentType = {
  'DEFAULT': 'application/json',
  'QUERY_STRING': 'application/x-www-form-urlencoded'
}

export const HttpClientHost = {
  'DEFAULT': 'https://xxx',
}

/**
 * 生成md5参数
 * @param {Object} data 参数对象
 * @return {Object} md5参数
 */
export const GetPublicParams = (data) => {
  const appkey = 'xxxxxx',
    appsecret = 'xxxxxx';

  let newData = Object.assign({
    appkey: appkey,
  }, data);

  // 字符串升序排列参数
  let dataSort = AscendingPropertyByLetter(newData);

  // ‘&’拼接参数
  let dataString = SerializeParams(dataSort);
  dataString += `appsecret=${appsecret}`;

  // 获取MD5签名
  const dataMd5 = HexMD5(dataString)
  newData.sign = dataMd5;
  newData.appkey = appkey;
  return newData;
}

/**
 * 生成请求条件
 */
export const GetCurrRequest = (
  reqType, 
  urlName, 
  hostName, 
  contentType, 
  needToken
) => {
  return {
    type: reqType,
    url: urlName,
    host: hostName,
    contentType,
    needToken
  };
}