import { API } from './apis';
import { HttpMethod, ContentType, HttpClientHost, GetPublicParams } from './static';

/**
 * 网络拦截器
 */ 
class DefaultHttpInterceptor {
  CODE_SUCCESS = 200;

  handleResponse(statusCode, data, callback){
    if(statusCode === this.CODE_SUCCESS){
      callback.onSuccess(data)
    } else {
      callback.onServerError(data)
    }
  }
}

/**
 * http请求
 */
class HttpRequest {
  /**
   * @param {Object} request 网络请求元素
   * @param {Function} callback 请求回调
   * @param interceptor 自定义拦截器
   */
  constructor(request, callback, interceptor){
    this.httpInterceptor = interceptor || new DefaultHttpInterceptor()
    this.request = request
    this.callback = callback
    this.init()
  }

  /**
   * 初始化
   */ 
  init(){
    const {api, hostName, params, method, needToken, contentType} = this.request
    this.url = this.buildUrl(api, hostName)
    this.data = GetPublicParams(params)
    this.method = method
    this.header = this.buildHeader(method, contentType, needToken)
    this.handleRequest()
  }

  /**
   * 构建url
   * @param {String} api api名
   * @param {String} host 域名
   * @return {String} url
   */
  buildUrl(api, host = HttpClientHost['DEFAULT']){
    return host + api;
  }

  /**
   * 构建headers
   * @param {String} method
   * @param {Boolean} needToken
   * @return {Headers} headers
   */
  buildHeader(method, contentType = ContentType['DEFAULT'], needToken = false){
    if (method === HttpMethod.GET && contentType !== ContentType['DEFAULT']) {
      contentType = ContentType['DEFAULT'];
    }
    let res = {
      "content-type": contentType
    }
    if(needToken)
      res.token = 'token';
    return res;
  }

  /**
   * 触发http请求
   */
  handleRequest(){
    const {url, data, method, header} = this
    wx.request({
      url,
      data,
      method,
      header,
      success: (result) => {
        this.httpInterceptor.handleResponse(result.statusCode, result.data, this.callback)
      },
      fail:(error) => {
        this.httpInterceptor.handleResponse(error.statusCode, error, this.callback)
      }
    })
  }
}

/**
 * 接口回调
 */
class DefaultCallback {
  constructor(success, serverError, networkError) {
      this.onSuccess = success

      if (serverError) {
          this.onServerError = serverError
      } else {
          this.onServerError = (error) => {
              console.log(error.msg)
          }
      }

      if (networkError) {
          this.onNetworkError = networkError
      } else {
          this.onNetworkError = (error) => {
              console.log(error.msg)
          }
      }
  }
}

let LIST = {}

for (const key in API) {
  LIST[key] = (params = {}, done, error) => {
    const _api = API[key];
    const {type, url, host, contentType, needToken} = _api
    return new HttpRequest(
      {
        method: type,
        api: url,
        hostName: host,
        contentType,
        needToken,
        params
      }, 
      new DefaultCallback((data) => {
        done && done(data)
      }, (data) => {
        error && error(data)
      }, (data) => {
        error && error(data)
      })
    )
  }
}

export const API_LIST = LIST
