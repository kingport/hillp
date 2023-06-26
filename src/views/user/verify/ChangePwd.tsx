import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import UserApi from '@/http/api/user'
import { store } from '@/redux'
import { Button, Form, Input, Toast } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

function changePwd() {
  const [visible, setVisible] = React.useState<boolean>(false)
  const navigator = useNavigate()
  const location: any = useLocation()
  const [form] = Form.useForm()
  const password = Form.useWatch('password', form)
  const confirm_password = Form.useWatch('confirm_password', form)
  const user_id = store.getState().global.userId
  const change_id = location?.state?.change_id
  const forget_change_id = location?.state?.forget_change_id

  const onFinish = async () => {
    // TODO
    await form.validateFields().then(async (values) => {
      if (password === confirm_password) {
        let res
        if (change_id) {
          res = await UserApi.changeNewPassword({ ...values, user_id, change_id })
        }
        if (forget_change_id) {
          res = await UserApi.forgetChangeNewPassword({ ...values, user_id, change_id: forget_change_id })
        }
        if (res?.status === 200) {
          navigator('/user/change/pwd/success')
        }
      } else {
        Toast.show({
          content: '2次密码输入不一致',
        })
      }
    })
  }
  return (
    <div className={`${styles.changepwd} flex flex-col bg-[#fff] <sm:(h-min-[100vh]) sm:(w-330px justify-center)`}>
      <HeaderNav title={'修改密码'} renderRight={false} border />
      <div className="pt-[48px] px-10 sm:(w-full pt-0)">
        <p className="pt-22 text-2xl font-600 pb-4">输入新密码</p>
        <p className="text-xs text-color-[#787878]">密码必须8位以上</p>
        <p className="text-xs text-color-[#787878] pb-10">需包含字母与数字</p>
        <Form
          form={form}
          requiredMarkStyle="none"
          // onFinish={onFinish}
          footer={
            <Button onClick={onFinish} block type="submit" size="large" color="primary" loadingIcon={<Ellipseing />}>
              确认
            </Button>
          }
        >
          <Form.Item name="password" rules={[{ required: true }]}>
            <div className={styles.password}>
              <Input placeholder="请输入密码" className={styles.input} type={visible ? 'text' : 'password'} />
              <div className={styles.eye}>
                {!visible ? (
                  <SvgIcon name="eyes" className="w-[12px] h-[12px]" onClick={() => setVisible(true)} />
                ) : (
                  <SvgIcon name="eyes" className="w-[12px] h-[12px]" onClick={() => setVisible(false)} />
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item name="confirm_password" rules={[{ required: true }]}>
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default changePwd
