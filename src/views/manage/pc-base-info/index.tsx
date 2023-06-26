import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import { CloseOutline } from 'antd-mobile-icons'
import styles from './index.module.scss'
import { Button, Form, Input, Picker, Toast } from 'antd-mobile'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import { store } from '@/redux'
import { useMount, useSize } from 'ahooks'
import Ellipseing from '@/components/Ellipseing'
import HiilpAvatar from '@/components/HiilpAvatat'
import PersonalApi from '@/http/api/personal'
import UploadApi from '@/http/api/upload'
import { updataUserInfo } from '@/redux/modules/global/action'
import { Dropdown, MenuProps } from 'antd'

function Information() {
  const navigator = useNavigate()
  const size = useSize(document.querySelector('body'))

  const fileInputEl = useRef<any>(null)
  const userInfo = store.getState().global.userInfo
  const { area } = store.getState().global.areaRegion

  const [phonePickVisible, setPhonePickVisible] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<(string | null)[]>([area[0].label])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState<boolean>(false)
  const [avatarInfo, setAvatarInfo] = useState<any>({
    file_path: '',
    file_url: '',
  })

  const [showEmailCode, setShowEmailCode] = useState(false)
  const handleEmailChange = (value: any) => {
    setShowEmailCode(value !== userInfo.email)
  }

  const [showPhoneCode, setShowPhoneCode] = useState(false)
  const handlePhoneChange = (value: any) => {
    setShowPhoneCode(value !== userInfo.phone)
  }

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.area = area.find((a: any) => a.label === phoneCode[0])?.value
      }

      // 校验邮箱验证码是否正确
      if (showEmailCode && !(await checkVerifyCode(2, values.email, values.email_code))) return
      // 校验手机验证码是否正确
      if (showPhoneCode && !(await checkVerifyCode(1, values.phone, values.phone_code, values.area))) return

      if (avatarInfo?.file_path || userInfo?.head) {
        values.head = avatarInfo?.file_path || userInfo.head
      }
      const res = await PersonalApi.editBaseUser({ ...values })
      if (res.status === 200) {
        Toast.show(res.msg)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        store.dispatch(updataUserInfo)
        navigator('/personal/information')
      }
    })
  }

  // 获取验证码
  const getVerifyCode = async (type: number, value: any, area_code: any = '') => {
    let api_parmas = {
      source: 1,
      type,
      username: value,
      area_code,
    }
    const res = await PersonalApi.getVerifyCode(api_parmas)
    if (res.status === 200) Toast.show('发送成功')
    else Toast.show(res.msg)
  }

  // 校验验证码
  const checkVerifyCode = async (type: number, username: any, value: any, area_code: string = '') => {
    let api_parmas = {
      source: 1,
      type,
      username,
      code: value,
      area_code,
    }
    const res = await PersonalApi.checkVerifyCode(api_parmas)
    if (res.status !== 200) {
      Toast.show(res.msg)
      return false
    }
    return true
  }

  useMount(() => {
    form.setFieldsValue({
      nickname: userInfo.nickname,
      email: userInfo.email,
      phone: userInfo.phone,
    })
    setPhoneCode([area.find((a: any) => a.value === userInfo.area_id * 1)?.label])
    setAvatarInfo({
      file_url: userInfo.head,
    })
  })

  const handlePhoto = async (event: any) => {
    const files = [...event.target.files]
    if (files.length) {
      const res = await UploadApi.uploadFile(files)
      if (res?.status === 200) {
        Toast.show(res.data.msg)
        setAvatarInfo(res.data.data)
      }
    }
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key) {
      setPhoneCode([area.find((a: any) => Number(a.value) === Number(e?.key)).label])
    }
  }

  const toEmployeeInfo = () => {
    // 商家
    if (userInfo?.user_type === 2) {
      navigator('/personal/information/merchant/edit')
    }
    // 个人
    if (userInfo?.user_type === 1) {
      navigator('/manage/employee/info/edit/detail', {
        state: {
          onlineUser: 'onlineUser',
          nickname: userInfo?.nickname,
        },
      })
    }
  }

  return (
    <>
      <div className={`${styles.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff]`}>
        <div className="flex flex-col px-10 py-12">
          <Form form={form} requiredMarkStyle="none" footer={null}>
            <div className="flex items-center">
              <HiilpAvatar name={userInfo?.nickname} headurl={avatarInfo?.file_url} />
              <Button
                onClick={async () => {
                  await fileInputEl.current.click()
                }}
                className="bg-[#f3f3f3] border-0 ml-4"
                shape="rounded"
              >
                上传头像
              </Button>
              <input
                id="file"
                type="file"
                ref={fileInputEl} //挂载ref
                accept=".jpg,.jpeg,.png" //限制文件类型
                hidden //隐藏input
                onChange={(event) => handlePhoto(event)}
              />
            </div>
            <Form.Item
              name="nickname"
              label={userInfo?.user_type === 1 ? '个人昵称*' : '商家名称* '}
              rules={[{ required: true }]}
            >
              <Input placeholder="昵称" />
            </Form.Item>
            <Form.Item name="email" label="邮箱*" rules={[{ required: true }]}>
              <Input placeholder="邮箱" onChange={handleEmailChange} />
            </Form.Item>
            {/* 判断邮箱是否进行修改 */}
            {showEmailCode && (
              <Form.Item
                name="email_code"
                label="邮箱验证码"
                rules={[{ required: true }]}
                extra={
                  <a
                    className="relative top-20px text-xs"
                    onClick={() => {
                      getVerifyCode(2, form.getFieldValue('email'))
                    }}
                  >
                    获取验证码
                  </a>
                }
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item label="手机*">
              <div className={styles.phone}>
                <div
                  onClick={() => {
                    if (size?.width && size?.width <= 640) {
                      setPhonePickVisible(true)
                    }
                  }}
                  className={`${styles.phoneCode} text-xs h-full pl-3 pr-2 flex items-center justify-center`}
                >
                  <p className="min-w-30px text-center sm:(hidden)">{phoneCode}</p>
                  <Dropdown
                    menu={{ items: area, onClick: handleMenuClick }}
                    className="<sm:(hidden) min-w-40px text-center"
                  >
                    <a onClick={(e) => e.preventDefault()}>{phoneCode}</a>
                  </Dropdown>
                  <SvgIcon name="phone-bottom" className="w-[5px] h-[3px]" />
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
                <Form.Item noStyle name="phone" rules={[{ required: true }]}>
                  <Input placeholder="请输入手机号码" className={styles.input} onChange={handlePhoneChange} />
                </Form.Item>
              </div>
            </Form.Item>
            {/* 判断手机是否进行修改 */}
            {showPhoneCode && (
              <Form.Item
                name="phone_code"
                label="手机验证码"
                rules={[{ required: true }]}
                extra={
                  <a
                    className="relative top-20px text-xs"
                    onClick={() => {
                      getVerifyCode(1, form.getFieldValue('phone'), phoneCode[0])
                    }}
                  >
                    获取验证码
                  </a>
                }
              >
                <Input />
              </Form.Item>
            )}
            <div className="flex justify-center mt-8">
              {/* <Button
                onClick={() => setVisible(true)}
                className="w-[12%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
                block
              >
                <SvgIcon name="point" className="w-[15px] h-[3px]" />
              </Button> */}
              <Button
                onClick={toEmployeeInfo}
                className="w-[30%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
                block
              >
                编辑详情资料
              </Button>
              <Button
                onClick={onFinish}
                className="w-[30%] h-[2.75rem] rounded-xl"
                block
                type="submit"
                color="primary"
                loading="auto"
                loadingIcon={<Ellipseing />}
              >
                保存
              </Button>
            </div>
          </Form>
          <HiilpActionSheet
            actions={[
              {
                text: '编辑详细资料',
                key: 'editDetail',
                onClick: () => {
                  // 商家
                  if (userInfo?.user_type === 2) {
                    navigator('/personal/information/merchant/edit')
                  }
                  // 个人
                  if (userInfo?.user_type === 1) {
                    navigator('/manage/employee/info/edit/detail', {
                      state: {
                        onlineUser: 'onlineUser',
                        nickname: userInfo?.nickname,
                      },
                    })
                  }
                },
              },
            ]}
            visible={visible}
            setVisible={setVisible}
          />
        </div>
        <div onClick={() => navigator(-1)} className="fixed top-80px right-40px">
          <CloseOutline fontSize={24} className="cursor-pointer" />
        </div>
      </div>
    </>
  )
}

export default Information
