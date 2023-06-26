import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { axiosBaseOptions } from '@/http/axios/axios-setup'

import type { AxiosDownload, Upload, UrlDownload } from '@/http/axios/type'
import { getSign, isTimestamp } from '@/utils/util'
import moment from 'moment'
import md5 from 'md5'
import { Toast } from 'antd-mobile'
import { CHANNELID } from '@/constant'
import { store } from '@/redux'
import momentTz from 'moment-timezone'

class MyAxios {
  private readonly axiosInstance: AxiosInstance
  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options)
    this.initInterceptors()
  }

  private initInterceptors() {
    // 请求拦截  上传数据的加密处理在这里配置
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (config.data) {
          config.data.channelID = CHANNELID
          config.data.request_time = moment().unix()
          config.data.timezone = momentTz.tz.guess()
          const user_id = store.getState().global.userId
          if (user_id) config.data.user_id = user_id
          // 找出是时间戳的参数
          Object.keys(config.data).map((key) => {
            if (isTimestamp(config.data[key]) && key !== 'request_time') {
              // 强制将时间戳转换成东八区
              config.data[key] = moment(
                moment
                  .utc(config.data[key] * 1000)
                  .local()
                  .format()
              )
                .utc()
                .utcOffset(8)
                .unix()
            }
          })
          let sign = getSign(config.data.url, config.data)
          const token = store.getState().global.token
          if (token) sign = sign + `&token=${token}`
          const md5Sign = md5(sign).toUpperCase()
          config.data.sign = md5Sign
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    //响应拦截  从接口响应的数据在这里处理 例如解密等  时间发生在then catch前
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // resBaseInfo 针对接口返回有基本格式的情况下 如上面导入的resBaseInfo基本请求返回体 基本返回体由rsCode rsCause 和 data构成
        const { data } = response
        // 999 token 过期 666账号在其他地方登陆
        if ([999, 666].includes(data.status)) {
          window.location.href = `${window.location.origin}/user`
        }
        // 201 验证邮箱通过重定向
        if (
          data.status !== 200 &&
          data.status !== 201 &&
          data.status !== 202 &&
          data.status !== 203 &&
          data.status !== 205
        ) {
          Toast.show({
            content: `${data.msg}`,
          })
          return Promise.reject(data) //假设后台的错误信息放在了data中  这里根据情况修改
        }

        if (data instanceof Blob) {
          //兼容一下下方的文件下载处理
          return response
        } else {
          return Promise.resolve(data) //因为下方封装默认泛型默认定义到了response下的data下的resBaseInfo下的data
        }
      },
      (error: AxiosError) => {
        //需要对错误进行提示
        if (error?.response) {
          switch (error.response.status) {
            case 555:
              Toast.show('停服更新')
              break
            case 501:
              Toast.show('服务器异常')
              break
            case 404:
              Toast.show('HTTP异常')
              break
            case 413:
              Toast.show('Request Entity Too Large')
              break
            case 900:
              Toast.show('账号由于违规操作，账号已被平台管理员封禁')
              break
            default:
              Toast.show('其他错误信息')
          }
        }

        return Promise.reject(error)
      }
    )

    return this.axiosInstance
  }

  get<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.get(url, { params: data })
  }

  post<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.post(url, data)
  }

  put<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.put(url, data)
  }

  delete<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.delete(url, data)
  }

  upload<T = any>(data: Upload): Promise<T> {
    const { url, file, controller, onUploadProgress } = data
    return this.axiosInstance.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined, //用于文件上传可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824
    })
  }

  axiosDownload(params: AxiosDownload): void {
    const { url, data, controller, fileName, onDownloadProgress } = params
    this.axiosInstance
      .get<Blob>(url, {
        params: data,
        responseType: 'blob',
        onDownloadProgress,
        signal: controller ? controller.signal : undefined, //用于文件下载可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824以及https://axios-http.com/zh/docs/cancellation
      })
      .then((res) => {
        const blob = new Blob([res.data])
        const a = document.createElement('a')
        a.style.display = 'none'
        if (fileName) {
          a.download = fileName
        } else {
          //这里需要更据实际情况从‘content-disposition’中截取 不一定正确
          a.download = decodeURIComponent(
            res.headers['content-disposition'].split(';').slice(-1)[0].split('=')[1].replaceAll('"', '') //对于使用encodeURI()或者encodeURIComponent()将文件名中文转码的情况 这里解码一下
          )
        }
        a.href = URL.createObjectURL(blob)
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
      })
  }

  urlDownload(params: UrlDownload) {
    const { fileName, serveBaseUrl, fileUrl } = params
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = fileName
    a.href = serveBaseUrl ? `${serveBaseUrl}${fileUrl}` : fileUrl
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href) // 释放URL 对象
    document.body.removeChild(a)
  }
}

export const request = new MyAxios(axiosBaseOptions)
