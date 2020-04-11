const toString = Object.prototype.toString

// export function isDate(val: any): boolean {
//   return toString.call(val) === '[object Date]'
// }
export function isDate(val: any): val is Date { // 为了在使用时可以提示 类型谓词 类型保护
  return toString.call(val) === '[object Date]'
}

// export function isObject (val: any): val is Object {
//   return val !== null && typeof val === 'object' // 如果是 Formdata 这样的判断是有问题的
// }
export function isPlainObject(val: any): val is Object { // 为了在使用时可以提示 类型谓词 类型保护
  return toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
