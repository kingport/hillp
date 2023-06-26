import React, { RefObject } from 'react'
import moment from 'moment'
import SvgIcon from '@/components/SvgIcon'
import { Toast, Button, Dialog } from 'antd-mobile'
import { useRequest, useSize } from 'ahooks'
import Geocode from 'react-geocode'
import CalendarApi from '@/http/api/calendar'
import ManageApi from '@/http/api/manage'
import InformationApi from '@/http/api/information'
import { store } from '@/redux'
import { getCurrentPosition, getWeek } from '@/utils/util'
import { GOOGLE_MAP_KEY } from '@/constant'
import styles from './index.module.scss'
import { InitAutocomplete } from '@/components/SearchBox/init'
import Ellipseing from '@/components/Ellipseing'
import { Select, Row, Col, Input, TimePicker, Form, Skeleton, DatePickerProps, DatePicker } from 'antd'
import dayjs from 'dayjs'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')
const { TextArea } = Input

function AddOrderForm(props: any) {
  const { employeeId, timeString, dateString = moment().format('YYYY-MM-DD'), customerId } = props
  const navigate = useNavigate()
  const params: any = useParams()
  const location: any = useLocation()
  const userInfo = store.getState().global.userInfo
  const [formInstance] = Form.useForm()
  const size: any = useSize(document.querySelector('body'))

  const { runAsync: getSubscribeAsync, loading: detailLoading } = useRequest(CalendarApi.getSubscribeDetail, {
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
  const { data: clientData, loading: clientLoading } = useRequest(ManageApi.getClientSelect, {
    defaultParams: [{}],
    onSuccess(res) {
      if (customerId) {
        const name = res?.data?.filter((i: { id: number }) => Number(i.id) === Number(customerId))[0]?.nickname
        const phone = res?.data?.filter((i: { id: number }) => Number(i.id) === Number(customerId))[0]?.phone
        const area = res?.data?.filter((i: { id: number }) => Number(i.id) === Number(customerId))[0]?.area
        const address = res?.data?.filter((i: { id: number }) => Number(i.id) === Number(customerId))[0]?.address
        formInstance.setFieldsValue({
          customer: name,
          phone: phone,
          area: area,
          address,
        })
      }
    },
  })
  const { data: selectData, loading: selectLoading } = useRequest(InformationApi.getInformationList, {
    defaultParams: [{ type: 9 }],
  })
  const { data: serviceData, loading: serviceLoading } = useRequest(ManageApi.getServerList)

  const orderId = params?.id
  // const customerId = location?.state?.customerId
  // const dateString = location?.state?.dateString || moment().format('YYYY-MM-DD')
  // const timeString = location?.state?.timeString || ''
  // const employeeId = location?.state?.employeeId || ''

  const [customerList, setCustomerList] = useState<any[]>([])

  const type = Form.useWatch('type', formInstance)
  const [employeeList, setEmployeeList] = useState<any[]>([])
  const [lengthList, setLengthList] = useState<any[]>([])
  const [extraList, setExtraList] = useState<any[]>([])
  const [customer, setCustomer] = useState('')
  const [latitude, setLatitude] = useState('')
  const [date, setDate] = useState(dateString)
  const [extra, setExtra] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const dateFormat = 'YYYY/MM/DD'
  const customFormat: DatePickerProps['format'] = (value) => {
    return `${getWeek(value.unix() * 1000)} ${value.format(dateFormat)}`
  }

  useEffect(() => {
    if (timeString) {
      const timeGroup = timeString.split(':')
      const hourText = timeGroup[0]
      const minuteText = timeGroup[1] === '0' ? '00' : timeGroup[1]
      formInstance.setFieldValue('time', dayjs(`${hourText}:${minuteText}`, 'HH:mm'))
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
      formInstance.setFieldValue('time', dayjs(`${now_h}:${now_m}`, 'HH:mm'))
    }
  }, [timeString])

  // 存在员工ID
  useEffect(() => {
    if (employeeId && Number(userInfo?.user_type) === 2) {
      formInstance.setFieldsValue({
        employee: employeeId,
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
            type: String(result.data.server_type),
            address: locationResult.status === 'OK' ? result.data.address : '',
            employee: String(result.data.staff_id),
            time: dayjs(`${orderStartMoment.format('H')}:${orderStartMoment.format('mm')}`, 'HH:mm'),
            length: String(result.data.duration),
            price: String(result.data.pay_amount),
            extra: result.data.extra_ids,
            note: result.data.remark,
            customer: result.data.client_name,
            phone: result.data.client_phone,
            area: result.data.client_area,
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
          label: `${item.nickname} ${item?.area} ${item?.phone}`,
          value: Number(item.id),
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
    const hmFormat = values['time'].format('H:mm')
    const subscribeParams: any = {
      server_type: Number(values.type),
      staff_id: values.employee,
      start_time: moment(`${date} ${hmFormat}`, 'YYYY-MM-DD H:mm').unix(),
      duration: values.length,
      price: values.price,
      extra_ids: values.extra?.join(','),
      remark: values.note || '',
      latitude,
    }

    if (customer) subscribeParams.client_id = customer
    // 存在客户ID
    if (customerId) subscribeParams.client_id = customerId

    // 地址经纬度
    if (values.address) {
      subscribeParams.address = values.address
    }

    // 校验是否可预约
    const checkResult: any = await checkSubscribe({
      staff_id: values.employee,
      start_time: moment(`${date} ${hmFormat}`, 'YYYY-MM-DD H:mm').unix(),
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
                } else {
                  setLoading(false)
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
  }

  // 添加客户
  const onAddCustomerClick = () => {
    navigate('/manage/add/customer', {
      state: {
        from: 'pcAddOrder',
      },
    })
  }

  // const customerRenderGroup = useMemo(() => {
  //   const customerObj = customerList.find((item) => item.value === String(customer))
  //   if (customerObj) {
  //     return [customerObj.label, customerObj.email, customerObj.avatar]
  //   }
  //   return ''
  // }, [customer, customerList])

  // const dateRenderGroup = useMemo(() => {
  //   const dateStr = moment(date, 'YYYY-MM-DD').format('dddd YYYY/MM/DD')
  //   return dateStr.split(' ')
  // }, [date])

  const format = 'H:mm'

  return (
    <Skeleton loading={detailLoading || clientLoading || selectLoading || serviceLoading}>
      <div className={`min-w-800px flex flex-col justify-center items-center pb-90px`}>
        <div className="text-xl flex z-99 items-center justify-between fixed top-0 bg-[#fff] font-600 py-10 border-b-width-1px text-center border-solid border-color-[#e7eaea] w-full">
          <p></p>
          <p>添加新预约</p>
          <SvgIcon
            name="nav-cancel"
            onClick={() => navigate('/calendar')}
            className="w-[20px] h-[20px] mr-4 cursor-pointer"
          />
        </div>
        <div className="flex flex-col px-10 pt-30 min-w-900px">
          <div className="flex items-center pt-20 relative">
            <p className="text-sm font-500 pr-5">搜索客户</p>
            <Select
              style={{ flex: 1, borderRadius: 24 }}
              onChange={async (val) => {
                if (val) {
                  setCustomer(val)
                  const name = clientData?.data?.filter((i: { id: number }) => Number(i.id) === Number(val))[0]
                    ?.nickname
                  const phone = clientData?.data?.filter((i: { id: number }) => Number(i.id) === Number(val))[0]?.phone
                  const area = clientData?.data?.filter((i: { id: number }) => Number(i.id) === Number(val))[0]?.area
                  const address = clientData?.data?.filter((i: { id: number }) => Number(i.id) === Number(val))[0]
                    ?.address
                  formInstance.setFieldsValue({
                    customer: name,
                    phone: phone,
                    area: area,
                    address,
                  })
                  // 解析经纬度
                  if (address) {
                    const locationResult = await Geocode.fromAddress(address)
                    setLatitude(
                      locationResult.status === 'OK'
                        ? `${locationResult.results[0].geometry.location.lat},${locationResult.results[0].geometry.location.lng}`
                        : ''
                    )
                  }
                }
              }}
              value={customer}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              showSearch
              placeholder="请选择客户"
              options={customerList}
              className="!bg-[#f8f4f2]"
            />
            <div>
              <Button shape="rounded" className="ml-2 bg-[#D2693F] w-87px text-color-[#fff]">
                确认
              </Button>
              <a
                onClick={onAddCustomerClick}
                className="text-xs w-87px text-center absolute right-0 -bottom-6 underline"
              >
                添加新客户
              </a>
            </div>
          </div>
          <Form layout="vertical" onFinish={onFinish} form={formInstance} className="mt-20">
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item
                  name="employee"
                  label={userInfo?.user_type === 1 ? '渠道' : '员工'}
                  rules={[{ required: true, message: '此项是必填项' }]}
                >
                  <Select
                    options={employeeList}
                    placeholder="请选择"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="type" label="类型" rules={[{ required: true, message: '此项是必填项' }]}>
                  <Select
                    options={[
                      { label: '堂食', value: '1' },
                      { label: '外卖', value: '2' },
                    ]}
                    placeholder="请选择类型"
                  />
                </Form.Item>
              </Col>
              {Number(type) === 2 && (
                <Col span={14}>
                  <div className="relative flex items-center">
                    <Form.Item
                      name="address"
                      label="地址"
                      rules={[{ required: true, message: '此项是必填项' }]}
                      className="w-full"
                    >
                      <InitAutocomplete
                        onConfirm={(place: any) => {
                          setLatitude(`${place?.geometry.location.lat()},${place?.geometry.location.lng()}`)
                        }}
                        transparent
                        style={{ background: '#f2f5f5', padding: '6px 10px' }}
                      />
                    </Form.Item>
                    <SvgIcon
                      name="location-calendar"
                      className="w-[24px] h-[32px] cursor-pointer pt-2"
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
                </Col>
              )}
            </Row>
            <div>
              <Row gutter={12}>
                <Col span={6}>
                  <Form.Item
                    initialValue={dayjs(dateString)}
                    name="date"
                    label="日期"
                    rules={[{ required: true, message: '此项是必填项' }]}
                  >
                    <DatePicker
                      onChange={(val) => {
                        setDate(dayjs(val).format('YYYY/MM/DD'))
                      }}
                      // value={dayjs(dateString, dateFormat)}
                      placeholder="请选择时间"
                      allowClear={false}
                      format={(val) => customFormat(val)}
                      className=""
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="time" label="时间" rules={[{ required: true, message: '此项是必填项' }]}>
                    <TimePicker showNow={false} minuteStep={15} format={format} placeholder="请选择时间" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="length" label="时长" rules={[{ required: true, message: '此项是必填项' }]}>
                    <Select options={lengthList} placeholder="请选择时长" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    className={styles.price}
                    name="price"
                    label="价格"
                    rules={[{ required: true, message: '此项是必填项' }]}
                  >
                    <Input addonBefore="$" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="extra" label="额外服务" initialValue={[]}>
                <Select options={extraList} placeholder="请选择额外服务" mode="multiple" />
              </Form.Item>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item className={styles.custname} name="customer" label="客户（选填）">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item className={styles.custname} name="phone" label="联系方式（选填）">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item hidden noStyle name="area">
                <Input readOnly />
              </Form.Item>
            </div>
            <Row>
              <Col span={24}>
                <Form.Item name="note" className={styles.area} label="备注（选填）">
                  <TextArea placeholder="输入" />
                </Form.Item>
              </Col>
            </Row>
            <div className="">
              <Button
                className="h-[36px] w-100px rounded-3xl"
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
      </div>
    </Skeleton>
  )
}

export default AddOrderForm
