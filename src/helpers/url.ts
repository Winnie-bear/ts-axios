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
  if (!params) {
    return url
  }

  const parsArr: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    //只跳出一层循环
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values = []
    //将val统一处理为数组
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parsArr.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parsArr.join('&')

  //是否存在hash形式
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    //是否已经存在参数
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }

  return url
}
