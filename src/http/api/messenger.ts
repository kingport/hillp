import { request } from '@/http/axios'

class MessengerApi {
  /**  新消息提醒 */
  static getNewMessage = (params: any) => request.post<any>('/api/message/newMessage', params)
  /**  消息列表 */
  static getMessageList = (params: any) => request.post<any>('/api/message/list', params)
  /**  消息操作 */
  static messageoperation = (params: any) => request.post<any>('/api/message/operation', params)
   /**  再次邀约 */
   static invitation = (params: any) => request.post<any>('/api/subscribe/invite', params)
}

export default MessengerApi
