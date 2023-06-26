import React from 'react'
import styles from './index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { PasscodeInput, Toast, NumberKeyboard } from 'antd-mobile'
import { useCountDown, useMount, useRequest, useSize } from 'ahooks'
import UserApi from '@/http/api/user'
import { store } from '@/redux'

const verifySms = () => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const user_id = store.getState().global.userId
  const size = useSize(document.querySelector('body'))

  const formData = location.state?.formData
  const forgetType = location.state?.forgetType

  const [targetDate, setTargetDate] = useState<number>()
  const [changeId, setChangeId] = useState<string>('')

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined)
    },
  })

  const forgetPassword = async () => {
    return await UserApi.forgetPassword({ ...formData })
  }
  const { run: sendCodeOffline, refresh: refreshOffline } = useRequest(forgetPassword, {
    manual: true,
    onSuccess(res) {
      if (res.status === 200) {
        Toast.show(res.msg)
        setChangeId(res.data.change_id)
        setTargetDate(Date.now() + 60000)
      }
    },
  })

  const forgetPasswordOnline = async () => {
    return await UserApi.forgetPasswordOnline({
      type: forgetType,
      user_id,
    })
  }
  const { run: sendCode, refresh } = useRequest(forgetPasswordOnline, {
    manual: true,
    onSuccess(res) {
      if (res.status === 200) {
        Toast.show(res.msg)
        setChangeId(res.data.change_id)
        setTargetDate(Date.now() + 60000)
      }
    },
  })

  useMount(() => {
    if (forgetType) {
      sendCode()
    }
    if (formData) {
      sendCodeOffline()
    }
  })

  const forgetPasswordCheckCode = async (vcode: string) => {
    return await UserApi.forgetPasswordCheckCode({ change_id: changeId, vcode, user_id })
  }

  const { run: verifySms } = useRequest(forgetPasswordCheckCode, {
    manual: true,
    onSuccess(res) {
      navigate('/user/change/pwd', { state: { forget_change_id: res.data.change_id } })
    },
  })

  const againSend = () => {
    if (targetDate) return false
    if (forgetType) refresh()
    if (formData) refreshOffline()
  }

  const onFill = (codes: string) => {
    verifySms(codes)
  }

  return (
    <div className={`${styles.verification} px-8 py-8`}>
      <div className="flex items-center justify-between sm:(hidden)">
        <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-[26px] h-[12px] ml-2" />
        <SvgIcon name="logo" className="w-[84px] h-[20px] -ml-[26px]" />
        <div></div>
      </div>
      <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8 sm:(w-500px m-auto mt-100px)">
        <p className="text-center text-color-[#2A4948] text-xl font-600">请输入验证码</p>
        <span className="pb-8 text-xs text-color-[#B0B0B0] pt-2">
          四位数代码已发送至您的{forgetType ? '邮箱' : '手机'}
        </span>
        {size?.width && size?.width <= 640 ? (
          <PasscodeInput
            onFill={onFill}
            length={4}
            seperated
            keyboard={<NumberKeyboard />}
            style={{ '--cell-gap': '16px' }}
            plain
          />
        ) : (
          <PasscodeInput onFill={onFill} length={4} seperated style={{ '--cell-gap': '16px' }} plain />
        )}
        {/* <PasscodeInput
          onFill={onFill}
          plain
          length={4}
          seperated
          keyboard={<NumberKeyboard />}
          style={{ '--cell-gap': '16px' }}
        /> */}
        <span onClick={againSend} className="text-xs text-color-[#2A4948] pt-14 underline">
          {countdown === 0 ? '重新发送' : `${Math.round(countdown / 1000)}s重新发送`}
        </span>
      </div>
    </div>
  )
}

export default verifySms
