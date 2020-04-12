import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) { // 无params参数
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') return;
    let valueList = []
    if (Array.isArray(val)) {  // params: {foo: ['bar', 'baz']}
      valueList = val
      key += '[]'   // foo[]=bar&foo[]=baz
    } else {
      valueList = [val]
    }
    valueList.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString() // 添加了类型谓词，这里val就可以有提示了
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`) // ['a=1','b=2']   |   ['foo[]=bar','foo[]=baz']
    })
  })

  let serializedParams = parts.join('&') //   /base/get?a=1&b=2   |  /base/get?foo[]=bar&foo[]=baz'

  if (serializedParams) {
    const markIndex = url.indexOf('#')  //   /base/get#hash
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)     //   /base/get
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url;
}
