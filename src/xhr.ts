import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index';
import { parseHeaders } from './helpers/headers';
import { createError } from './helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config;

    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType;
    }

    if (timeout) {
      request.timeout = timeout;
    }

    request.open(method.toUpperCase(), url, true);

    Object.keys(headers).forEach((name) => { // 设置headers  必须在 open send 之间
      if (data === null && name.toLocaleLowerCase() === 'content-type') { // 没有data 就不需要Content-Type
        delete headers[name];
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    })

    request.send(data);

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return;
      if (request.status === 0) return;
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ))
      }
    }
  })
}