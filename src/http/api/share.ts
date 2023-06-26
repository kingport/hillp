import { request } from '@/http/axios'

class ShareApi {
  /**  获取分享信息 */
  static getShareInfo = (params: any) => request.post<any>('/api/share/index', params)
}

export default ShareApi
