import React, { RefObject } from 'react'
import moment from 'moment'
import HeaderNav from '@/components/HeaderNav'
import PickerContent from '../components/PickerContent'
import SvgIcon from '@/components/SvgIcon'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import {
  Toast,
  Button,
  Form,
  Input,
  TextArea,
  CheckList,
  Popup,
  Picker,
  DatePicker,
  PickerRef,
  Dialog,
} from 'antd-mobile'
import { useRequest } from 'ahooks'
import Geocode from 'react-geocode'
import CalendarApi from '@/http/api/calendar'
import ManageApi from '@/http/api/manage'
import InformationApi from '@/http/api/information'
import { store } from '@/redux'
import { getCurrentPosition } from '@/utils/util'
import { GOOGLE_MAP_KEY } from '@/constant'
import styles from './index.module.scss'
import { InitAutocomplete } from '@/components/SearchBox/init'
import Ellipseing from '@/components/Ellipseing'
import PcAddOrderForm from './PcAddOrderForm'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

function AddOrderForm() {
  const navigate = useNavigate()
  const params: any = useParams()
  const location: any = useLocation()
  const userInfo = store.getState().global.userInfo
  const [formInstance] = Form.useForm()

  const { runAsync: getSubscribeAsync } = useRequest(CalendarApi.getSubscribeDetail, {
    manual: true,
  })
  const { runAsync: getEmployeeAsync } = useRequest(ManageApi.getStaffSelect, {
    manual: true,
  })
  const { runAsync: getChannelAsync } = useRequest(ManageApi.getChannelSelect, {
    manual: true,
  })
  const { runAsync: checkSubscribe } = useRequest(CalendarApi.checkSubscribe, {
    manual: true,
  })
  const { data: clientData } = useRequest(ManageApi.getClientSelect, { defaultParams: [{}] })
  const { data: selectData } = useRequest(InformationApi.getInformationList, { defaultParams: [{ type: 9 }] })
  const { data: serviceData } = useRequest(ManageApi.getServerList)

  const orderId = params?.id
  const customerId = location?.state?.customerId
  const dateString = location?.state?.dateString || moment().format('YYYY-MM-DD')
  const timeString = location?.state?.timeString || ''
  const employeeId = location?.state?.employeeId || ''

  const [customerList, setCustomerList] = useState<any[]>([])
  const [typeList] = useState([
    { label: '堂食', value: '1' },
    { label: '外卖', value: '2' },
  ])
  const type = Form.useWatch('type', formInstance)
  const [employeeList, setEmployeeList] = useState<any[]>([])
  const [timeColumns] = useState(() => {
    const hourColumn = []
    const minuteColumn = []

    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        const hourValue = String(i)
        hourColumn.push({ label: hourValue, value: hourValue })
      }
    }
    minuteColumn.push(
      { label: '00', value: '00' },
      { label: '15', value: '15' },
      { label: '30', value: '30' },
      { label: '45', value: '45' }
    )
    return [hourColumn, minuteColumn]
  })
  const [lengthList, setLengthList] = useState<any[]>([])
  const [extraList, setExtraList] = useState<any[]>([])
  const [customer, setCustomer] = useState('')
  const [latitude, setLatitude] = useState('')
  const [sheetVisible, setSheetVisible] = useState(false)
  const [date, setDate] = useState(dateString)
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [extra, setExtra] = useState<string[]>([])
  const [popupVisible, setPopupVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (timeString) {
      const timeGroup = timeString.split(':')
      const hourText = timeGroup[0]
      const minuteText = timeGroup[1] === '0' ? '00' : timeGroup[1]
      formInstance.setFieldValue('time', [hourText, minuteText])
    } else {
      // 获取当前时间的H mm
      let now_h: any = moment().format('H')
      let now_m: any = moment().format('mm')
      if (now_m * 1 === 0) {
        now_m = `00`
      }
      if (now_m * 1 > 0 && now_m * 1 <= 15) {
        now_m = 15
      }
      if (now_m * 1 > 15 && now_m * 1 <= 30) {
        now_m = 30
      }
      if (now_m * 1 > 30 && now_m * 1 <= 45) {
        now_m = 45
      }
      if (now_m * 1 > 45) {
        now_m = `00`
        if (now_h * 1 === 23) {
          now_h = `0`
        } else {
          now_h = now_h * 1 + 1
        }
      }
      formInstance.setFieldValue('time', [`${now_h}`, `${now_m}`])
    }
  }, [timeString])

  // 存在员工ID
  useEffect(() => {
    if (employeeId) {
      formInstance.setFieldsValue({
        employee: [employeeId],
      })
    }
  }, [employeeId])

  // 存在订单ID
  useEffect(() => {
    const initOrderData = async () => {
      if (orderId) {
        const result = await getSubscribeAsync({ id: Number(orderId) })
        if (result.status === 200) {
          const locationResult = await Geocode.fromAddress(result.data.address)
          const orderStartMoment = moment.unix(result.data.start_time)
          setCustomer(result.data.client_id)
          setLatitude(
            locationResult.status === 'OK'
              ? `${locationResult.results[0].geometry.location.lat},${locationResult.results[0].geometry.location.lng}`
              : ''
          )
          setExtra(result.data.extra_ids)
          formInstance.setFieldsValue({
            type: [String(result.data.server_type)],
            address: locationResult.status === 'OK' ? result.data.address : '',
            employee: [String(result.data.staff_id)],
            time: [orderStartMoment.format('H'), orderStartMoment.format('mm')],
            length: [String(result.data.duration)],
            price: String(result.data.pay_amount),
            extra: result.data.extra_ids,
            note: result.data.remark,
          })
        }
      }
    }

    initOrderData()
  }, [orderId])

  // 选中数据
  useEffect(() => {
    if (selectData && selectData.data) {
      setLengthList(
        selectData.data.map((item: any) => ({
          label: item.label,
          value: item.value,
        }))
      )
    }
  }, [selectData])

  // 服务数据
  useEffect(() => {
    if (serviceData && serviceData.data && serviceData.data.extra) {
      setExtraList(
        serviceData.data.extra.map((item: any) => ({
          label: item.name,
          value: String(item.id),
        }))
      )
    }
  }, [serviceData])

  // 用户数据
  useEffect(() => {
    if (clientData && clientData.data) {
      setCustomerList(
        clientData.data.map((item: any) => ({
          label: item.nickname,
          value: String(item.id),
          email: item.email || '',
          avatar: item.head || '',
        }))
      )
    }
  }, [clientData])

  //初始化
  useEffect(() => {
    const initEmployeeData = async () => {
      if (userInfo && userInfo.user_type === 1) {
        const { data: channelData } = await getChannelAsync({ type: 2 })
        if (channelData && channelData?.length) {
          setEmployeeList(
            channelData?.map((item: any) => ({
              label: item.channel_name,
              value: String(item.id),
            }))
          )
        }
      } else if (userInfo && userInfo.user_type === 2) {
        const { data: employeeData } = await getEmployeeAsync({})
        if (employeeData && employeeData.length) {
          setEmployeeList(
            employeeData.map((item: any) => ({
              label: item.nickname,
              value: String(item.id),
            }))
          )
        }
      }
    }

    const initRefillData = () => {
      if (customerId) {
        setCustomer(customerId)
        const addOrderFormStr = localStorage.getItem('addOrderForm')
        if (addOrderFormStr) {
          const addOrderFormObj = JSON.parse(addOrderFormStr)
          formInstance.setFieldsValue(addOrderFormObj)
          setExtra(addOrderFormObj.extra)
          setLatitude(addOrderFormObj.latitude)
          localStorage.removeItem('addOrderForm')
        }
      }
    }

    initEmployeeData()
    initRefillData()
  }, [])

  //提交
  const onFinish = async (values: any) => {
    console.log(123)

    if (loading) return false
    setLoading(true)

    const subscribeParams: any = {
      server_type: Number(values.type[0]),
      staff_id: values.employee[0],
      start_time: moment(`${date} ${values.time[0]}:${values.time[1]}`, 'YYYY-MM-DD H:mm').unix(),
      duration: values.length[0],
      price: values.price,
      extra_ids: values.extra.join(','),
      remark: values.note || '',
      latitude,
    }

    // 存在客户ID
    if (customerId) subscribeParams.client_id = customerId

    // 地址经纬度
    if (values.address) {
      subscribeParams.address = values.address
    }
    try {
      // 校验是否可预约
      const checkResult: any = await checkSubscribe({
        staff_id: values.employee[0],
        start_time: moment(`${date} ${values.time[0]}:${values.time[1]}`, 'YYYY-MM-DD H:mm').unix(),
      })

      // 与休息时间冲突 二次确认
      if (checkResult.status === 205) {
        Dialog.show({
          content: `${checkResult?.msg}`,
          closeOnAction: true,
          actions: [
            [
              {
                key: 'cancel',
                text: '取消',
                className: 'dialog-cancel',
              },
              {
                key: 'confirm',
                text: `确定`,
                className: 'dialog-confirm',
                async onClick() {
                  const result = orderId
                    ? await CalendarApi.editSubscribe({
                        ...subscribeParams,
                        id: orderId,
                      })
                    : await CalendarApi.subscribeSave(subscribeParams)
                  if (result.status === 200) {
                    navigate('/calendar', { replace: true })
                  }
                },
              },
            ],
          ],
        })
      }

      if (checkResult.status === 200) {
        const result = orderId
          ? await CalendarApi.editSubscribe({
              ...subscribeParams,
              id: orderId,
            })
          : await CalendarApi.subscribeSave(subscribeParams)
        if (result.status === 200) {
          navigate('/calendar', { replace: true })
        }
      }
    } catch (error) {}

    setLoading(false)
  }

  const onPickerClick = (_e: any, ref: RefObject<PickerRef>) => {
    ref.current && ref.current.open()
  }

  // 添加客户
  const onAddCustomerClick = () => {
    if (customer && customerRenderGroup) {
      setSheetVisible(true)
    } else {
      const fieldValues = {
        ...formInstance.getFieldsValue(true),
        latitude,
      }
      localStorage.setItem('addOrderForm', JSON.stringify(fieldValues))
      navigate('/manage/customer/list', {
        state: {
          from: 'addOrder',
          dateString: location?.state?.dateString,
          timeString: location?.state?.timeString,
          employeeId: location?.state?.employeeId,
        },
      })
    }
  }

  const customerRenderGroup = useMemo(() => {
    const customerObj = customerList.find((item) => item.value === String(customer))
    if (customerObj) {
      return [customerObj.label, customerObj.email, customerObj.avatar]
    }
    return ''
  }, [customer, customerList])

  const dateRenderGroup = useMemo(() => {
    const dateStr = moment(date, 'YYYY-MM-DD').format('dddd YYYY/MM/DD')
    return dateStr.split(' ')
  }, [date])

  return (
    <div className={`${styles.AddOrderForm} pt-[48px] pb-[90px] sm:(pt-0 pb-0 !w-full)`}>
      <HeaderNav renderLeft={false} onBack={() => navigate('/calendar')} />
      {/* h5 */}
      <div className="flex flex-col px-10 py-12 sm:(hidden)">
        <p className="text-2xl font-600 pb-10">{orderId ? '编辑预约' : '添加新预约'}</p>
        <div
          className={`${styles.BorderedSelectItem} flex items-center justify-between py-3 pr-1 mb-6`}
          onClick={onAddCustomerClick}
        >
          {customer && customerRenderGroup ? (
            <div className="flex items-center">
              <div className={`${styles.CustomerAvatar} flex items-center justify-center`}>
                {customerRenderGroup[2] ? (
                  <img src={customerRenderGroup[2]} />
                ) : (
                  <div>{customerRenderGroup[0][0].toUpperCase()}</div>
                )}
              </div>
              <div className="flex flex-col ml-4">
                <span className="text-base font-600">{customerRenderGroup[0]}</span>
                <span className="text-xs text-color-[#999]">{customerRenderGroup[1]}</span>
              </div>
            </div>
          ) : (
            <span className="text-[12px] text-color-[#9a9a9a]">添加新客户</span>
          )}
          <SvgIcon
            name={customer && customerRenderGroup ? 'point' : 'add-customer-calendar'}
            className="w-[12px] h-[12px]"
          />
        </div>
        <div
          className={`${styles.BorderedSelectItem} flex items-center justify-between py-3 pr-1 mb-14`}
          onClick={() => {
            setDatePickerVisible(true)
          }}
        >
          <div className="flex flex-col">
            <span className="text-lg font-600">{dateRenderGroup[0]}</span>
            <span className="text-xs text-color-[#B5B5B5]">{dateRenderGroup[1]}</span>
          </div>
          <SvgIcon name="caret-right" className="w-[6px] h-[9px]" />
        </div>
        <HiilpActionSheet
          actions={[
            {
              text: '查看资料',
              key: 'view',
              onClick: () => {
                navigate('/manage/customer/info', { state: { id: customerId } })
                setSheetVisible(false)
              },
            },
            {
              text: '删除',
              key: 'delete',
              danger: true,
              onClick: () => {
                setCustomer('')
                setSheetVisible(false)
              },
            },
          ]}
          visible={sheetVisible}
          setVisible={setSheetVisible}
        />
        <DatePicker
          visible={datePickerVisible}
          value={moment(date, 'YYYY-MM-DD').toDate()}
          onClose={() => {
            setDatePickerVisible(false)
          }}
          onConfirm={(val: Date) => {
            setDate(moment(val).format('YYYY-MM-DD'))
          }}
        />
        <Form layout="horizontal" onFinish={onFinish} footer={null} form={formInstance}>
          <Form.Item name="type" label="类型" rules={[{ required: true }]} trigger="onConfirm" onClick={onPickerClick}>
            <Picker columns={[typeList]}>{(items) => <PickerContent val={items} textType="normal" />}</Picker>
          </Form.Item>
          {/* type == 2 && */}
          {type == 2 && (
            <div className="relative flex items-center">
              <Form.Item name="address" label="地址" rules={[{ required: true }]}>
                <InitAutocomplete
                  transparent
                  onConfirm={(place: any) => {
                    setLatitude(`${place?.geometry.location.lat()},${place?.geometry.location.lng()}`)
                  }}
                />
              </Form.Item>
              <SvgIcon
                name="location-calendar"
                className="w-[12px] h-[16px] absolute z-1"
                style={{ right: 8, top: 56 }}
                onClick={() => {
                  getCurrentPosition((position: any) => {
                    const currentLatitude = position.coords.latitude
                    const currentLongitude = position.coords.longitude
                    Geocode.fromLatLng(currentLatitude, currentLongitude).then(
                      (response) => {
                        const address = response.results[0].formatted_address
                        formInstance.setFieldValue('address', address)
                        setLatitude(`${currentLatitude},${currentLongitude}`)
                      },
                      (error) => {
                        Toast.show('Server returned status code ZERO_RESULTS')
                        console.error(error)
                      }
                    )
                  })
                }}
              />
            </div>
          )}
          <Form.Item
            name="employee"
            label={userInfo?.user_type === 1 ? '渠道' : '员工'}
            rules={[{ required: true }]}
            trigger="onConfirm"
            onClick={(e, ref) => {
              // 如果渠道列表为空
              if (employeeList.length === 0) {
                return Toast.show(
                  userInfo?.user_type === 1 ? '暂无渠道列表，请先添加渠道' : '暂无员工列表，请先添加员工'
                )
              }
              onPickerClick(e, ref)
            }}
          >
            <Picker columns={[employeeList]}>{(items) => <PickerContent val={items} textType="normal" />}</Picker>
          </Form.Item>
          <div>
            <Form.Item
              name="time"
              label="时间"
              className={styles.halfFormItem}
              rules={[{ required: true }]}
              trigger="onConfirm"
              onClick={onPickerClick}
            >
              <Picker columns={timeColumns}>{(items) => <PickerContent val={items} textType="time" />}</Picker>
            </Form.Item>
            <Form.Item
              name="length"
              label="时长"
              className={styles.halfFormItem}
              rules={[{ required: true }]}
              trigger="onConfirm"
              onClick={onPickerClick}
            >
              <Picker columns={[lengthList]}>{(items) => <PickerContent val={items} textType="normal" />}</Picker>
            </Form.Item>
            <div className={`${styles.halfFormItem} flex flex-shrink-0 items-center relative`}>
              <span className="text-[14px] mr-4px absolute z-1 top-[58px] left-[8px]">$</span>
              <Form.Item name="price" label="价格" className={styles.prefixInputItem} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name="extra"
              label="额外服务"
              className={styles.halfFormItem}
              initialValue={extra}
              onClick={() => {
                if (extraList.length > 0) {
                  setPopupVisible(true)
                } else {
                  Toast.show('无额外服务')
                }
              }}
            >
              <div className="flex items-center justify-between min-h-[21px]">
                <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {extraList
                    .filter((item) => extra.includes(item.value))
                    .map((item) => item.label)
                    .join(', ')}
                </span>
                <SvgIcon name="caret-down" className="w-[10px] h-[6px] fill-[#2A4948]" />
              </div>
              <Popup
                visible={popupVisible}
                // onMaskClick={() => {
                //   setPopupVisible(false)
                // }}
                bodyStyle={{ maxHeight: '80vh', borderRadius: '20px 20px 0 0' }}
              >
                <CheckList
                  value={extra}
                  multiple={true}
                  onChange={(val) => {
                    setExtra(val)
                    formInstance.setFieldValue('extra', val)
                  }}
                >
                  <div className="flex justify-between px-4 py-2">
                    <p
                      onClick={() => {
                        formInstance.setFieldsValue({ extra: [''] })
                        setExtra([])
                        setPopupVisible(false)
                      }}
                    >
                      取消
                    </p>
                    <p
                      onClick={() => {
                        setPopupVisible(false)
                      }}
                    >
                      确定
                    </p>
                  </div>
                  {extraList.map((item, index) => (
                    <CheckList.Item key={index} value={item.value}>
                      {item.label}
                    </CheckList.Item>
                  ))}
                </CheckList>
              </Popup>
            </Form.Item>
          </div>
          <Form.Item name="note" label="备注">
            <TextArea placeholder="输入" />
          </Form.Item>
          <div className="fixed-b-btn">
            <Button
              className="w-[65%] h-[2.75rem] rounded-3xl"
              block
              type="submit"
              color="primary"
              loadingIcon={<Ellipseing />}
              loading={loading}
            >
              保存
            </Button>
          </div>
        </Form>
      </div>
      {/* pc */}
      <div className="<sm:(hidden) sm:(flex justify-center items-center)">
        <PcAddOrderForm
          dateString={dateString}
          employeeId={employeeId}
          timeString={timeString}
          customerId={customerId}
        />
      </div>
    </div>
  )
}

export default AddOrderForm
