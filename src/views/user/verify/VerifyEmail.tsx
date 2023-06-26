import SvgIcon from '@/components/SvgIcon'
import { Button, Form, Input, Picker } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

function VerifyPhone() {
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    values.type = 1
    navigate('/user/verify/sms', { state: { formData: values } })
  }

  return (
    <div className={`${styles.verifyPhone} px-8 pt-10  sm:(!min-h-[calc(100vh-60px)] p-0)`}>
      <div className="flex items-center justify-between sm:(hidden)">
        <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-[26px] h-[12px] ml-2" />
        <SvgIcon name="logo" className="w-[84px] h-[20px] -ml-[26px]" />
        <div></div>
      </div>
      <div className="bg-[#fff] shadow-sm py-8 px-5 mt-15 flex flex-col items-center justify-between rounded-md w-full sm:(w-500px m-auto mt-100px)">
        <div className="flex flex-col justify-center items-center w-full pb-10">
          <p className="text-color-[#2A4948] font-600">验证您的电子邮箱</p>
          <p className="text-xs pt-10 text-color-[#9e9e9e]">为了保护您的帐户，我们将发送一个</p>
          <p className="text-xs text-color-[#9e9e9e]">四位数代码的短信到以下电子邮箱</p>
        </div>
        <Form
          className="w-[90%]"
          requiredMarkStyle="none"
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" loadingIcon={<></>}>
              验证
            </Button>
          }
        >
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <div className={styles.phone}>
              <Input placeholder="请输入邮箱验证码" className={styles.input} />
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default VerifyPhone
