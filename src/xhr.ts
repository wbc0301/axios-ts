import { AxiosRequestConfig } from './types/index';

export default function xh(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = config;
  const request = new XMLHttpRequest();
  request.open(method.toUpperCase(), url, true);
  request.send();
}