import { request } from '@/http/axios'

class DataBaseApi {
  /**  获取数据首页 */
  static getDataBase = (params: any) => request.post<any>('/api/data/index', params)
  /**  只获取营业额 */
  static getTurnover = (params: any) => request.post<any>('/api/data/getTurnover', params)
  /**  获取营业额明细 */
  static getTurnoverDetail = (params: any) => request.post<any>('/api/data/getTurnoverDetail', params)
  /**  获取收款方式明细 */
  static getIncomeDetail = (params: any) => request.post<any>('/api/data/getIncomeDetail', params)
  /**  获取员工获取渠道明细 */

  static getChannelOrStaffDetail = (params: any) => request.post<any>('/api/data/getChannelOrStaffDetail', params)
  /**  获取类型明细 */
  static getSaleTypeDetail = (params: any) => request.post<any>('/api/data/getSaleTypeDetail', params)
  /**  获取时长明细 */
  static getDurationDetail = (params: any) => request.post<any>('/api/data/getDurationDetail', params)

  /**  获取订单列表 */
  static getOrderList = (params: any) => request.post<any>('/api/data/getOrderList', params)
  /**  获取员工列表 */
  static getChannelOrStaffList = (params: any) => request.post<any>('/api/data/getChannelOrStaffList', params)
  /**  获取财务列表 */
  static getFinanceList = (params: any) => request.post<any>('/api/data/getFinanceList', params)

  /**  获取订单筛选条件 */
  static getOrderFilter = (params: any) => request.post<any>('/api/data/getOrderFilter', params)
  /**  获取财务筛选条件 */
  static getFinancePayType = (params: any) => request.post<any>('/api/data/getFinancePayType', params)
}

export default DataBaseApi
