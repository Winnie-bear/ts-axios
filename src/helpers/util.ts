const toString = Object.prototype.toString

//自定义的类型保护：类型谓词
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is object {
  return toString.call(val) === '[object Object]'
}
