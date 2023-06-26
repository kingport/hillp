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

class UploadApi {
  /**  上传文件   */
  static uploadFile = (files: any) => {
    const formData = new FormData()
    formData.append('file', files[0])
    const config: any = {}
    config.channelID = CHANNELID
    config.request_time = moment().unix()
    config.timezone = momentTz.tz.guess()
    config.user_id = store.getState().global.userId
    let sign = getSign(`/api/file/upload`, config)
    const token = store.getState().global.token
    sign = sign + `&token=${token}`
    const md5Sign = md5(sign).toUpperCase()
    config.sign = md5Sign
    formData.append('sign', md5Sign)
    formData.append('user_id', store.getState().global.userId)
    formData.append('request_time', `${moment().unix()}`)
    formData.append('channelID', CHANNELID)
    formData.append('timezone', momentTz.tz.guess())

    const currentEnv = import.meta.env.MODE
    const url =
      currentEnv === 'development'
        ? '/api/file/upload'
        : currentEnv === 'test'
        ? 'https://test-apiv1.clsdevops.com/api/file/upload'
        : 'https://apiv1.hiilp.com/api/file/upload'

    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}
export default UploadApi
