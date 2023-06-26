import React from 'react'
import styles from './index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { Form, Input, Button } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import { setAreaRegion, setToken, setUserId, setUserInfo } from '@/redux/modules/global/action'
import { store } from '@/redux'
import { useMount } from 'ahooks'
import Ellipseing from '@/components/Ellipseing'
import UserApi from '@/http/api/user'

function Login() {
  const location: any = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const isMerchant = location.state?.account === 'merchant'
  const isPersonal = location.state?.account === 'personal'

  const rolelogin = () => {
    if (isMerchant) navigate('/user/login', { state: { account: 'personal' } })
    if (isPersonal) navigate('/user/login', { state: { account: 'merchant' } })
  }

  const loginAccount = async () => {
    await form.validateFields().then(async (values) => {
      if (isMerchant) values.user_type = 2
      if (isPersonal) values.user_type = 1
      
      // 判断是否邮箱
      values.source = values.email.indexOf('@') > -1 ? 1 : 2
      
      const res = await UserApi.login({ ...values })
      if (res.status === 200) {
        store.dispatch(setUserId(res.data.user_id))
        store.dispatch(setToken(res.data.token))
        const result = await UserApi.getUserInfo({ user_id: res.data.user_id })
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
        }
        if (result.status === 200) {
          navigate('/calendar')
        }
      }
    })
  }

  useMount(() => {
    store.dispatch(setToken(''))
    store.dispatch(setUserId(''))
    store.dispatch(setAreaRegion(''))
  })

  return (
    <div
      className={`${styles.login} px-8 pt-10 sm:(min-h-[100vh] relative flex justify-center items-center overflow-x-hidden)`}
    >
      <div className="sm:(w-[500px] flex flex-col justify-center)">
        <div className="flex items-center justify-between">
          <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-6.5 h-3 ml-2 cursor-pointer" />
          <SvgIcon name="logo" className="w-21 h-5 -ml-6.5" />
          <div></div>
        </div>
        <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8 ">
          <p className="text-center text-color-[#2A4948] text-xl font-600 pb-8">
            {isMerchant && '登录商家账号'}
            {isPersonal && '登录个人账号'}
          </p>
          <Form
            form={form}
            className="w-[90%]"
            requiredMarkStyle="none"
            footer={
              <Button
                onClick={loginAccount}
                loading="auto"
                block
                type="submit"
                color="primary"
                loadingIcon={<Ellipseing />}
              >
                登录
              </Button>
            }
          >
            <Form.Item
              name="email"
              label="邮箱/手机号"
              rules={[
                {
                  required: true,
                  pattern: /^(?:04\d{8}|4\d{8})$|^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
                  message: '请输入正确的邮箱或手机号',
                },
              ]}
            >
              <Input placeholder="请输入邮箱/手机号" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input placeholder="请输入密码" type="password" />
            </Form.Item>
            <div
              onClick={() => navigate('/user/verify')}
              className="text-xs cursor-pointer text-color-[#859393] pl-[16px] font-500"
            >
              忘记密码？
            </div>
          </Form>
          <div className="pt-4 flex flex-col items-center">
            <p className="text-xs text-color-[#808080]">
              {isMerchant && '还没有商家账号？'}
              {isPersonal && '还没有个人账号？'}
            </p>
            <p
              onClick={() => navigate('/user/register', { state: { account: location.state?.account } })}
              className="text-xs cursor-pointer"
            >
              立即注册
            </p>
          </div>
        </div>
        <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-4 py-8">
          <p className="text-center text-color-[#2A4948] font-500 pb-1">
            {isMerchant && '登录个人账号'}
            {isPersonal && '登录商家账号'}
          </p>
          <span className="text-xs text-color-[#606060]">
            {isMerchant && '访问您的个人帐户，请进入'}
            {isPersonal && '访问您的商家帐户，请进入'}
          </span>
          <span onClick={rolelogin} className="text-xs cursor-pointer text-color-[#859393] underline">
            {isMerchant && '个人登录页面'}
            {isPersonal && '商家登录页面'}
          </span>
        </div>
      </div>
      <div className="hidden sm:(flex fixed top-32 -left-13.5 w-167px h-167px rounded-full bg-[#D2693F])"></div>
      <div className="hidden sm:(flex opacity-50 fixed top-51.25 -left-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
      <div className="hidden sm:(flex fixed -right-6 -bottom-10 w-241px h-241px rounded-full bg-[#2A4948])"></div>
      <div className="hidden sm:(flex opacity-50 fixed bottom-20 -right-10 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
    </div>
  )
}

export default Login
