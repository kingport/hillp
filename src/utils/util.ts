import copy from 'copy-to-clipboard'
import { Toast } from 'antd-mobile'
import html2canvas from 'html2canvas'
import { map } from 'lodash'
import { GOOGLE_CLIENT_ID } from '@/constant'
import moment from 'moment'

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export const localGet = (key: string) => {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key) as string)
  } catch (error) {
    return value
  }
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 * @return void
 */
export const localSet = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @return void
 */
export const localRemove = (key: string) => {
  window.localStorage.removeItem(key)
}

/**
 * @description 清除所有localStorage
 * @return void
 */
export const localClear = () => {
  window.localStorage.clear()
}

/**
 * @description 复制内容到剪切板
 * @return void
 */
export const h5Copy = (content: string) => {
  copy(content)
  Toast.show('Success tips')
}

/**
 * @description 随机string
 * @return void
 */
export const getRandomString = (strLength = 16) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let str = ''
  for (let i = 0; i < strLength; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

/**
 * @description: 增加随机字符串 随机key值
 * @param {*} data
 * @return {*}
 */
export const addRandomKey = (data: any) =>
  map(data, (i: any) => ({
    ...i,
    key: getRandomString(),
  }))

/**
 * @description: 驼峰转连字符
 * @param {string} str 需要转换的字符
 * @return {*}
 */
export function humpToHyphen(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @description: 保存图片
 * @param {string} ref
 * @return {*}
 */
export function saveImage(canvasRef: any) {
  Toast.show('Loading...')
  html2canvas(canvasRef.current, { scale: 1, backgroundColor: 'rgba(255,255,255,1)' }).then(function (canvas) {
    const dataURL = canvas.toDataURL('image/png')
    downloadImage(dataURL, 'invite.png')
    Toast.clear()
  })
}

/**
 * @description: 图片下载
 * @param {string} url
 * @param {string} name
 * @return {*}
 */
export function downloadImage(url: string, name = 'download') {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name || 'download.png')
  link.click()
}

/**
 * @param url 请求的url,应该包含请求参数(url的?后面的参数)
 * @param requestParams 请求参数(POST的JSON参数)
 * @returns {string} 获取签名
 */
export function getSign(url: string, requestParams: any) {
  let signString = ''
  const urlParams = parseQueryString(url)
  const requestBody: any = sortObject(mergeObject(urlParams, requestParams))
  for (const i in requestBody) {
    signString += i + '=' + requestBody[i] + '&'
  }
  return signString.substring(0, signString.lastIndexOf('&'))
}

/**
 * @param url 请求的url
 * @returns {{}} 将url中请求参数组装成json对象(url的?后面的参数)
 */
export function parseQueryString(url: string) {
  // eslint-disable-next-line no-useless-escape
  const urlReg = /^[^\?]+\?([\w\W]+)$/,
    paramReg = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
    urlArray = urlReg.exec(url),
    result: any = {}
  if (urlArray && urlArray[1]) {
    const paramString = urlArray[1]
    let paramResult
    while ((paramResult = paramReg.exec(paramString)) != null) {
      result[paramResult[1]] = paramResult[2]
    }
  }
  return result
}

/**
 * @param object 传入要进行属性排序的对象
 * @returns {{}} 将对象进行属性排序(按首字母顺序进行排序)
 */
export function sortObject(object: any) {
  const objectKeys = Object.keys(object).sort()
  const result: any = {}
  for (const i in objectKeys) {
    result[objectKeys[i]] = object[objectKeys[i]]
  }
  return result
}

/**
 * @returns {*} 将两个对象合并成一个
 */
export function mergeObject(objectOne: any, objectTwo: any) {
  if (objectTwo != null) {
    for (const key in objectTwo) {
      objectOne[key] = objectTwo[key]
    }
  }
  return objectOne
}

/**
 * @description 截取第一位
 * @returns {*}
 */
export function stringAvatar(name: any) {
  if (name?.length === 0) name = 'H'
  return {
    children: `${name.substring(0, 1).toLocaleUpperCase()}`,
  }
}

/**
 * @description 获取Url参数
 * @returns {*}
 */
export function getUrlParam(name: string) {
  if (typeof name !== 'string') {
    return null
  }
  const $search = window.location.search
  const $hash = window.location.hash
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = null
  if ($search !== '') {
    r = $search.substr(1).match(reg)
  }
  if ($hash !== '' && r === null) {
    if ($hash.indexOf('?') > 0) {
      r = $hash.split('?')[1].match(reg)
    }
    if ($hash.indexOf('?') < 0 && $hash.indexOf('&') > 0) {
      r = $hash.substr($hash.indexOf('&')).match(reg)
    }
  }
  return r !== null ? unescape(r[2]) : null
}

/**
 * @description google登录弹出
 * @returns {*}
 */
export function oneTapSignInPrompt() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    cancel_on_tap_outside: false,
    itp_support: true,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  google.accounts.id.prompt()
}

/**
 * @description parse JWT token
 * @return {*}
 */
export function parseJwt(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

/**
 * @description get access token
 * @return {*}
 */
export function oauthSignIn(googleId: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const client = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
    hint: googleId,
    prompt: '', // Specified as an empty string to auto select the account which we have already consented for use.
    callback: (tokenResponse: any) => {
      const access_token = tokenResponse.access_token
      // onOneTapSignIn(access_token) // Reuse the token whichever way you want
    },
  })
  client.requestAccessToken()
}

/**
 * @description handleCredentialResponse
 * @return {*}
 */
export function handleCredentialResponse(response: any) {
  // One Tap Sign in returns a JWT token.
  const responsePayload = parseJwt(response.credential)
  if (!responsePayload.email_verified) {
    // showInvalidEmailToast();
    oneTapSignInPrompt()
  } else {
    // We are passing the signed in email id to oAuth.
    // If we pass an email id to oAuth consent.
    // If the user has already given the oAuth consent. it will get auto selected.
    oauthSignIn(responsePayload.email)
  }
}

/**
 * @description h5授权获取定位
 * @return {*}
 */
export function getCurrentPosition(callback: any) {
  if ('geolocation' in navigator) {
    let position
    navigator.geolocation.getCurrentPosition(callback)
  } else {
    alert('Not Available')
  }
}

/**
 * @description 获取周几
 * @return {*}
 */
export function getWeek(date: any) {
  const week = moment(date).day()
  switch (week) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 0:
      return '周日'
    default:
      break
  }
}

/**
 * @description 下载文件流
 * @return {*}
 */
export function downLoadDate(res: any) {
  const blob: any = new Blob([res.blob], {
    type: 'application/vnd.ms-excel', // excel格式文件
  })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'coupon_settlement_list.xlsx' // 设置下载的文件名称
  link.target = '_blank'
  link.click()
  window.URL.revokeObjectURL(blob)
}

/**
 * @description 当前设备是否是手机
 * @return {*}
 */
export function isMobileDevice() {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
}

/**
 * @description 是否是时间戳
 * @return {*}
 */
export function isTimestamp(timestamp: any) {
  const timestampRegex = /^\d{10}$/
  return timestampRegex.test(timestamp)
}
