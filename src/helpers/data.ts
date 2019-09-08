import { isPlainObject } from './util'

//send函数中的body支持 USVString，需要将data转为string类型
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
