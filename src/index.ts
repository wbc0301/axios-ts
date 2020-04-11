import { AxiosRequestConfig, AxiosPromise, AxiosResponse} from './types/index';
import xhr from './xhr';
import { buildURL } from './helpers/url';
import { transformRequest, transformResponse } from './helpers/data';
import { processHeaders } from './helpers/headers';

function transformRequestURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params); // 拼接 param 到 url
}

function transformRequesHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data);
}

function processConfig(config: AxiosRequestConfig): void { // 处理配置对象
  config.url = transformRequestURL(config);
  config.headers = transformRequesHeaders(config);
  config.data = transformRequestData(config);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  })
}
export default axios