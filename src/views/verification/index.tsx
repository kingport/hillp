import React from 'react'
import styles from './index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { PasscodeInput, Toast, NumberKeyboard } from 'antd-mobile'
import { useCountDown, useRequest, useSize } from 'ahooks'
import UserApi from '@/http/api/user'

const Verification = () => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const size = useSize(document.querySelector('body'))

  const isMerchant = location.state?.account === 'merchant'
  const isPersonal = location.state?.account === 'personal'

  const [targetDate, setTargetDate] = useState<number>()
  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(undefined)
    },
  })

  const getPhoneCode = async () => {
    let user_type
    if (isMerchant) user_type = 2
    if (isPersonal) user_type = 1
    return await UserApi.getPhoneCode({
      phone: location?.state?.formData.phone,
      area_id: location?.state?.formData.area_id,
      user_type,
      register_code: location?.state?.formData.register_code,
    })
  }

  const personalRegister = async (vcode: string) => {
    let user_type
    if (isMerchant) user_type = 2
    if (isPersonal) user_type = 1
    const params: any = {
      user_type,
      vcode,
      register_code: location?.state?.formData.register_code,
      ...location?.state?.formData,
    }
    return await UserApi.registerAccount(params)
  }

  // 获取手机验证码
  const { run } = useRequest(getPhoneCode, {
    manual: true,
    onSuccess: (result) => {
      Toast.show({
        content: result?.msg,
        afterClose() {
          setTargetDate(Date.now() + 60000)
        },
      })
    },
  })

  useEffect(() => {
    setTargetDate(Date.now() + 60000)
  }, [])

  // 注册个人账号
  const { run: runRegisterPersonal } = useRequest(personalRegister, {
    manual: true,
    onSuccess() {
      let user_type
      if (isMerchant) user_type = 2
      if (isPersonal) user_type = 1
      navigate('/user/register/success', {
        state: {
          user_type,
          email: location?.state?.email,
          formData: location.state.formData,
          type: location.state.type,
        },
      })
    },
  })

  const againSend = () => {
    if (targetDate) return false
    run()
  }

  const onFill = (codes: string) => {
    runRegisterPersonal(codes)
  }

  return (
    <div className={`${styles.verification} px-8 py-8`}>
      <div className="flex items-center justify-between">
        <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-[26px] h-[12px] ml-2" />
        <SvgIcon name="logo" className="w-[84px] h-[20px] -ml-[26px]" />
        <div></div>
      </div>
      <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8 sm:(w-500px m-auto mt-100)">
        <p className="text-center text-color-[#2A4948] text-xl font-600">请输入验证码</p>
        <span className="pb-8 text-xs text-color-[#B0B0B0] pt-2">四位数代码已发送至您的手机</span>
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

        <span onClick={againSend} className="text-xs text-color-[#2A4948] pt-14 underline">
          {countdown === 0 ? '重新发送' : `${Math.round(countdown / 1000)}s重新发送`}
        </span>
      </div>
    </div>
  )
}

export default Verification
