import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import UserApi from '@/http/api/user'
import { store } from '@/redux'
import { useRequest } from 'ahooks'
import { Toast } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'
import { CloseOutline } from 'antd-mobile-icons'

function verify() {
  const navigate = useNavigate()
  const location = useLocation()
  const user_id = store.getState().global.userId

  // 有登录态的短信验证
  const forgetPasswordOnline = async (type: number) => {
    return await UserApi.forgetPasswordOnline({ type, user_id })
  }

  const { run: verifySms } = useRequest(forgetPasswordOnline, {
    manual: true,
    onSuccess(res, params) {
      if (res.status === 200) {
        Toast.show(res.msg)
        navigate('/verification', { state: { change_id: res.data.change_id } })
      }
    },
  })

  return (
    <div className={`${styles.verify}`}>
      <HeaderNav title="账户验证" renderRight={false} />
      <div className="flex flex-col justify-center items-center pt-[48px]">
        <div className="flex mt-18 justify-center bg-[#edefee] items-center rounded-full w-[68px] h-[68px]">
          <SvgIcon name="lock" className="w-[29px] h-[38px]" />
        </div>
        <p className="text-sm text-color-[#000] pt-4">忘记密码</p>
        <p className="text-xs text-color-[#848484] pb-18">验证通过后将为您重设密码</p>
        <div
          onClick={() => {
            if (user_id) {
              navigate('/user/verify/sms', { state: { forgetType: 2 } })
            } else {
              navigate('/user/verify/phone')
            }
          }}
          className="shadow-sm py-4 px-5 flex items-center justify-between cursor-pointer rounded-md w-[82%] sm:(w-500px)"
        >
          <div className="flex flex-col ">
            <p className="text-xs text-color-[#000]">短信验证</p>
            <p className="text-xs text-color-[#9e9e9e]">通过手机号码接收短信验证码</p>
          </div>
          <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
        </div>
        <div
          onClick={() => {
            if (user_id) {
              navigate('/user/verify/sms', { state: { forgetType: 1 } })
            } else {
              navigate('/user/verify/email')
            }
          }}
          className="shadow-sm py-4 px-5 flex items-center justify-between cursor-pointer rounded-md w-[82%] mt-4 sm:(w-500px)"
        >
          <div className="flex flex-col">
            <p className="text-xs text-color-[#000]">邮箱验证</p>
            <p className="text-xs text-color-[#9e9e9e]">通过邮箱地址接收验证码</p>
          </div>
          <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
        </div>
      </div>
      <div onClick={() => navigate('/user/change/old/pwd')} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default verify
