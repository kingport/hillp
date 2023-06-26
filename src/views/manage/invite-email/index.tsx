import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import ManageApi from '@/http/api/manage'
import { Button, Form, Input } from 'antd-mobile'
import React from 'react'

const InviteEmail = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  return (
    <div className="flex flex-col bg-[#fff] min-h-[100vh] pt-[48px] pb-[90px] sm:(p-0 min-h-[calc(100vh-60px)] flex justify-center items-center)">
      <HeaderNav renderLeft={false} />
      <Form className="sm:(w-300px)" style={{ '--border-bottom': 'none', '--border-top': 'none' }} form={form}>
        <div className="px-10 pt-30 sm:(p-0)">
          <p className="font-600 text-2xl">通过电子邮件邀请</p>
          <p className="text-sm mb-6">我们将会向他发出邀请。</p>
          <Form.Item noStyle name="email" rules={[{ required: true, type: 'email' }]}>
            <Input className="bg-[#f7f7f7] rounded-2xl py-2.5 pl-4" placeholder="在此输入邮箱" />
          </Form.Item>
        </div>
        <div className="<sm:(fixed-b-btn) flex sm:(mt-5)">
          <Button
            onClick={async () => {
              await form.validateFields().then(async (values) => {
                const res = await ManageApi.inviteEmail({
                  ...values,
                  type: 1,
                })
                if (res.status === 200) {
                  navigate('/manage/employee/intive/success')
                }
              })
            }}
            className="w-[70%] h-[2.75rem] sm:(w-full)"
            block
            type="submit"
            color="primary"
            shape="rounded"
            loading="auto"
            loadingIcon={<Ellipseing />}
          >
            发送邀请
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default InviteEmail
