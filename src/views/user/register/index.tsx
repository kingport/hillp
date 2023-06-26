import React from 'react'
import styles from './index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import userApi from '@/http/api/user'
import Ellipseing from '@/components/Ellipseing'
import UserApi from '@/http/api/user'
import { store } from '@/redux'
import { setAreaRegion, setToken, setUserId, setUserInfo } from '@/redux/modules/global/action'
import { useRequest } from 'ahooks'
import { useGoogleLogin } from '@react-oauth/google'

function Register() {
  const location: any = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const isMerchant = location.state?.account === 'merchant'
  const isPersonal = location.state?.account === 'personal'

  const navigateLogin = () => {
    navigate('/user/login', { state: { account: location.state?.account } })
  }

  let user_type = 0
  // 商家注册
  if (isMerchant) user_type = 2
  // 个人注册
  if (isPersonal) user_type = 1

  const registerAccount = async () => {
    // 验证邮箱
    await form?.validateFields().then(async (values) => {
      const res = await userApi.getEmailCode({ ...values, user_type })
      if (res?.status === 200) {
        Toast.show({
          content: res?.msg,
          duration: 1000,
        })
      }
      navigate('/user/register/email', { state: { account: location.state?.account, email: values.email } })
    })
  }

  const goRegisterPage = (loginRes: any) => {
    navigate('/user/register/account', {
      state: {
        register_code: loginRes.data.register_code,
        account: location.state?.account,
        type: 'google',
      },
    })
  }

  const updataUserInfo = async (loginRes: any) => {
    store.dispatch(setUserId(loginRes.data.user_id))
    store.dispatch(setToken(loginRes.data.token))
    const result = await UserApi.getUserInfo({ user_id: loginRes.data.user_id })
    store.dispatch(setUserInfo(result.data))
    const resultArea = await UserApi.getRegionAndArea()
    if (resultArea.status === 200) {
      resultArea?.data?.region?.map((r: any) => {
        r.label = r.name
        r.value = r.id
      })
      resultArea?.data?.area?.map((a: any) => {
        a.label = a.name
        a.value = a.id
      })
      store.dispatch(setAreaRegion(resultArea.data))
      navigate('/calendar')
    }
  }

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (codeResponse) => {
      const loginRes = await UserApi.googleLogin({
        user_type,
        code: codeResponse?.access_token,
      })
      if (loginRes.status === 201) {
        // 强制跳转注册信息页面
        goRegisterPage(loginRes)
      }
      if (loginRes.status === 200) {
        updataUserInfo(loginRes)
      }
    },
  })

  const facebookLogin = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.FB.login(
      function (response: any) {
        if (response?.authResponse?.accessToken) {
          facebookLoginRun({
            code: response?.authResponse?.accessToken,
            user_type,
          })
        }
      },
      { scope: 'public_profile,email,user_friends' }
    )
  }

  const { run: facebookLoginRun } = useRequest((val) => UserApi.facebookLogin(val), {
    manual: true,
    onSuccess(loginRes) {
      if (loginRes.status === 201) {
        goRegisterPage(loginRes)
      }
      if (loginRes.status === 200) {
        updataUserInfo(loginRes)
      }
    },
  })

  return (
    <div className={`${styles.register} px-8 pt-10 sm:(min-h-[100vh] flex justify-center items-center)`}>
      <div className="sm:(w-[500px] flex flex-col justify-center)">
        <div className="flex items-center justify-between">
          <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-6.5 h-3 ml-2 cursor-pointer" />
          <SvgIcon name="logo" className="w-21 h-5 -ml-6.5" />
          <div></div>
        </div>
        <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8">
          <p className="text-center text-color-[#2A4948] text-xl font-600">
            {isMerchant && '注册商家账号'}
            {isPersonal && '注册个人账号'}
          </p>
          <span className="pb-8 text-xs text-color-[#B0B0B0] pt-2">
            {isMerchant && '创建帐户或登录来管理您的团队'}
            {isPersonal && '创建帐户或登录来管理您的排班'}
          </span>
          <Form
            form={form}
            className="w-[90%]"
            requiredMarkStyle="none"
            footer={
              <Button
                onClick={registerAccount}
                size="large"
                block
                color="primary"
                loading="auto"
                loadingIcon={<Ellipseing />}
              >
                创建
              </Button>
            }
          >
            <Form.Item name="email" rules={[{ required: true, message: '请输入正确的邮箱', type: 'email' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Form>
          <div className="pt-4 flex flex-col items-center w-full">
            <p className="text-xs text-color-[#2A4948] pb-4">- 第三方账户登录 -</p>

            <div
              onClick={() => googleLogin()}
              className="flex cursor-pointer items-center shadow-sm w-[80%] bg-[#fff] rounded-lg h-9 px-4"
            >
              <div className={`${styles.icon} w-[30px] h-full flex items-center`}>
                <SvgIcon name="google" className="w-[16px] h-[16px]" />
              </div>
              <span className="flex-1 text-center font-500 text-xs text-color-[#262626]">使用Google登录</span>
            </div>
            <div
              onClick={facebookLogin}
              className="flex cursor-pointer mt-2 items-center shadow-sm w-[80%] bg-[#fff] rounded-lg h-9 px-4"
            >
              <div className={`${styles.icon} w-[30px] h-full flex items-center`}>
                <SvgIcon name="Facebook" className="w-[16px] h-[16px]" />
              </div>
              <span className="flex-1 text-center font-500 text-xs text-color-[#262626]">使用Facebook登录</span>
            </div>
            <span className="pt-8 text-xs text-color-[#859393]">
              {isMerchant && '已有商家账号？'}
              {isPersonal && '已有个人账号？'}
            </span>
            <span onClick={() => navigateLogin()} className="text-xs cursor-pointer text-color-[#2A4948]">
              马上登录
            </span>
          </div>
        </div>
      </div>
      <div className="hidden sm:(flex absolute top-32 -left-13.5 w-167px h-167px rounded-full bg-[#D2693F])"></div>
      <div className="hidden sm:(flex opacity-50 absolute top-51.25 -left-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
      <div className="hidden sm:(flex absolute -right-10 -bottom-10 w-241px h-241px rounded-full bg-[#2A4948])"></div>
      <div className="hidden sm:(flex opacity-50 absolute bottom-20 -right-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
    </div>
  )
}

export default Register
