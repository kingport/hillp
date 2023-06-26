import { request } from '@/http/axios'

class InformationApi {
  /**  获取资料下拉 */
  static getInformationList = (params: any) => request.post<any>('/api/information/select', params)
}

export default InformationApi
