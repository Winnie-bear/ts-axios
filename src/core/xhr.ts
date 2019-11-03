import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress
    } = config

    // 1.创建一个 request 实例
    const request = new XMLHttpRequest()
    // 2.执行 request.open 方法初始化
    request.open(method.toUpperCase(), url!, true)
    // 3.执行 configureRequest 配置 request 对象
    configureRequest()
    // 4.执行 addEvents 给 request 添加事件处理函数
    addEvents()
    // 5.执行 processHeaders 处理请求 headers
    processHeaders()
    // 6.执行 processCancel 处理请求取消逻辑
    processCancel()
    // 7.执行 request.send 方法发送请求
    request.send(data)

    // 配置请求
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        request.withCredentials = true
      }
    }

    // 监听事件
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        // 解析成对象
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        console.log(request.response, responseData)
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      // 处理网络错误
      request.onerror = function handleError() {
        reject('Network Error')
      }
      // 处理超时错误
      request.ontimeout = function handleTimeout() {
        reject(`Timeout of ${timeout} ms exceeded`)
      }
      // 处理文件下载事件
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      // 处理文件上传事件
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理请求头
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      if (withCredentials || (isURLSameOrigin(url!) && xsrfCookieName)) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }
      // 设置请求头
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 处理请求取消
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
    // 处理非2xx状态码错误
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(`Request failed with status code ${response.status}`)
      }
    }
  })
}
