import React, { RefObject } from 'react'
import { Form, Button, Checkbox, Input, Picker, DatePickerRef, Toast } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import useRegionArea from '@/hooks/useRegionArea'
import Ellipseing from '@/components/Ellipseing'
import { pickBy, identity } from 'lodash'
import { useRequest, useSize } from 'ahooks'
import UserApi from '@/http/api/user'
import { Dropdown, MenuProps, Select } from 'antd'

function CreateAccount() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const isMerchant = location.state?.account === 'merchant'
  const isPersonal = location.state?.account === 'personal'
  const loginType = location.state?.type
  const size = useSize(document.querySelector('body'))

  const [form] = Form.useForm()

  const register_code = location.state?.register_code

  const { area, region } = useRegionArea()

  const [visible, setVisible] = React.useState<boolean>(false)
  const [phonePickVisible, setPhonePickVisible] = React.useState<boolean>(false)

  const [phoneCode, setPhoneCode] = React.useState<(string | null)[]>([''])

  useEffect(() => {
    setPhoneCode([area[0]?.name])
  }, [area])

  // 给invite_code设定默认值
  useEffect(() => {
    let invita_code = sessionStorage.getItem('invita_code')
    if (invita_code) {
      form.setFieldsValue({
        invite_code: invita_code,
      })
    }
  }, [])

  /**
   * @description 账号创建
   * @params {string} register_code 邮箱注册码
   */
  const onFinsh = async () => {
    await form?.validateFields().then(async (values) => {
      if (phoneCode) {
        values.area_id = area.find((a: any) => a.name === phoneCode[0])?.id
      }
      values.region_id = values.region_id[0]
      values.register_code = register_code
      values = pickBy(values, identity)
      run(values)
    })
  }

  const { run } = useRequest(
    (values) =>
      UserApi.getPhoneCode({
        phone: values?.phone,
        area_id: values?.area_id,
        user_type: isMerchant ? 2 : 1,
        register_code: values?.register_code,
      }),
    {
      manual: true,
      onSuccess: (result, params) => {
        Toast.show({
          content: result?.msg,
          afterClose() {
            navigate('/verification', {
              state: {
                account: location.state?.account,
                email: location.state?.email,
                formData: params[0],
                type: loginType,
              },
            })
          },
        })
      },
    }
  )

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key) {
      setPhoneCode([area.find((a: any) => Number(a.value) === Number(e?.key)).label])
    }
  }

  return (
    <div className={`${styles.register} px-8 py-8 sm:(min-h-[100vh] flex justify-center items-center)`}>
      <div className="sm:(w-[500px] flex flex-col justify-center)">
        <div className="flex items-center justify-between">
          <SvgIcon onClick={() => navigate(-1)} name="user-left" className="w-6.5 h-3 ml-2 cursor-pointer" />
          <SvgIcon name="logo" className="w-21 h-5 -ml-6.5" />
          <div></div>
        </div>
        <div className="shadow-sm bg-[#fff] flex flex-col items-center rounded-md mt-14 py-8">
          <p className="text-center text-color-[#2A4948] text-xl font-600">
            {isMerchant && '创建您的商家账号'}
            {isPersonal && '创建您的个人账号'}
          </p>
          {isMerchant && (
            <>
              <p className="text-xs text-color-[#B0B0B0] pt-4">请帮您的新帐户</p>
              <p className="text-xs text-color-[#B0B0B0] pb-8">{location.state?.email}填写以下信息</p>
            </>
          )}
          <Form
            form={form}
            className="w-[90%]"
            requiredMarkStyle="none"
            footer={
              <Button onClick={onFinsh} block color="primary" loading="auto" loadingIcon={<Ellipseing />}>
                创建
              </Button>
            }
          >
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  validator(rule, value) {
                    const regex = /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9]{8,}$/
                    if (!regex.test(value)) {
                      return Promise.reject('密码包含大小写和数字，且长度不小于8')
                    } else {
                      return Promise.resolve()
                    }
                  },
                },
              ]}
            >
              <div className={styles.password}>
                <Input placeholder="请输入密码" className={styles.input} type={visible ? 'text' : 'password'} />
                <div className={styles.eye}>
                  {!visible ? (
                    <SvgIcon name="eyes" className="w-[12px] h-[12px]" onClick={() => setVisible(true)} />
                  ) : (
                    <SvgIcon name="hide-eyes" className="w-[12px] h-[12px]" onClick={() => setVisible(false)} />
                  )}
                </div>
              </div>
            </Form.Item>
            <Form.Item name="phone" label="手机号码" rules={[{ required: true }]}>
              <div className={styles.phone}>
                <div
                  onClick={() => {
                    if (size?.width && size?.width <= 640) {
                      setPhonePickVisible(true)
                    }
                  }}
                  className={`${styles.phoneCode} text-xs h-full flex items-center justify-center`}
                >
                  <p className="min-w-30px pl-1 sm:(hidden)">{phoneCode}</p>
                  <Dropdown
                    menu={{ items: area, onClick: handleMenuClick }}
                    className="<sm:(hidden) min-w-40px text-center"
                  >
                    <a onClick={(e) => e.preventDefault()}>{phoneCode}</a>
                  </Dropdown>
                  <SvgIcon name="phone-bottom" className="w-[5px] h-[3px] mr-1" />
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
            {isMerchant && (
              <Form.Item name="store_name" label="商家名称">
                <Input placeholder="请输入商家名称" />
              </Form.Item>
            )}
            <Form.Item
              name="region_id"
              label="地区"
              trigger="onConfirm"
              onClick={(e, PickerRef: RefObject<DatePickerRef>) => {
                if (size?.width && size?.width > 640) return false
                PickerRef.current?.open() // ⬅️
              }}
              layout="vertical"
              rules={[{ required: true, message: '请选择地区' }]}
            >
              {size?.width && size?.width > 640 ? (
                <Select
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    if (val) {
                      form.setFieldsValue({
                        region_id: [val],
                      })
                    }
                  }}
                  className="!rounded-sm !bg-[#fff] <sm:(hidden)"
                  options={region}
                />
              ) : (
                <Picker columns={[region]}>
                  {(value: any) => (
                    <span className="text-xs border border-width-[0.7px] border-solid border-color-[#cbd2d1] min-h-8 rounded-md pl-3 flex items-center">
                      {value[0]?.label || ''}
                    </span>
                  )}
                </Picker>
              )}
            </Form.Item>

            {isMerchant && (
              <Form.Item name="store_website" label="商家网站（选填）">
                <Input placeholder="请选择" />
              </Form.Item>
            )}
            <Form.Item name="invite_code" label="邀请码（选填）">
              <Input placeholder="请选择" />
            </Form.Item>
            <Form.Item>
              <Checkbox
                icon={(checked: boolean) =>
                  checked ? (
                    <SvgIcon name="checked" className="w-[12px] h-[12px] mt-[3px]" />
                  ) : (
                    <SvgIcon name="checked" className="w-[12px] h-[12px] mt-[3px]" />
                  )
                }
                value="1"
              >
                <span className="text-xs text-color-[#707070]">
                  我同意 <a href="https://www.91uber.com/terms-and-conditions">《HIILP隐私条款》</a>
                  <a href="https://www.91uber.com/terms-and-conditions">《HIILP商户条款》</a>
                </span>
              </Checkbox>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="hidden sm:(flex absolute top-32 -left-13.5 w-167px h-167px rounded-full bg-[#D2693F])"></div>
      <div className="hidden sm:(flex opacity-50 absolute top-51.25 -left-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
      <div className="hidden sm:(flex absolute -right-10 -bottom-10 w-241px h-241px rounded-full bg-[#2A4948])"></div>
      <div className="hidden sm:(flex opacity-50 absolute bottom-20 -right-10.5 w-107px h-107px rounded-full bg-[#C8E3E2])"></div>
    </div>
  )
}

export default CreateAccount
