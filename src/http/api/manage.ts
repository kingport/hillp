import { request } from '@/http/axios'

class ManageApi {
  /**  获取客户列表 */
  static getClientList = (params: any) => request.post<any>('/api/client/index', params)
  /**  客户下拉列表 */
  static getClientSelect = (params: any) => request.post<any>('/api/client/select', params)
  /**  添加客户 */
  static saveClient = (params: any) => request.post<any>('/api/client/save', params)
  /**  查看客户详情 */
  static getClientDetail = (params: any) => request.post<any>('/api/client/get', params)
  /**  更新客户 */
  static updataServer = (params: any) => request.post<any>('/api/client/edit', params)
  /**  删除客户 */
  static deleteClient = (params: any) => request.post<any>('/api/client/delete', params)

  /**  服务列表 */
  static getServerList = (params: any = {}) => request.post<any>('/api/server_project/index', params)
  /**  添加服务 */
  static addServer = (params: any) => request.post<any>('/api/server_project/save', params)
  /**  查看服务详情 */
  static getServerDetail = (params: any) => request.post<any>('/api/server_project/get', params)
  /**  更新服务 */
  static editServe = (params: any) => request.post<any>('/api/server_project/edit', params)
  /**  删除服务 */
  static deleteServe = (params: any) => request.post<any>('/api/server_project/delete', params)

  /**  渠道列表 */
  static getChannelList = (params: any) => request.post<any>('/api/channel/index', params)
  /**  渠道下拉列表 */
  static getChannelSelect = (params: any) => request.post<any>('/api/channel/select', params)
  /**  添加渠道 */
  static addChannel = (params: any) => request.post<any>('/api/channel/save', params)
  /**  渠道详情 */
  static getChannelDetail = (params: any) => request.post<any>('/api/channel/get', params)
  /**  更新渠道 */
  static editChannel = (params: any) => request.post<any>('/api/channel/edit', params)
  /**  删除渠道（仅限独家） */
  static deleteChannel = (params: any) => request.post<any>('/api/channel/delete', params)
  /**  取消关联（非独家） */
  static cancelChannel = (params: any) => request.post<any>('/api/channel/cancel', params)
  /**  查看线上推广详情 */
  static getOnlineDetail = (params: any) => request.post<any>('/api/channel/getUser', params)
  /**  立即推广 */
  static nowPromotion = (params: any) => request.post<any>('/api/channel/editUser', params)

  /**  添加员工 */
  static addStaff = (params: any) => request.post<any>('/api/staff/save', params)
  /**  员工列表 */
  static getStaffList = (params: any) => request.post<any>('/api/staff/index', params)
  /**  员工下拉数据 */
  static getStaffSelect = (params: any) => request.post<any>('/api/staff/select', params)
  /**  查看员工详情 */
  static getStaffDetail = (params: any) => request.post<any>('/api/staff/get', params)
  /**  员工上下线 */
  static staffOnline = (params: any) => request.post<any>('/api/staff/online', params)
  /**  删除员工 */
  static deleteStaff = (params: any) => request.post<any>('/api/staff/delete', params)
  /**  取消关联 */
  static cancelStaff = (params: any) => request.post<any>('/api/staff/cancel', params)
  /**  编辑员工 */
  static editStaff = (params: any) => request.post<any>('/api/staff/edit', params)
  /**  查看员工线上资料（独家） */
  static extendStaff = (params: any) => request.post<any>('/api/staff/extend', params)
  /**  更新员工线上资料（独家） */
  static extendEdit = (params: any) => request.post<any>('/api/staff/extendEdit', params)

  /**  邮件邀请 */
  static inviteEmail = (params: any) => request.post<any>('/api/promotion/invite', params)
  /**  校验资格 */
  static checkPromotion = (params: any) => request.post<any>('/api/promotion/check', params)
  /**  广场 */
  static squareList = (params: any) => request.post<any>('/api/staff/square', params)
  /**  用户详情 */
  static userDetails = (params: any) => request.post<any>('/api/staff/userDetails', params)
  /** 申请签约 */
  static signingApply = (params: any) => request.post<any>('/api/staff/signingApply', params)
  /** 确认签约（关联） */
  static confirm = (params: any) => request.post<any>('/api/staff/confirm', params)

  /** 查看成本更改页面数据 */
  static getCost = (params: any) => request.post<any>('/api/staff/getCost', params)
  /** 成本更改审核*/
  static updateCost = (params: any) => request.post<any>('/api/staff/updateCost', params)
  /** 编辑用户线上资料*/
  static updateOnline = (params: any) => request.post<any>('/api/user_setting/updateOnline', params)
  /** 查看用户线上推广信息*/
  static getOnlineUser = (params: any) => request.post<any>('/api/user_setting/onlineUser', params)
}

export default ManageApi
