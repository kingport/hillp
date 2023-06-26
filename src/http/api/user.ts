import { request } from '@/http/axios'

/** 这里枚举定义所有接口 */
enum APIS {
  GET_EMAIL_CODE = '/api/login/checkEmail',
  GET_REGION_AND_AREA = '/api/login/getRegionAndArea',
}

class UserApi {
  /**  获取邮箱验证码 */
  static getEmailCode = (params: any) => request.post<any>(APIS.GET_EMAIL_CODE, params)
  /**  校验邮箱验证码 */
  static checkEmailCode = (params: any) => request.post<any>('/api/login/checkEmailCode', params)
  /**  获取区号和地区 */
  static getRegionAndArea = () => request.post<any>(APIS.GET_REGION_AND_AREA, {})
  /**  获取短信验证码 */
  static getPhoneCode = (params: any) => request.post<any>('/api/login/checkPhone', params)
  /**  提交数据以及校验手机验证码 */
  static registerAccount = (params: any) => request.post<any>('/api/login/register', params)
  /**  登录 */
  static login = (params: any) => request.post<any>('/api/login/signin', params)
  /**  退出登录 */
  static logout = (params: any) => request.post<any>('/api/login/logout', params)
  /**  退出登录 */
  static getUserInfo = (params: any) => request.post<any>('/api/user/getUserInfo', params)
  /**  修改密码-验证登录密码 */
  static checkPassword = (params: any) => request.post<any>('/api/user/checkPassword', params)
  /**  修改密码-更改密码 */
  static changeNewPassword = (params: any) => request.post<any>('/api/user/changeNewPassword', params)
  /**  忘记密码-已经登录-获取验证码 */
  static forgetPasswordOnline = (params: any) => request.post<any>('/api/login/forgetPasswordOnline', params)
  /**  忘记密码-未登录-获取验证码 */
  static forgetPassword = (params: any) => request.post<any>('/api/login/forgetPassword', params)
  /**  忘记密码-验证验证码 */
  static forgetPasswordCheckCode = (params: any) => request.post<any>('/api/login/forgetPasswordCheckCode', params)
  /**  忘记密码-更改密码 */
  static forgetChangeNewPassword = (params: any) => request.post<any>('/api/login/changeNewPassword', params)
  /** 注销账号 */
  static delAccount = (params: any) => request.post<any>('/api/user/delAccount', params)
  /** google登录 */
  static googleLogin = (params: any) => request.post<any>('/api/login/googleLogin', params)
  /** faceBook登录 */
  static facebookLogin = (params: any) => request.post<any>('/api/login/facebookLogin', params)
  /** 获取短信最近10条 */
  static testgetphonecode = (params: any) => request.post<any>('/api/login/getCode', {})
  static search = (params: any = {}) => request.post<any>('/api/subscribe/search', params)
  static getFqIndex = (params: any = {}) => request.post<any>('/api/fq/index', params)
}
export default UserApi
