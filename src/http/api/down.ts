import { CHANNELID } from '@/constant'
import { store } from '@/redux'
import { getSign } from '@/utils/util'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import md5 from 'md5'
import moment from 'moment'
import momentTz from 'moment-timezone'

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    error.globalErrorProcess = function () {
      switch (this.response.status) {
        case 413: // 处理基本 401 错误
          Toast.show(`${error?.response?.status}${error?.response?.statusText}`)
          break
      }
      return Promise.reject(this)
    }
    return error.globalErrorProcess()
  }
)

class DownApi {
  /**  下载导出   */
  static uploadFile = (data: any) => {
    const config: any = {}
    config.channelID = CHANNELID
    config.request_time = moment().unix()
    config.timezone = momentTz.tz.guess()
    config.user_id = store.getState().global.userId
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        config[key] = data[key]
      }
    })
    let sign = getSign(`/api/export/download`, config)
    const token = store.getState().global.token
    sign = sign + `&token=${token}`
    const md5Sign = md5(sign).toUpperCase()
    config.sign = md5Sign

    const currentEnv = import.meta.env.MODE
    const url =
      currentEnv === 'development'
        ? '/api/export/download'
        : currentEnv === 'test'
        ? 'https://test-apiv1.clsdevops.com/api/export/download'
        : 'https://apiv1.hiilp.com/api/export/download'

    return axios
      .post<Blob>(
        url,
        {
          ...config,
        },
        {
          responseType: 'blob',
        }
      )
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/octet-stream' })
        // 获取heads中的filename文件名
        const downloadElement = document.createElement('a')
        // 创建下载的链接
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        // 下载后文件名
        downloadElement.download = 'down.xlsx'
        document.body.appendChild(downloadElement)
        // 点击下载
        downloadElement.click()
        // 下载完成移除元素
        document.body.removeChild(downloadElement)
        // 释放掉blob对象
        window.URL.revokeObjectURL(href)
      })
  }
}
export default DownApi
