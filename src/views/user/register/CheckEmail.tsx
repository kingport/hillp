// import user from '@/store/user'  因为加入了unplugin-auto-import 所以不用在手动导入
import React from 'react'
import styles from './index.module.scss'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import userApi from '@/http/api/user'
import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'

function CheckEmail() {
  const location: any = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const isMerchant = location.state?.account === 'merchant'
  const isPersonal = location.state?.account === 'personal'

  const registerAccount = async () => {
    await form?.validateFields().then(async (values) => {
      let user_type
      if (isMerchant) user_type = 2
      if (isPersonal) user_type = 1
      const res = await userApi.checkEmailCode({
        email: location?.state?.email,
        user_type,
        ...values,
      })
      if (res.status === 201) {
        navigate('/user/register/account', {
          state: {
            account: location.state?.account,
            email: location?.state?.email,
            register_code: res?.data?.register_code,
          },
        })
      }
    })
  }

  const aginGetEmailCode = async () => {
    let user_type
    if (isMerchant) user_type = 2
    if (isPersonal) user_type = 1
    const res = await userApi.getEmailCode({ email: location?.state?.email, user_type })
    if (res?.status === 200) {
      Toast.show({
        content: res?.msg,
        duration: 1000,
      })
    }
  }

  return (
    <div className={`${styles.register} px-8 pt-10 flex justify-center items-center`}>
      <HeaderNav renderRight={false} />
      <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8 w-full sm:(w-[600px])">
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
              下一步
            </Button>
          }
        >
          <div className="flex items-center justify-between">
            <p className="text-xs">{location?.state?.email}</p>
            <p onClick={aginGetEmailCode} className="text-xs">
              重新发送
            </p>
          </div>
          <Form.Item name="vcode" rules={[{ required: true }]}>
            <Input placeholder="请输入邮箱验证码" />
          </Form.Item>
        </Form>
      </div>
      <div className="hidden sm:(flex absolute top-32 -left-13.5 w-167px h-167px rounded-full bg-[#D2693F])"></div>
      <div className="hidden sm:(flex opacity-50 absolute top-51.25 -left-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
      <div className="hidden sm:(flex absolute -right-10 -bottom-10 w-241px h-241px rounded-full bg-[#2A4948])"></div>
      <div className="hidden sm:(flex opacity-50 absolute bottom-20 -right-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
    </div>
  )
}

export default CheckEmail
