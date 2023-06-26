import { request } from '@/http/axios'

class CalendarApi { 
  /**  我的日历 */
  static getMySubscribe = (params: any) => request.post<any>('/api/subscribe/index', params)
  /**  预约页面数据 */
  static subscribeParam = (params: any) => request.post<any>('/api/subscribe/param', params)
  /**  添加预约 */
  static subscribeSave = (params: any) => request.post<any>('/api/subscribe/save', params)
  /**  查看预约 */
  static getSubscribeDetail = (params: any) => request.post<any>('/api/subscribe/get', params)
  /**  校验是否允许预约 */
  static checkSubscribe = (params: any) => request.post<any>('/api/subscribe/check', params)
  /**  查看客户资料 */
  static getClientInfo = (params: any) => request.post<any>('/api/subscribe/getClient', params)
  /**  操作更改订单 */
  static editOrder = (params: any) => request.post<any>('/api/subscribe/editOrder', params)
  /**  订单评分 */
  static evaluateOrder = (params: any) => request.post<any>('/api/subscribe/evaluate', params)
  /**  编辑预约 */
  static editSubscribe = (params: any) => request.post<any>('/api/subscribe/edit', params)
  /**  订单看板 */
  static orderSubscribe = (params: any) => request.post<any>('/api/subscribe/order', params)

  /**  添加休息 */
  static restSave = (params: any) => request.post<any>('/api/rest/save', params)
  /**  删除休息 */
  static restDelete = (params: any) => request.post<any>('/api/rest/delete', params)
  /**  查看休息 */
  static getRest = (params: any) => request.post<any>('/api/rest/get', params)
  /**  更新休息 */
  static editRest = (params: any) => request.post<any>('/api/rest/edit', params)

  /**  排班列表 */
  static scheduleList = (params: any) => request.post<any>('/api/schedule/index', params)
  /**  添加排班 */
  static saveSchedule = (params: any) => request.post<any>('/api/schedule/save', params)
  /**  更新排班 */
  static editSchedule = (params: any) => request.post<any>('/api/schedule/edit', params)
  /**  删除排班 */
  static deleteSchedule = (params: any) => request.post<any>('/api/schedule/delete', params)
}

export default CalendarApi
