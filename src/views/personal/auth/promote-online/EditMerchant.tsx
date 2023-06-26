import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, Picker, Avatar, Toast, DotLoading, TextArea } from 'antd-mobile'
import Ellipseing from '@/components/Ellipseing'
import UploadApi from '@/http/api/upload'
import { useRequest, useSize } from 'ahooks'
import { store } from '@/redux'
import { pickBy, identity } from 'lodash'
import { GOOGLE_MAP_KEY } from '@/constant'
import Geocode from 'react-geocode'
import { getCurrentPosition } from '@/utils/util'
import PersonalApi from '@/http/api/personal'
import { InitAutocomplete } from '@/components/SearchBox/init'
import { Dropdown, MenuProps } from 'antd'
import { CloseOutline } from 'antd-mobile-icons'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

function AddChannelForm() {
  const fileInputEl = useRef<any>(null)
  const [form] = Form.useForm()
  const { area } = store.getState().global.areaRegion
  const navigate = useNavigate()
  const size = useSize(document.querySelector('body'))

  const [phonePickVisible, setPhonePickVisible] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<(string | null)[]>([area[0].label])
  const [avatarInfo, setAvatarInfo] = useState<any>({
    file_path: '',
    file_url: '',
  })

  const {
    data: res,
    refresh,
    run,
  } = useRequest(() => PersonalApi.onlineMerchant({}), {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ ...res.data })
      // 设置手机区号
      setPhoneCode([area.find((a: any) => a.label === res?.data?.online_area)?.name])
      // 设置头像
      setAvatarInfo({
        file_url: res?.data?.online_head,
        file_path: '',
      })
    },
  })

  useEffect(() => {
    run()
  }, [])

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.online_area = area.find((a: any) => a.name === phoneCode[0])?.label
      }
      if (avatarInfo?.file_path || res?.data?.online_head) {
        values.online_head = avatarInfo?.file_path || res?.data?.online_head
      }
      values = pickBy(values, identity)
      if (values.online_address) {
        Geocode.fromAddress(values.online_address).then(
          async (response) => {
            const { lat, lng } = response.results[0].geometry.location
            values.latitude = `${lat},${lng}`
            values = pickBy(values, identity)
            const res = await PersonalApi.updateOnlineMerchant({ ...values })

            if (res.status === 200) {
              refresh()
              navigate('/personal/auth/online')
            }
          },
          (error) => {
            Toast.show(JSON.stringify(error))
          }
        )
      } else {
        values = pickBy(values, identity)
        const res = await PersonalApi.updateOnlineMerchant({ ...values })
        if (res.status === 200) {
          refresh()
          navigate('/personal/auth/online')
        }
      }
    })
  }

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

  return (
    <div
      className={`${styles.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff] sm:(pb-0 pt-0 flex justify-center min-h-none items-center h-[calc(100vh-60px)] )`}
    >
      <HeaderNav renderRight={false} title={'编辑商家线上信息'} border />
      <div className="flex flex-col px-10 py-12 sm:(w-500px)">
        <Form form={form} requiredMarkStyle="none" layout="horizontal" footer={null}>
          <div className="flex items-center">
            <Avatar
              style={{
                '--border-radius': '50%',
                '--size': '80px',
              }}
              className="mr-5"
              src={avatarInfo?.file_url}
            />
            <Button
              loading="auto"
              onClick={async () => {
                await fileInputEl.current.click()
              }}
              className="bg-[#f3f3f3] border-0"
              shape="rounded"
              loadingIcon={<Ellipseing />}
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
          <p className="pt-12 pb-4">基本资料</p>
          <Form.Item name="online_name" label="商家名称" rules={[{ required: true }]}>
            <Input placeholder="商家名称" />
          </Form.Item>
          <Form.Item name="online_email" label="商家邮箱" rules={[{ required: true }]}>
            <Input placeholder="商家邮箱" />
          </Form.Item>
          <Form.Item label="商家手机">
            <div className={styles.phone}>
              <div
                onClick={() => {
                  if (size?.width && size?.width <= 640) {
                    setPhonePickVisible(true)
                  }
                }}
                className={`${styles.phoneCode} text-xs h-full pl-3 pr-2 flex items-center justify-center`}
              >
                <span className="w-25px sm:(hidden)">{phoneCode}</span>
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
              <Form.Item noStyle name="online_phone" rules={[{ required: true }]}>
                <Input placeholder="请输入手机号码" className={styles.input} />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item layout="vertical" label="地址（选填）">
            <div className="flex items-center justify-between">
              <Form.Item noStyle name="online_address">
                <InitAutocomplete />
              </Form.Item>
              <SvgIcon
                onClick={() => {
                  getCurrentPosition((position: any) => {
                    const currentLatitude = position.coords.latitude
                    const currentLongitude = position.coords.longitude
                    Geocode.fromLatLng(currentLatitude, currentLongitude).then(
                      (response) => {
                        const address = response.results[0].formatted_address
                        form.setFieldsValue({
                          online_address: address,
                        })
                      },
                      (error) => {
                        console.error(error)
                      }
                    )
                  })
                }}
                name="location"
                className="w-[20px] h-[20px] cursor-pointer"
              />
            </div>
          </Form.Item>
          <Form.Item name="remark" layout="vertical" label="介绍">
            <TextArea placeholder="请输入介绍" autoSize={{ minRows: 5, maxRows: 7 }} />
          </Form.Item>
          <div className="flex <sm:(fixed-b-btn)">
            <Button
              onClick={onFinish}
              className="w-[70%] h-[2.75rem] rounded-xl sm:(w-[100%])"
              block
              type="submit"
              color="primary"
              loading="auto"
              loadingIcon={<Ellipseing />}
            >
              {'保存'}
            </Button>
          </div>
        </Form>
      </div>
      <div onClick={() => navigate(-1)} className="fixed top-80px right-40px">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default AddChannelForm
