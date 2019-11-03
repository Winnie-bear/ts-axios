import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'
// content-type ---> Content-Type
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

// 处理请求头
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(Headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

// 处理响应头
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null) // Object.create创建的对象不会继承Object.prototype上面的属性和方法
  if (!headers) {
    return parsed
  }
  headers.split('/r/n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}

// 把 `common`、`post` 的属性拷贝到 `headers` 这一级，然后再把 `common`、`post` 这些属性删掉
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
