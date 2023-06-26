import { request } from '@/http/axios'

class PersonalApi {
  /**  编辑基础信息 */
  static editBaseUser = (params: any) => request.post<any>('/api/user_setting/update', params)
  /**  查看商家渠道信息 */
  static getChannelInfo = (params: any) => request.post<any>('/api/user_setting/getChannel', params)
  /**  校验商家名是否可用 */
  static checkName = (params: any) => request.post<any>('/api/user_setting/checkName', params)
  /**  编辑商家渠道信息 */
  static updateChannel = (params: any) => request.post<any>('/api/user_setting/updateChannel', params)
  /**  查看用户线上推广信息 */
  static onlineUserInfo = (params: any) => request.post<any>('/api/user_setting/onlineUser', params)
  /**  编辑用户线上资料 */
  static updateOnline = (params: any) => request.post<any>('/api/user_setting/updateOnline', params)
  /**  流水明细 */
  static assetList = (params: any) => request.post<any>('/api/user_setting/asset', params)
  /**  获取推广平台页面数据 */
  static getPromotion = (params: any) => request.post<any>('/api/user_setting/getPromotion', params)
  /**  设置推广平台 */
  static updatePromotion = (params: any) => request.post<any>('/api/user_setting/updatePromotion', params)
  /**   */
  static systemSetting = (params: any) => request.post<any>('/api/user_setting/system', params)
  /**  查看商家线上资料  */
  static onlineMerchant = (params: any) => request.post<any>('/api/user_setting/onlineMerchant', params)
  /**  更新商家线上资料  */
  static updateOnlineMerchant = (params: any) => request.post<any>('/api/user_setting/updateOnlineMerchant', params)
  /**  更新头像  */
  static updateHead = (params: any) => request.post<any>('/api/user_setting/updateHead', params)
  /**  获取验证码  */
  static getVerifyCode = (params: any) => request.post<any>('/api/verify_code/send', params)
  /**  校验验证码  */
  static checkVerifyCode = (params: any) => request.post<any>('/api/verify_code/check', params)
}

export default PersonalApi
