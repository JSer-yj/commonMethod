
import axios from 'axios';
import qs from 'qs';

//拓展jsonP
axios.jsonp = (url, callbackName) => {
  if (!url) {
    return;
  }

  return new Promise((resolve) => {
    let JSONP = document.createElement("script");
    JSONP.type = "text/javascript";
    const connection = url.indexOf("?") !== -1 ? '&' : '?';
    JSONP.src = `${url}${connection}_cb=${callbackName}`;
    document.getElementsByTagName("head")[0].appendChild(JSONP);

    window[callbackName] = (res) => {
      // console.log(`${callbackName}:`,res)
      resolve(res)
      let innerTimer = setTimeout(() => {
          JSONP.remove();
          clearTimeout(innerTimer)
      }, 100)
    }

  })
}

export function axiospost({ url, data }) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data)).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  });
}
export function axiosget({ url, data }){
  return new Promise((resolve, reject) => {
    axios.get(url, { params: data }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  })
}

export function axiosJsonp({ url, callbackName }){
  return new Promise((resolve, reject) => {
    // 由于时间戳会出现两次一致的情况导致多个请求的数据不更新，所以加随机数区别
    const currCallbackName = `jsonCallBack${callbackName}_${(Math.random()*10000).toFixed()}_${new Date().getTime().toFixed().slice(9)}`
    axios.jsonp(url, currCallbackName).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  })
}
