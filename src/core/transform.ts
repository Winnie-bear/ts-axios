import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    // 每个转换函数返回的 `data` 会作为下一个转换函数的参数 `data` 传入
    data = fn(data, headers)
  })
  return data
}
