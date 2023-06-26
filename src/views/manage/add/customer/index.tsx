import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import Ellipseing from '@/components/Ellipseing'
import { pickBy, identity } from 'lodash'
import UploadApi from '@/http/api/upload'
import ManageApi from '@/http/api/manage'
import { useMount, useSize } from 'ahooks'
import { store } from '@/redux'
import HiilpAvatar from '@/components/HiilpAvatat'
import Geocode from 'react-geocode'
import { getCurrentPosition } from '@/utils/util'
import { GOOGLE_MAP_KEY } from '@/constant'
import { Button, TextArea, Form, Input, Picker, Toast } from 'antd-mobile'
import { InitAutocomplete } from '@/components/SearchBox/init'
import { Dropdown, MenuProps } from 'antd'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

function customer() {
  const [form] = Form.useForm()
  const navigator = useNavigate()
  const location: any = useLocation()
  const from = location?.state?.from
  const size = useSize(document.querySelector('body'))

  const { area } = store.getState().global.areaRegion
  const fileInputEl = useRef<any>(null)
  const isEdit = location?.state?.type === 'edit'

  const [phonePickVisible, setPhonePickVisible] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<(string | null)[]>([''])
  const [avatarInfo, setAvatarInfo] = useState<any>({
    file_path: '',
    file_url: '',
  })

  useEffect(() => {
    setPhoneCode([area?.[0].name])
  }, [area])

  useMount(() => {
    if (location?.state?.type === 'edit') {
      form.setFieldsValue({ ...location.state?.formData })
      setPhoneCode([area.find((a: any) => a.label === location.state?.formData?.area)?.label])
    }
  })

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.area = area.find((a: any) => a.name === phoneCode[0])?.label
      }
      if (avatarInfo?.file_path || location.state?.formData?.head) {
        values.head = avatarInfo?.file_path || location.state?.formData.head
      }
      if (values.address) {
        Geocode.fromAddress(values.address).then(
          async (response) => {
            const { lat, lng } = response.results[0].geometry.location
            values.latitude = `${lat},${lng}`
            values = pickBy(values, identity)
            let res
            if (isEdit) {
              res = await ManageApi.updataServer({ ...values, id: location.state?.formData?.id })
            } else {
              res = await ManageApi.saveClient({ ...values })
            }
            if (res.status === 200) {
              Toast.show({
                content: res?.msg,
                afterClose: () => {
                  if (from && from === 'addOrder') {
                    navigator('/manage/customer/list', {
                      state: {
                        from: 'addOrder',
                        ...location?.state,
                      },
                    })
                  } else if (from && from === 'pcAddOrder') {
                    navigator('/calendar/add/order')
                  } else {
                    navigator('/manage/customer/list')
                  }
                },
              })
            }
          },
          (error) => {
            console.error(error)
          }
        )
      } else {
        values = pickBy(values, identity)
        let res
        if (isEdit) {
          res = await ManageApi.updataServer({ ...values, id: location.state?.formData?.id })
        } else {
          res = await ManageApi.saveClient({ ...values })
        }
        if (res.status === 200) {
          Toast.show({
            content: res?.msg,
            afterClose: () => {
              navigator(-1)

              // if (from && from === 'addOrder') {
              //   navigator('/manage/customer/list', {
              //     state: {
              //       from: 'addOrder',
              //       ...location?.state,
              //     },
              //   })
              // } else if (from && from === 'pcAddOrder') {
              //   navigator('/calendar/add/order')
              // } else {
              //   navigator(-1)
              // }
            },
          })
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
    <div className={`${styles.customer} pt-[48px] pb-[90px] sm:(w-full flex justify-center pb-0)`}>
      <HeaderNav renderRight={false} />
      <div className="flex flex-col px-10 py-12 sm:(w-400px px-0 py-0)">
        <p className="text-2xl font-600 pb-10">{isEdit ? '编辑客户' : '添加新客户'}</p>
        <Form requiredMarkStyle="none" form={form} footer={null}>
          <div className="flex items-center">
            <HiilpAvatar
              name={isEdit ? location.state?.formData?.nickname : ''}
              headurl={isEdit ? location.state?.formData?.head : avatarInfo?.file_url}
            />
            <Button
              loading="auto"
              onClick={async () => {
                await fileInputEl.current.click()
              }}
              className="bg-[#f3f3f3] border-0 ml-4"
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
          <Form.Item name="nickname" label="客户称呼" rules={[{ required: true }]}>
            <Input placeholder="客户称呼" />
          </Form.Item>
          <Form.Item name="email" label="客户邮箱">
            <Input placeholder="客户邮箱" />
          </Form.Item>
          <div className={`${styles.phone} flex flex-col pt-3`}>
            <p className="text-sm pb-3">客户手机</p>
            <div className={`flex items-center ${styles.area}`}>
              <div
                onClick={() => {
                  if (size?.width && size?.width <= 640) {
                    setPhonePickVisible(true)
                  }
                }}
                className={`flex rounded-l-2xl items-center justify-center text-xs h-full pl-3 pr-2 justify-center`}
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
              <Form.Item name="phone">
                <Input placeholder="请输入手机号码" className={styles.input} />
              </Form.Item>
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
            </div>
          </div>
          <Form.Item className={styles.address} layout="vertical" label="地址">
            <div className="flex items-center justify-between">
              <Form.Item noStyle name="address">
                <InitAutocomplete transparent />
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
                          address: address,
                        })
                      },
                      (error) => {
                        Toast.show('Server returned status code ZERO_RESULTS')
                        console.error(error)
                      }
                    )
                  })
                }}
                name="location"
                className="w-[20px] h-[20px] cursor-pointer mr-2"
              />
            </div>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea placeholder="输入" />
          </Form.Item>
          <div className="fixed-b-btn flex justify-around sm:(hidden)">
            <Button className="w-[30%] border-0 bg-[#F3F3F3]" shape="rounded" block size="large">
              取消
            </Button>
            <Button
              onClick={onFinish}
              className="w-[30%]"
              shape="rounded"
              block
              type="submit"
              size="large"
              loading="auto"
              color="primary"
              loadingIcon={<Ellipseing />}
            >
              {isEdit ? '保存' : '添加'}
            </Button>
          </div>
          {/* pc */}
          <div className="<sm:(fixed-b-btn) flex sm:(my-10)">
            <Button
              onClick={onFinish}
              className="w-[70%] h-[2.75rem] rounded-xl sm:(w-25 rounded-3xl)"
              block
              type="submit"
              color="primary"
              loading="auto"
              loadingIcon={<Ellipseing />}
            >
              {isEdit ? '保存' : ' 添加 '}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default customer
