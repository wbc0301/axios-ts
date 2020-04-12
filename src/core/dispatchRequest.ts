import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';
import xhr from './xhr';
import { buildURL } from '../helpers/url';
import { transformRequest, transformResponse } from '../helpers/data';
import { processHeaders } from '../helpers/headers';

function transformRequestURL(config: AxiosRequestConfig): string { // 处理请求 url
  const { url, params } = config;
  return buildURL(url!, params);
}

function transformRequestHeaders(config: AxiosRequestConfig): any { // 处理请求 headers
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

function transformRequestData(config: AxiosRequestConfig): any { // 处理请求 Data
  return transformRequest(config.data);
}

function transformResponseData(res: AxiosResponse): AxiosResponse { // 处理响应 Data 
  res.data = transformResponse(res.data);
  return res;
}

function processRequestConfig(config: AxiosRequestConfig): void { // 统一处理请求配置
  config.url = transformRequestURL(config);
  config.headers = transformRequestHeaders(config);
  config.data = transformRequestData(config);
}

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processRequestConfig(config);  // 统一处理请求配置
  return xhr(config).then(res => { // 调用xhr
    return transformResponseData(res); // 处理响应数据
  })
}
