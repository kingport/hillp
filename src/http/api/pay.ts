import { request } from '@/http/axios'

class PayApi {
  /**  获取套餐信息 */
  static getStripeInfo = (params: any) => request.post<any>('/api/stripe/info', params)
  /**  校验是否允许发起支付 */
  static payCheck = (params: any) => request.post<any>('/api/stripe/payCheck', params)
  /**  获取支付信息 */
  static pay = (params: any) => request.post<any>('/api/stripe/pay', params)
  /**  取消订阅 */
  static cancel = (params: any) => request.post<any>('/api/stripe/cancel', params)
}

export default PayApi
