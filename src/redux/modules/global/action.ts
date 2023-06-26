import UserApi from '@/http/api/user'
import { store } from '@/redux'
import * as types from '@/redux/mutation-types'

// * setToken
export const setToken = (token: string) => ({
  type: types.SET_TOKEN,
  token,
})

// * setUserId
export const setUserId = (userId: string) => {
  return {
    type: types.SET_USER_ID,
    userId,
  }
}

// * setUserInfo
export const setUserInfo = (userInfo: string) => {
  return {
    type: types.SET_USER_INFO,
    userInfo,
  }
}

// * setAreaRegion
export const setAreaRegion = (areaRegion: any) => {
  return {
    type: types.SET_AREA_REGION,
    areaRegion,
  }
}

// updataUserInfo
export const updataUserInfo = async () => {
  const res = await UserApi.getUserInfo({})
  if (res.status === 200) {
    store.dispatch(setUserInfo(res.data))
  }
}

// 员工详细表单 基础表单
export const updataEmployeeForm = (employeeForm: any) => {
  return {
    type: types.UPDATA_EMPLOYEE_FORM,
    employeeForm,
  }
}

// 购买订单信息
export const setPayOrderInfo = (payInfo: any) => {
  return {
    type: types.SET_PAY_ORDER_INFO,
    payInfo,
  }
}

// 未读消息
export const setMessageNumber = (messageNumber: any) => {
  return {
    type: types.SET_MESSAGE_NUMBER,
    messageNumber,
  }
}
