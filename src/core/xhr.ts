import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config;
    const xhr = new XMLHttpRequest(); //【1】：创建 xhr
    if (responseType) { xhr.responseType = responseType }
    if (timeout) { xhr.timeout = timeout }
    xhr.open(method.toUpperCase(), url!, true) //【2】：open

    Object.keys(headers).forEach(name => { // 添加 Content-Type  
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]; // 没有data删除Content-Type
      } else {
        xhr.setRequestHeader(name, headers[name]); // 设置header必须在 open send 之间
      }
    })

    xhr.send(data); //【3】：发送请求

    xhr.onreadystatechange = function handleLoad() { //【4】： 监听readystatechange
      if (xhr.readyState !== 4) return;
      if (xhr.status === 0) return;
      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
      const responseData = responseType && responseType !== 'text' ? xhr.response : xhr.responseText;
      const response: AxiosResponse = { data: responseData, status: xhr.status, statusText: xhr.statusText, headers: responseHeaders, config, request: xhr };
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, xhr, response));
      }
    }

    xhr.onerror = function handleError() { //【4】：监听error
      reject(createError('Network Error', config, null, xhr));
    }

    xhr.ontimeout = function handleTimeout() { //【4】：监听timeout
      reject(createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', xhr));
    }
  })
}
