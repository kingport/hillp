import { AnyAction } from 'redux'
import { GlobalState } from '@/redux/interface'
import produce from 'immer'
import * as types from '@/redux/mutation-types'

const globalState: GlobalState = {
  token: '',
  userId: '',
  userInfo: '',
  areaRegion: '',
  employeeForm: '',
  payInfo: '',
  messageNumber: '',
}

// global reducer
const global = (state: GlobalState = globalState, action: AnyAction) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case types.SET_TOKEN:
        draftState.token = action.token
        break
      case types.SET_USER_ID:
        draftState.userId = action.userId
        break
      case types.SET_USER_INFO:
        draftState.userInfo = action.userInfo
        break
      case types.SET_AREA_REGION:
        draftState.areaRegion = action.areaRegion
        break
      case types.UPDATA_EMPLOYEE_FORM:
        draftState.employeeForm = action.employeeForm
        break
      case types.SET_PAY_ORDER_INFO:
        draftState.payInfo = action.payInfo
        break
      case types.SET_MESSAGE_NUMBER:
        draftState.messageNumber = action.messageNumber
        break
      default:
        return draftState
    }
  })

export default global
