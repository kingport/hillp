import Ellipseing from '@/components/Ellipseing'
import SvgIcon from '@/components/SvgIcon'
import useRegionArea from '@/hooks/useRegionArea'
import UserApi from '@/http/api/user'
import { useSize } from 'ahooks'
import { Dropdown, MenuProps } from 'antd'
import { Button, Form, Input, Picker } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

function VerifyPhone() {
  const navigate = useNavigate()
  const [phonePickVisible, setPhonePickVisible] = React.useState<boolean>(false)
  const [phoneCode, setPhoneCode] = React.useState<(string | null)[]>([''])
  const [form] = Form.useForm()
  const size = useSize(document.querySelector('body'))

  const { area } = useRegionArea()

  useEffect(() => {
    setPhoneCode([area[0]?.name])
  }, [area])

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.area_id = area.find((a: any) => a.name === phoneCode[0])?.id
      }
      values.type = 2
      navigate('/user/verify/sms', { state: { formData: values } })
    })
  }
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key) {
      setPhoneCode([area.find((a: any) => Number(a.value) === Number(e?.key)).label])
    }
  }
  return (
    <div className={`${styles.verifyPhone} px-8 pt-10`}>
      <div className="flex items-center justify-between sm:(hidden)">
        <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-[26px] h-[12px] ml-2" />
        <SvgIcon name="logo" className="w-[84px] h-[20px] -ml-[26px]" />
        <div></div>
      </div>
      <div className="bg-[#fff] shadow-sm py-8 px-5 mt-15 flex flex-col items-center justify-between rounded-md w-full sm:(w-500px m-auto mt-100px)">
        <div className="flex flex-col justify-center items-center w-full pb-10">
          <p className="text-color-[#2A4948] font-600">验证您的手机号码</p>
          <p className="text-xs pt-10 text-color-[#9e9e9e]">为了保护您的帐户，我们将发送一个</p>
          <p className="text-xs text-color-[#9e9e9e]">四位数代码的短信到以下手机号码</p>
        </div>
        <Form
          form={form}
          className="w-[90%]"
          requiredMarkStyle="none"
          footer={
            <Button onClick={onFinish} block type="submit" color="primary" loading="auto" loadingIcon={<Ellipseing />}>
              验证
            </Button>
          }
        >
          <Form.Item name="phone" label="手机号码" rules={[{ required: true }]}>
            <div className={styles.phone}>
              <div
                onClick={() => {
                  if (size?.width && size?.width <= 640) {
                    setPhonePickVisible(true)
                  }
                }}
                className={`${styles.phoneCode} text-xs w-60px h-full px-2 flex items-center justify-center`}
              >
                <span className="w-30px sm:(hidden)">{phoneCode}</span>
                <Dropdown
                  menu={{ items: area, onClick: handleMenuClick }}
                  className="<sm:(hidden) min-w-40px text-center"
                >
                  <a onClick={(e) => e.preventDefault()}>{phoneCode}</a>
                </Dropdown>
                <SvgIcon name="phone-bottom" className="w-[5px] h-[3px] ml-2" />
              </div>
              <Picker
                columns={[area]}
                visible={phonePickVisible}
                onClose={() => {
                  setPhonePickVisible(false)
                }}
                value={phoneCode}
                onConfirm={(v: (string | null)[]) => {
                  setPhoneCode([area.find((a: any) => a.value === v[0]).label])
                }}
              />
              <Input placeholder="请输入手机号码" className={styles.input} />
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default VerifyPhone
