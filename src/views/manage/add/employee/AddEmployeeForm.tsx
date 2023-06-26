import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import SelectUnit from '@/components/SelectUnit'
import TimePriceItem from '../../components/TimePriceItem'
import Ellipseing from '@/components/Ellipseing'
import UploadApi from '@/http/api/upload'
import InformationApi from '@/http/api/information'
import ManageApi from '@/http/api/manage'
import HiilpAvatar from '@/components/HiilpAvatat'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import Geocode from 'react-geocode'
import { Button, Form, Input, Picker, Toast, DotLoading, Dialog } from 'antd-mobile'
import { useRequest, useSize } from 'ahooks'
import { store } from '@/redux'
import { differenceWith, identity, isEqual, pickBy } from 'lodash'
import { getCurrentPosition } from '@/utils/util'
import { GOOGLE_MAP_KEY } from '@/constant'
import { InitAutocomplete } from '@/components/SearchBox/init'
import { CloseOutline } from 'antd-mobile-icons'
import { Dropdown, MenuProps } from 'antd'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

function AddEmployeeForm() {
  const fileInputEl = useRef<any>(null)
  const [form] = Form.useForm()
  const navigator = useNavigate()
  const { area } = store.getState().global.areaRegion
  const location: any = useLocation()
  const isEdit = location?.state?.id
  const userInfo = store.getState().global.userInfo
  const size = useSize(document.querySelector('body'))

  const [visible, setVisible] = useState(false)
  const [phonePickVisible, setPhonePickVisible] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<(string | null)[]>([area[0].label])
  const [costUnit, setCostUnit] = useState<string>('%')
  const [feeUnit, setFeeUnit] = useState<string>('%')
  const [avatarInfo, setAvatarInfo] = useState<any>({
    file_path: '',
    file_url: '',
  })
  const [eatInlist, setEatInlist] = useState()
  const [takeOutlist, setTakeOutlist] = useState()
  const [feelist, setFeelist] = useState()
  const [timePicker, setTimePicker] = useState([])

  const { loading } = useRequest(() => InformationApi.getInformationList({ type: 9 }), {
    onSuccess(res) {
      setTimePicker(res?.data)
    },
  })

  const { data: detail, run } = useRequest(() => ManageApi.getStaffDetail({ id: location?.state?.id }), {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ ...res.data })
      // 设置手机区号
      setPhoneCode([area.find((a: any) => a.label === res?.data?.area)?.label])
      // 设置成本
      if (res.data.cost_type === 1) {
        setCostUnit('%')
      }
      if (res.data.cost_type === 2) {
        setCostUnit('$')
        setEatInlist(res.data.cost?.eat_in || [{}])
        setTakeOutlist(res.data.cost?.take_out || [{}])
      }
      if (res.data.introducer_type === 1) {
        setFeeUnit('%')
      }
      if (res.data.introducer_type === 2) {
        setFeeUnit('$')
        setFeelist(res.data?.introducer_cost)
      }
      // 设置头像
      setAvatarInfo({
        file_url: res?.data?.head,
        file_path: '',
      })
    },
  })

  useEffect(() => {
    if (location?.state?.id) {
      run()
    }
  }, [location?.state?.id])

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.area = area.find((a: any) => a.name === phoneCode[0])?.label
      }
      if (avatarInfo?.file_path || detail?.data?.head) {
        values.head = avatarInfo?.file_path || detail?.data?.head
      }
      // 堂食
      const eatInArr: any = []
      if (eatInlist && costUnit === '$') {
        let eatInObj = {}
        Object.keys(eatInlist).map((key) => {
          eatInObj = {
            price: values.eat_in[`price_${key}`],
            time: values.eat_in[`time_${key}`][0],
          }
          eatInArr.push(eatInObj)
        })
      }
      // 外卖
      const takeOutArr: any = []
      if (takeOutlist && costUnit === '$') {
        let takeOutObj = {}
        Object.keys(takeOutlist).map((key) => {
          takeOutObj = {
            price: values.take_out[`price_${key}`],
            time: values.take_out[`time_${key}`][0],
          }
          takeOutArr.push(takeOutObj)
        })
      }

      if (costUnit === '$') {
        values.cost = {
          eat_in: differenceWith(
            eatInArr,
            [
              { time: undefined, price: undefined },
              { time: '', price: '' },
            ],
            isEqual
          ),
          take_out: differenceWith(
            takeOutArr,
            [
              { time: undefined, price: undefined },
              { time: '', price: '' },
            ],
            isEqual
          ),
        }

        if (!values.cost.eat_in.length && !values.cost.take_out.length) {
          return Toast.show('请至少选择一个')
        }

        if (values.cost.eat_in.length) {
          values.cost.eat_in.map((item: any) => {
            if (!item.price || !item.time) {
              throw Toast.show('请完善或清空')
            }
          })
        }

        if (values.cost.take_out.length) {
          values.cost.take_out.map((item: any) => {
            if (!item.price || !item.time) {
              throw Toast.show('请完善或清空')
            }
          })
        }
      }

      if (costUnit === '$') {
        values.cost_type = 2
        if (values.cost.take_out.length === 0) {
          delete values.cost.take_out
        }
        if (values.cost.eat_in.length === 0) {
          delete values.cost.eat_in
        }
        values.cost = JSON.stringify(values.cost)
        delete values.eat_in
        delete values.take_out
      } else {
        values.cost_type = 1
      }

      // 介绍费
      const feeArr: any = []
      if (feelist && feeUnit === '$') {
        let feeObj = {}
        Object.keys(feelist).map((key) => {
          feeObj = {
            price: values.fee[`price_${key}`],
            time: values.fee[`time_${key}`][0],
          }
          feeArr.push(feeObj)
          delete values.fee
        })
      }

      if (feeUnit === '$') {
        values.introducer_type = 2
        values.introducer_cost = JSON.stringify(feeArr)
      } else {
        values.introducer_type = 1
      }

      values = pickBy(values, identity)

      // 修改成本二次确认
      if (detail?.data?.cost !== values?.cost && detail?.data?.type === 3) {
        Dialog.show({
          content: (
            <div className="font-600 text-center pb-2 text-xl">
              {userInfo?.user_type === 2 && <p>签约员工更改成本需对方同意</p>}
              {userInfo?.user_type === 1 && <p>签约渠道更改成本需对方同意</p>}
              <p>是否确认更改</p>
            </div>
          ),
          closeOnAction: true,
          actions: [
            [
              {
                key: 'cancel',
                text: '取消',
                className: 'dialog-cancel',
                onClick() {
                  //
                  return
                },
              },
              {
                key: 'confirm',
                text: '确认',
                className: 'dialog-confirm',
                async onClick() {
                  let res
                  if (isEdit) {
                    values.type = detail?.data?.type
                    values.id = location.state?.id
                    res = await ManageApi.editStaff({ ...values })
                  } else {
                    res = await ManageApi.addStaff({ ...values })
                  }
                  if (res.status === 200) {
                    navigator('/manage/employee/list')
                  }
                },
              },
            ],
          ],
        })
      } else {
        let res
        if (isEdit) {
          values.type = detail?.data?.type
          values.id = location.state?.id
          res = await ManageApi.editStaff({ ...values })
        } else {
          res = await ManageApi.addStaff({ ...values })
        }
        if (res.status === 200) {
          navigator('/manage/employee/list')
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

  if (loading) return <DotLoading color="primary" />

  return (
    <div className={`${styles.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff] sm:(w-full flex justify-center pb-0)`}>
      <HeaderNav renderRight={false} title={`${isEdit ? '编辑员工资料' : '添加员工资料'}`} border />
      <div className="flex flex-col px-10 py-12 sm:(w-500px px-0 py-0)">
        <Form form={form} requiredMarkStyle="none" layout="horizontal" footer={null}>
          <div className="flex items-center">
            <HiilpAvatar name={detail?.data?.name} headurl={avatarInfo?.file_url} />
            <Button
              loading="auto"
              onClick={async () => {
                await fileInputEl.current.click()
              }}
              className="bg-[#f3f3f3] border-0 ml-5"
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
          <Form.Item name="nickname" label="员工称呼*" rules={[{ required: true }]}>
            <Input placeholder="员工称呼" />
          </Form.Item>
          <Form.Item name="email" label="员工邮箱">
            <Input placeholder="员工邮箱" />
          </Form.Item>
          <Form.Item label="员工手机*">
            <div className={styles.phone}>
              <div
                onClick={() => {
                  if (size?.width && size?.width <= 640) {
                    setPhonePickVisible(true)
                  }
                }}
                className={`${styles.phoneCode} text-xs h-full pl-3 pr-2 flex items-center justify-center`}
              >
                <p className="min-w-30px pl-1 sm:(hidden)">{phoneCode}</p>
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
              <Form.Item noStyle name="phone" rules={[{ required: true }]}>
                <Input placeholder="请输入手机号码" className={styles.input} />
              </Form.Item>
            </div>
          </Form.Item>
          <div className="border-b my-8"></div>
          <Form.Item label="员工成本*">
            <div className="flex items-center">
              <div className={`${styles.cost} flex-1 flex items-center mr-2`}>
                <span className="text-xs pl-3 w-6 flex items-center justify-center">{costUnit}</span>
                {costUnit === '$' && (
                  <Form.Item noStyle rules={[{ required: false }]}>
                    <Input disabled placeholder="0.00" className={`${styles.input} flex-1`} />
                  </Form.Item>
                )}
                {costUnit !== '$' && (
                  <Form.Item noStyle name="cost" rules={[{ required: true }]}>
                    <Input placeholder="0.00" className={`${styles.input}`} />
                  </Form.Item>
                )}
              </div>
              <SelectUnit
                valueUnit={costUnit}
                changeConfirm={(val) => {
                  setCostUnit(val)
                  form.setFieldsValue({ cost: '' })
                }}
                leftUnit="%"
                rightUnit="$"
              />
            </div>
          </Form.Item>
          {costUnit === '$' && (
            <>
              <Form.Item className={`${styles.dineIn} mt-4`} name="eat_in" label="堂食">
                <TimePriceItem
                  form={form}
                  timePicker={timePicker}
                  list={eatInlist}
                  setList={setEatInlist}
                  keyTitle="eat_in"
                />
              </Form.Item>
              <Form.Item className={`${styles.takeOut}`} name="take_out" label="外卖">
                <TimePriceItem
                  timePicker={timePicker}
                  list={takeOutlist}
                  setList={setTakeOutlist}
                  keyTitle="take_out"
                  form={form}
                />
              </Form.Item>
            </>
          )}
          <Form.Item name="introducer" label="介绍人">
            <Input placeholder="介绍人 " />
          </Form.Item>
          <Form.Item label="介绍费">
            <div className="flex items-center">
              <div className={`${styles.cost} flex flex-1 items-center mr-2`}>
                <span className="text-xs pl-3 w-6 flex items-center justify-center">{feeUnit}</span>
                {feeUnit === '$' && (
                  <Form.Item noStyle rules={[{ required: false }]}>
                    <Input disabled placeholder="0.00" className={`${styles.input} flex-1`} />
                  </Form.Item>
                )}
                {feeUnit !== '$' && (
                  <Form.Item noStyle name="introducer_cost" rules={[{ required: false }]}>
                    <Input placeholder="0.00" className={`${styles.input} flex-1`} />
                  </Form.Item>
                )}
              </div>
              <SelectUnit
                valueUnit={feeUnit}
                changeConfirm={(val) => {
                  setFeeUnit(val)
                  form.setFieldsValue({ introducer_cost: '' })
                }}
                leftUnit="%"
                rightUnit="$"
              />
            </div>
          </Form.Item>
          {feeUnit === '$' && (
            <>
              <Form.Item className={`${styles.dineIn} mt-4`} name="introducer_cost">
                <TimePriceItem form={form} timePicker={timePicker} list={feelist} setList={setFeelist} keyTitle="fee" />
              </Form.Item>
            </>
          )}
          <div className="border-b my-8"></div>
          <Form.Item layout="vertical" label="地址（选填）">
            <div className="flex items-center justify-between">
              <Form.Item noStyle name="address">
                <InitAutocomplete />
              </Form.Item>
              <SvgIcon
                onClick={() => {
                  getCurrentPosition(async (position: any) => {
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
                      }
                    )
                  })
                }}
                name="location"
                className="w-[20px] h-[20px] cursor-pointer"
              />
            </div>
          </Form.Item>
          {/* pc start */}
          {isEdit && (
            <>
              <div className="border-b my-8 hidden sm:flex"></div>
              <div
                onClick={() => {
                  navigator('/manage/employee/info/edit/detail', {
                    state: { id: detail?.data?.id, nickname: detail?.data?.nickname },
                  })
                }}
                className="hidden sm:(flex items-center cursor-pointer text-sm)"
              >
                <SvgIcon name="edit" className="w-[17px] h-[17px]" />
                <p className="text-color-[#7B7B7B] pl-5 hover:(underline text-color-[#2A4948])">编辑详细资料</p>
              </div>
            </>
          )}
          {/* pc end */}
          <div className="<sm:(fixed-b-btn) flex sm:(my-20)">
            {isEdit && (
              <Button
                onClick={() => setVisible(true)}
                className="sm:(hidden) w-[12%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
                block
              >
                <SvgIcon name="point" className="w-[15px] h-[3px]" />
              </Button>
            )}
            <Button
              onClick={onFinish}
              className="w-[70%] h-[2.75rem] rounded-xl sm:(w-25 rounded-3xl)"
              block
              type="submit"
              color="primary"
              loading="auto"
              loadingIcon={<Ellipseing />}
            >
              {isEdit ? '更新' : ' 添加'}
            </Button>
          </div>
          <HiilpActionSheet
            actions={[
              {
                text: '编辑详细资料',
                key: 'editDetail',
                onClick: () => {
                  navigator('/manage/employee/info/edit/detail', {
                    state: { id: detail?.data?.id, nickname: detail?.data?.nickname },
                  })
                },
              },
            ]}
            visible={visible}
            setVisible={setVisible}
          />
        </Form>
      </div>
      <div onClick={() => navigator(-1)} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default AddEmployeeForm
