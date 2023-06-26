import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import UserApi from '@/http/api/user'
import { store } from '@/redux'
import { Button, Form, Input } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

function changeOldPwd() {
  const [visible, setVisible] = React.useState<boolean>(false)
  const navigator = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async () => {
    const user_id = store.getState().global.userId
    await form.validateFields().then(async (values) => {
      const res = await UserApi.checkPassword({ user_id, ...values })
      if (res?.status === 200) {
        navigator('/user/change/pwd', {
          state: {
            change_id: res.data.change_id,
          },
        })
      }
    })
  }

  return (
    <div className={`${styles.changepwd} flex flex-col bg-[#fff] <sm:(h-min-[100vh]) sm:(w-330px justify-center)`}>
      <HeaderNav title={'修改密码'} renderRight={false} border />
      <div className="pt-[48px] px-10 sm:(w-full pt-0)">
        <p className="pt-22 text-2xl font-600 pb-4">输入旧密码</p>
        <p className="text-xs text-color-[#787878]">请输入您目前正在使用的密码</p>
        <p onClick={() => navigator('/user/verify')} className="text-xs text-color-[#787878] pb-10 pt-4 underline">
          忘记密码
        </p>
        <Form
          form={form}
          requiredMarkStyle="none"
          footer={
            <Button
              onClick={onFinish}
              block
              type="submit"
              size="large"
              loading="auto"
              color="primary"
              loadingIcon={<Ellipseing />}
            >
              确认
            </Button>
          }
        >
          <Form.Item name="password" rules={[{ required: true }]}>
            <div className={styles.password}>
              <Input placeholder="请输入密码" className={styles.input} type={visible ? 'text' : 'password'} />
              <div className={styles.eye}>
                {!visible ? (
                  <SvgIcon name="eyes" className="w-[12px] h-[12px] mr-2" onClick={() => setVisible(true)} />
                ) : (
                  <SvgIcon name="hide-eye" className="w-[12px] h-[12px] mr-2" onClick={() => setVisible(false)} />
                )}
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default changeOldPwd
