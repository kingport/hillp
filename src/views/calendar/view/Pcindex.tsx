import React, { RefObject } from 'react'
import moment from 'moment'
import { DatePicker, Rate, TextArea } from 'antd-mobile'
import { useRequest } from 'ahooks'
import SvgIcon from '@/components/SvgIcon'
import RateModal from '@/views/messenger/components/RateModal'
import CalendarApi from '@/http/api/calendar'
import Geocode from 'react-geocode'
import styles from './index.module.scss'
import { GOOGLE_MAP_KEY } from '@/constant'
import { getWeek } from '@/utils/util'
import InformationApi from '@/http/api/information'
import { Dropdown, Skeleton, Space, Button, Input, MenuProps, Form, Modal, Select } from 'antd'
import { InitAutocomplete } from '@/components/SearchBox/init'
import { isEmpty } from 'lodash'
import { DownOutlined } from '@ant-design/icons'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

function CalendarView() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const orderId = location?.state?.id
  const [formInstance] = Form.useForm()

  const {
    data: subscribeData,
    loading: subscribeLoading,
    refresh,
  } = useRequest(CalendarApi.getSubscribeDetail, {
    defaultParams: [{ id: Number(orderId) }],
  })
  const { runAsync: editOrderAsync } = useRequest(CalendarApi.editOrder, {
    manual: true,
  })
  useRequest(() => InformationApi.getInformationList({ type: 3 }), {
    onSuccess(res) {
      setMethodList(res?.data)
    },
  })
  const { run } = useRequest((params) => CalendarApi.editOrder(params), {
    manual: true,
    onSuccess(res) {
      refresh()
      setVisible(false)
    },
  })

  const [methodList, setMethodList] = useState<any>([])

  const [status, setStatus] = useState(0)
  const [visible, setVisible] = useState(false)
  const [editType, setEditType] = useState('')
  const [latitude, setLatitude] = useState('')

  useEffect(() => {
    if (subscribeData && subscribeData.data) {
      setStatus(subscribeData.data.status)
    }
  }, [subscribeData])

  const onOrderOperate = async (source: number, params: any, callback?: () => void) => {
    const result = await editOrderAsync({
      source,
      params: JSON.stringify(params),
      id: orderId,
    })

    if (result.status === 200) {
      refresh()
      callback && callback()
    }
  }

  const onProfileClick = () => {
    if (subscribeData.data.source === 2) return false
    navigate('/manage/customer/info', {
      state: { id: subscribeData?.data?.client_id, from: 'calendarView', source: subscribeData?.data?.source },
    })
  }

  const onPayClick = () => {
    navigate('/calendar/pay', {
      state: {
        payInfo: subscribeData?.data,
      },
    })
  }

  // 修改定金
  const editEarnest = () => {
    setEditType('earnest')
    setVisible(true)
  }

  // 修改地址
  const editAddress = () => {
    setEditType('address')
    setVisible(true)
  }

  const onFinish = (values: any) => {
    if (editType === 'earnest') {
      run({
        id: orderId,
        source: 2,
        params: JSON.stringify({ information_id: values.information_id, earnest: values.earnest }),
      })
    } else if (editType === 'address') {
      run({
        id: orderId,
        source: 4,
        params: JSON.stringify({
          address: values.address,
          house_num: values.house_num,
          bell: values.bell,
          remark: values.remark,
        }),
      })
    }
  }

  // 当前时间是否是目标时间15分钟内
  const isShowtake = () => {
    const subscribeTime = moment(subscribeData?.data?.start_time * 1000).add(-15, 'minutes')
    return subscribeTime.isBefore(moment())
  }

  // 当前时间是否大于预约结束时间
  const isMaxNowTime = () => {
    const maxTime = moment(subscribeData?.data?.start_time * 1000).add(subscribeData?.data?.duration, 'minutes')
    return maxTime.isBefore(moment())
  }

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e?.key === 'edit') {
      navigate(`/calendar/edit/order/${orderId}`, {
        state: {
          customerId: subscribeData.data.client_id,
        },
      })
    }
    if (e?.key === 'rearrange') {
      navigate(`/calendar/edit/order/${orderId}`, {
        state: {
          customerId: subscribeData.data.client_id,
        },
      })
    }
    if (e?.key === 'cancel') {
      onOrderOperate(9, {}, () => {
        navigate('/calendar')
      })
    }
    if (e?.key === 'edit_time') {
      const value = await DatePicker.prompt({ precision: 'minute' })
      if (value) {
        onOrderOperate(3, { start_time: moment(value).unix() }, () => {
          navigate('/calendar')
        })
      }
    }
    if (e?.key === 'edit_address') {
      editAddress()
    }
  }

  // 底部渲染
  const renderFooter = () => {
    let items: MenuProps['items'] = []
    const { status, source, server_type, push_house, staff_evaluate } = subscribeData.data

    if (status === 0 || source === 1) {
      items = [
        {
          label: '编辑预约',
          key: 'edit',
        },
        {
          label: '重新排期',
          key: 'rearrange',
        },
        {
          label: '取消预约',
          key: 'cancel',
          danger: true,
        },
      ]
    } else if (
      (status === 1 && server_type === 2 && source === 2) ||
      (status === 1 && server_type === 1 && source === 2)
    ) {
      //
      items = [
        {
          label: '更改时间',
          key: 'edit_time',
        },
        {
          label: '更改地址',
          key: 'edit_address',
          disabled: server_type === 1 && source === 2 ? false : true,
        },
      ]
    }

    const menuProps = {
      items,
      onClick: handleMenuClick,
    }

    // 待处理
    if (status === 0 && source === 2 && server_type === 1) {
      return (
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       onOrderOperate(1, {}, () => {
        //         navigate('/calendar')
        //       })
        //     }}
        //   >
        //     拒绝接单
        //   </Button>
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl"
        //     block
        //     color="primary"
        //     onClick={() => {
        //       onOrderOperate(7, {})
        //     }}
        //   >
        //     接受订单
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Button
            className="w-[35%] mr-4"
            block
            onClick={() => {
              onOrderOperate(1, {}, () => {
                navigate('/calendar')
              })
            }}
          >
            拒绝接单
          </Button>
          <Button
            className="w-[35%]"
            type="primary"
            block
            onClick={() => {
              onOrderOperate(7, {})
            }}
          >
            接受订单
          </Button>
        </div>
      )
    }
    if (status === 0 && source === 1 && server_type === 1) {
      return <></>
    }
    if (status === 0 && source === 1 && server_type === 2) {
      return <></>
    }
    if (status === 0 && source === 2 && server_type === 2) {
      return (
        <div className="flex justify-between w-[80%] pt-4">
          <Button
            style={{ width: '48%' }}
            onClick={() => {
              onOrderOperate(1, {}, () => {
                navigate('/calendar')
              })
            }}
          >
            拒绝接单
          </Button>
          <Button
            style={{ width: '48%' }}
            type="primary"
            onClick={() => {
              onOrderOperate(7, {})
            }}
          >
            接受订单
          </Button>
        </div>
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       onOrderOperate(1, {}, () => {
        //         navigate('/calendar')
        //       })
        //     }}
        //   >
        //     拒绝接单
        //   </Button>
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl"
        //     block
        //     color="primary"
        //     onClick={() => {
        //       onOrderOperate(7, {})
        //     }}
        //   >
        //     接受订单
        //   </Button>
        // </div>
      )
    }

    // 正常
    if (status === 1 && server_type === 1 && source === 2) {
      return (
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       onOrderOperate(9, {})
        //     }}
        //   >
        //     取消订单
        //   </Button>
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl"
        //     block
        //     color="primary"
        //     onClick={() => {
        //       setSheetVisible(true)
        //     }}
        //   >
        //     <div className="flex justify-center items-center">
        //       <span>更多</span>
        //       <SvgIcon name="caret-down" className="w-[9px] h-[6px] fill-[#FFF] ml-1" />
        //     </div>
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Button
            style={{ width: '48%' }}
            type="primary"
            danger
            onClick={() => {
              onOrderOperate(9, {})
            }}
          >
            取消订单
          </Button>
          <Dropdown menu={menuProps}>
            <Button style={{ width: '48%' }}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      )
    }
    if (status === 1 && server_type === 1 && source === 1) {
      return (
        <div className="flex justify-between w-[80%] pt-4">
          <Dropdown menu={menuProps}>
            <Button style={{ width: '48%' }}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Button style={{ width: '48%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
      )
    }
    if (status === 1 && server_type === 2 && source === 2 && !isShowtake()) {
      return (
        <div className="flex justify-between w-[80%] pt-4">
          <Button
            style={{ width: '48%' }}
            type="primary"
            danger
            onClick={() => {
              onOrderOperate(9, {})
            }}
          >
            取消订单
          </Button>
          <Dropdown menu={menuProps}>
            <Button style={{ width: '48%' }}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       onOrderOperate(9, {})
        //     }}
        //   >
        //     取消订单
        //   </Button>
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl"
        //     block
        //     color="primary"
        //     onClick={() => {
        //       setSheetVisible(true)
        //     }}
        //   >
        //     <div className="flex justify-center items-center">
        //       <span>更多</span>
        //       <SvgIcon name="caret-down" className="w-[9px] h-[6px] fill-[#FFF] ml-1" />
        //     </div>
        //   </Button>
        // </div>
      )
    }
    if (status === 1 && server_type === 2 && source === 2 && isShowtake()) {
      return (
        <div className="flex justify-between w-[80%] pt-4">
          <Button
            style={{ width: '48%' }}
            type="primary"
            danger
            onClick={() => {
              onOrderOperate(9, {})
            }}
          >
            取消订单
          </Button>
          <Button
            style={{ width: '48%' }}
            type="primary"
            onClick={() => {
              onOrderOperate(5, {})
            }}
          >
            员工已到达
          </Button>
        </div>
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       onOrderOperate(9, {})
        //     }}
        //   >
        //     取消订单
        //   </Button>
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl"
        //     block
        //     color="primary"
        //     onClick={() => {
        //       onOrderOperate(5, {})
        //     }}
        //   >
        //     员工已到达
        //   </Button>
        // </div>
      )
    }
    if (status === 1 && server_type === 2 && source === 1) {
      return (
        <div className="flex justify-between w-[80%] pt-4">
          <Dropdown menu={menuProps}>
            <Button style={{ width: '48%' }}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Button style={{ width: '48%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       setSheetVisible(true)
        //     }}
        //   >
        //     <div className="flex justify-center items-center">
        //       <span>更多</span>
        //       <SvgIcon name="caret-down" className="w-[9px] h-[6px] ml-1" />
        //     </div>
        //   </Button>
        //   <Button className="w-[35%] ml-4 h-[2.75rem] rounded-3xl" block color="primary" onClick={onPayClick}>
        //     结付
        //   </Button>
        // </div>
      )
    }

    // 我已达到
    if (status === 4 && server_type === 1 && source === 2 && !isMaxNowTime() && push_house !== 1) {
      return (
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       onOrderOperate(9, {})
        //     }}
        //   >
        //     取消订单
        //   </Button>
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl"
        //     block
        //     color="primary"
        //     onClick={() => {
        //       onOrderOperate(8, {})
        //     }}
        //   >
        //     发送房间号
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Button
            style={{ width: '48%' }}
            type="primary"
            danger
            onClick={() => {
              onOrderOperate(9, {})
            }}
          >
            取消订单
          </Button>
          <Button
            style={{ width: '48%' }}
            type="primary"
            onClick={() => {
              onOrderOperate(8, {})
            }}
          >
            发送房间号
          </Button>
        </div>
      )
    }
    if (status === 4 && server_type === 1 && source === 2 && isMaxNowTime() && push_house !== 1) {
      return (
        // <div className="">
        //   <Button className="w-[90%] h-[2.75rem] rounded-3xl" block color="primary" onClick={onPayClick}>
        //     结付
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Button style={{ width: '100%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
      )
    }
    if (status === 4 && server_type === 1 && source === 2 && push_house === 1) {
      return (
        // <div className="">
        //   <Button className="w-[90%] h-[2.75rem] rounded-3xl" block color="primary" onClick={onPayClick}>
        //     结付
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Button style={{ width: '100%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
      )
    }
    if (status === 4 && server_type === 1 && source === 1) {
      return (
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       setSheetVisible(true)
        //     }}
        //   >
        //     <div className="flex justify-center items-center">
        //       <span>更多</span>
        //       <SvgIcon name="caret-down" className="w-[9px] h-[6px] ml-1" />
        //     </div>
        //   </Button>
        //   <Button className="w-[35%] ml-4 h-[2.75rem] rounded-3xl" block color="primary" onClick={onPayClick}>
        //     结付
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Dropdown menu={menuProps}>
            <Button style={{ width: '48%' }}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Button style={{ width: '48%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
      )
    }
    if (status === 4 && server_type === 2 && source === 2) {
      return (
        // <div className="">
        //   <Button className="w-[90%] ml-4 h-[2.75rem] rounded-3xl" block color="primary" onClick={onPayClick}>
        //     结付
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Button style={{ width: '100%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
      )
    }
    if (status === 4 && server_type === 2 && source === 1) {
      return (
        // <div className="">
        //   <Button
        //     className="w-[35%] h-[2.75rem] rounded-3xl mr-4"
        //     block
        //     onClick={() => {
        //       setSheetVisible(true)
        //     }}
        //   >
        //     <div className="flex justify-center items-center">
        //       <span>更多</span>
        //       <SvgIcon name="caret-down" className="w-[9px] h-[6px] ml-1" />
        //     </div>
        //   </Button>
        //   <Button className="w-[35%] ml-4 h-[2.75rem] rounded-3xl" block color="primary" onClick={onPayClick}>
        //     结付
        //   </Button>
        // </div>
        <div className="flex justify-between w-[80%] pt-4">
          <Dropdown menu={menuProps}>
            <Button style={{ width: '48%' }}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Button style={{ width: '48%' }} type="primary" onClick={onPayClick}>
            结付
          </Button>
        </div>
      )
    }

    // 线上取消2 商家拒绝3 订单已完成5 超时取消6 商家取消7
    if ([2, 3, 6, 7].includes(status)) {
      return <></>
    }

    // 显示评价按钮 线下单结束不需要评价 status == 5 && staff_evaluate === 0 && source !== 1
    if (status == 5 && staff_evaluate === 0 && source !== 1) {
      return (
        <div className="w-full flex justify-center mt-4">
          <RateModal name={subscribeData.data.client_name} id={subscribeData.data.id} width="70%" callback={refresh} />
        </div>
      )
    }

    return <></>
  }

  if (subscribeLoading || !subscribeData.data) return <Skeleton loading />

  return (
    <div className={`${styles.CalendarView}`}>
      <div className="text-xl flex z-99 items-center justify-between fixed top-0 bg-[#fff] font-600 py-10 border-b-width-1px text-center border-solid border-color-[#e7eaea] w-full">
        <p></p>
        <p>预约详情</p>
        <SvgIcon
          name="nav-cancel"
          onClick={() => navigate('/calendar')}
          className="w-[20px] h-[20px] mr-4 cursor-pointer"
        />
      </div>
      <div className="flex pt-25 h-[100vh]">
        <div className="flex flex-1 flex-col px-10 py-12 justify-center items-center">
          <div className="w-[500px]">
            <span className="text-2xl font-600">
              {getWeek(subscribeData?.data?.start_time * 1000)}&nbsp;
              {moment(subscribeData?.data?.start_time * 1000).format('YYYY年MM月DD日')}
            </span>
            <div className={`${styles.BorderedViewItem} flex flex-col mt-12`}>
              <span className="text-base font-600">
                {subscribeData.data.online_name || '--'}
                {moment(subscribeData?.data?.start_time * 1000).format('HH:mm')}
              </span>
              <span className="text-xs">
                {subscribeData.data.server_type === 1 ? '堂食' : '外卖'} ，与{subscribeData.data.staff_name || '--'}
                {subscribeData.data.duration}分钟的预约
              </span>
            </div>
            <div className={`${styles.BorderedViewItem} flex flex-col leading-7 `}>
              <div className="flex justify-between">
                <div className="text-xs">
                  <span className="font-600">基础服务：</span>
                  <span>{subscribeData.data.basics_server}</span>
                </div>
                <span>${subscribeData.data.basics_price}</span>
              </div>
              {subscribeData.data.extra_ids.length > 0 ? (
                <div className="flex justify-between">
                  <div className="text-xs">
                    <span className="font-600">额外服务：</span>
                    <span>{subscribeData.data.extra_server}</span>
                  </div>
                  <span>${subscribeData.data.extra_price}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <div className="text-xs">
                  <span className="font-600 flex items-center">
                    定金
                    {subscribeData?.data?.source === 1 && (
                      <SvgIcon onClick={editEarnest} name="edit" className="w-[20px] h-16px cursor-pointer" />
                    )}
                  </span>
                </div>
                <span>${subscribeData.data.earnest}</span>
              </div>
            </div>
            <div className={`${styles.BorderedViewItem} flex flex-col pb-3`}>
              <div
                style={{ borderBottom: '0.5px solid #a1a1a1' }}
                className="flex justify-between text-lg text-color-[#2A4948] font-600 pb-4"
              >
                <span>{subscribeData.data.duration / 60}hr</span>
                <span>${subscribeData.data.total_amount}</span>
              </div>
              <div className="flex flex-wrap items-center text-xs pt-5 pb-2">
                <span className="text-color-[#464646] font-600">客户联系方式：</span>
                <span className="text-color-[#858585]">
                  {subscribeData.data.client_area || '--'} {subscribeData.data.client_phone}
                </span>
              </div>
              <div className="flex flex-wrap items-center text-xs pb-2">
                <span className="text-color-[#464646] font-600">地址：</span>
                <span className="text-color-[#858585]">{subscribeData.data.address}</span>
                <SvgIcon
                  name="edit"
                  className="w-[16px] h-[16px] ml-1 fill-[#2A4948] cursor-pointer"
                  onClick={editAddress}
                />
              </div>
              <div className="flex flex-wrap items-center text-xs pb-2">
                <span className="text-color-[#464646] font-600">门牌号：</span>
                <span className="text-color-[#858585]">{subscribeData.data.house_num}</span>
              </div>
              <div className="flex flex-wrap items-center text-xs pb-2">
                <span className="text-color-[#464646] font-600">按铃方式：</span>
                <span className="text-color-[#858585]">{subscribeData.data.bell}</span>
              </div>
              <div className="flex flex-wrap items-center text-xs">
                <span className="text-color-[#464646] font-600">备注：</span>
                <span className="text-color-[#858585]">{subscribeData.data.remark}</span>
              </div>
            </div>
            <div className="flex flex-col text-xs pb-2 pt-4">
              <p className="text-color-[#464646] font-600">订单详情：</p>
              <span className="text-xs text-color-[#B7B7B7] mb-6 pt-2">
                订单号#{subscribeData.data.order_no}{' '}
                {moment(subscribeData?.data?.start_time * 1000).format('YYYY年MM月DD日')}{' '}
                {getWeek(subscribeData?.data?.start_time * 1000)}&nbsp;
                {moment(subscribeData?.data?.start_time * 1000).format('HH:mm')}
              </span>
            </div>
          </div>
        </div>
        <div className="w-262px flex flex-col justify-between items-center border border-solid border-r-0 border-t-0 border-b-0 border-color-[#e7eaea]">
          <div>
            {subscribeData.data.client_name && (
              <div className={`${styles.BorderedViewItem} flex justify-center mt-15`} onClick={onProfileClick}>
                <div className="flex flex-col justify-center items-center">
                  <div className={`${styles.Avatar} flex items-center cursor-pointer justify-center`}>
                    {subscribeData.data.client_head ? (
                      <img src={subscribeData.data.client_head} />
                    ) : (
                      <div>{subscribeData.data.client_name[0].toUpperCase()}</div>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    {/* <span className="text-base font-600">{subscribeData.data.client_name}</span> */}
                    <div className="flex w-200px items-center text-sm pt-2">
                      <span className="font-600">邮箱：</span>
                      <span>{subscribeData?.data?.client_email}</span>
                    </div>
                    <div className="flex w-200px items-center text-sm py-2">
                      <span className="font-600">手机：</span>
                      <span>
                        {subscribeData?.data?.client_area} {subscribeData?.data?.client_phone}
                      </span>
                    </div>
                    <div className="flex w-200px text-sm">
                      <span className="font-600 w-42px">备注：</span>
                      <span className="flex-1">{subscribeData?.data?.client_remark || '--'}</span>
                    </div>
                    {/* <span className="text-base font-600">{subscribeData.data.client_name}</span> */}
                    {/* <span className="text-xs text-color-[#999]">{subscribeData.data.client_email}</span> */}
                    {!isEmpty(subscribeData?.data?.evaluate) && subscribeData?.data?.source !== 1 && (
                      <div className="flex flex-col pt-10">
                        <div className="flex flex-col">
                          <p className="font-600 pb-3">客户评价</p>
                          <div className="flex items-center">
                            <Rate
                              style={{ '--star-size': '14px' }}
                              readOnly
                              value={subscribeData?.data?.evaluate?.client?.score}
                            />
                            {!isEmpty(subscribeData?.data?.evaluate?.client) ? (
                              <p className="text-xs pl-2 text-color-[#000]">
                                综合评分：{subscribeData?.data?.evaluate?.client?.score}
                              </p>
                            ) : (
                              <p className="text-xs pl-2 text-color-[#000]">暂未评分</p>
                            )}
                          </div>
                          {!isEmpty(subscribeData?.data?.evaluate?.client) && (
                            <div className="flex flex-col py-4">
                              <p className="text-sm text-color-[#000] pb-1">评分标准</p>
                              <div className="flex items-center">
                                <p className="text-xs w-50px">外貌</p>
                                <Rate
                                  style={{ '--star-size': '10px' }}
                                  readOnly
                                  value={subscribeData?.data?.evaluate?.client?.appearance}
                                />
                              </div>
                              <div className="flex items-center">
                                <p className="text-xs w-50px py-1">服务</p>
                                <Rate
                                  style={{ '--star-size': '10px' }}
                                  readOnly
                                  value={subscribeData?.data?.evaluate?.client?.server}
                                />
                              </div>
                              <div className="flex items-center">
                                <p className="text-xs w-50px">性价比</p>
                                <Rate
                                  style={{ '--star-size': '10px' }}
                                  readOnly
                                  value={subscribeData?.data?.evaluate?.client?.cost}
                                />
                              </div>
                            </div>
                          )}
                          {!isEmpty(subscribeData?.data?.evaluate?.client) && (
                            <div className="flex flex-col">
                              <p className="text-sm text-color-[#000] pb-1">评论</p>
                              <p className="text-xs text-color-[#000]">
                                {subscribeData?.data?.evaluate?.client?.evaluate}
                              </p>
                            </div>
                          )}
                        </div>
                        {/* 员工评价 */}
                        <div className="flex flex-col">
                          <p className="font-600 pt-5 pb-3">员工评分</p>
                          <div className="flex items-center">
                            <Rate
                              style={{ '--star-size': '14px' }}
                              readOnly
                              value={subscribeData?.data?.evaluate?.staff?.score}
                            />
                            {!isEmpty(subscribeData?.data?.evaluate?.staff) ? (
                              <p className="text-xs pl-2 text-color-[#000]">
                                综合评分：{subscribeData?.data?.evaluate?.staff?.score}
                              </p>
                            ) : (
                              <p className="text-xs pl-2 text-color-[#000]">暂未评分</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center w-full h-100px border border-solid border-r-0 border-l-0 border-b-0 border-color-[#e7eaea]">
            <p className="text-sm font-600">
              总价：${subscribeData.data.total_amount}({subscribeData.data.duration / 60}hr)
            </p>
            {renderFooter()}
          </div>
        </div>
      </div>

      {/* popup */}
      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          formInstance.validateFields().then((values) => {
            onFinish(values)
          })
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical" form={formInstance}>
          {editType === 'earnest' ? (
            <>
              <Form.Item name={`earnest`} label="价格" rules={[{ required: true, message: '此项是必填项' }]}>
                <Input
                  addonBefore="$"
                  className={`${styles.PcearnestInput}`}
                  style={{ width: 180 }}
                  placeholder="请输入"
                />
              </Form.Item>
              <Form.Item
                className={`ml-1`}
                name={`information_id`}
                label="支付方式"
                rules={[{ required: true, message: '此项是必填项' }]}
              >
                <Select style={{ width: 180 }} options={methodList} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="address" label="地址" rules={[{ required: true, message: '此项是必填项' }]}>
                <InitAutocomplete />
              </Form.Item>
              <Form.Item name="house_num" label="门牌号" rules={[{ required: true }]}>
                <div className={`${styles.controls}`}>
                  <TextArea placeholder="门牌号" rows={1} />
                </div>
              </Form.Item>
              <Form.Item name="bell" label="按铃方式" rules={[{ required: true }]}>
                <div className={`${styles.controls}`}>
                  <TextArea placeholder="按铃方式" rows={1} />
                </div>
              </Form.Item>
              <Form.Item name="remark" label="备注" rules={[{ required: true }]}>
                <div className={`${styles.controls}`}>
                  <TextArea placeholder="请输入备注" rows={3} />
                </div>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      {/* <CenterPopup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
      >
        <div className="p-6">
          <Form
            style={{ '--border-bottom': 'none', '--border-top': 'none', '--border-inner': 'none' }}
            requiredMarkStyle="none"
            onFinish={onFinish}
            form={formInstance}
            footer={null}
          >
            <div className={`${stylesPay.FormItemWrapper} flex items-center`}>
              {editType === 'earnest' ? (
                <div className="flex mr-2">
                  <div className={`flex items-center mr-1`}>
                    <Form.Item name={`earnest`} label="价格" rules={[{ required: true }]}>
                      <Input
                        className={`py-2 ${styles.earnestInput}`}
                        style={{
                          border: '1px solid #ced6d5',
                          borderRadius: 20,
                          paddingLeft: 12,
                        }}
                        placeholder="请输入"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    className={`ml-1`}
                    name={`information_id`}
                    label="支付方式"
                    trigger="onConfirm"
                    rules={[{ required: true }]}
                    onClick={onPickerClick}
                    arrow={null}
                  >
                    <Picker className="" columns={[methodList]}>
                      {(items) => (
                        <PickerContent
                          style={{
                            minHeight: 36,
                            border: '1px solid #ced6d5',
                            borderRadius: 20,
                            minWidth: 130,
                            padding: '0 10px',
                          }}
                          val={items}
                          textType="normal"
                          innerHeight="18px"
                        />
                      )}
                    </Picker>
                  </Form.Item>
                </div>
              ) : editType === 'address' ? (
                <div className="relative w-full">
                  <Form.Item name="address" label="地址" rules={[{ required: true }]}>
                    <InitAutocomplete />
                  </Form.Item>
                </div>
              ) : null}
            </div>
            <div className="flex justify-center items-center pt-4">
              <Button
                onClick={() => {
                  setVisible(false)
                }}
                className="w-[35%] h-[2.75rem] rounded-3xl mr-1"
                block
              >
                取消
              </Button>
              <Button className="w-[35%] h-[2.75rem] rounded-3xl ml-1" block type="submit" color="primary">
                确定
              </Button>
            </div>
          </Form>
        </div>
      </CenterPopup> */}
    </div>
  )
}

export default CalendarView
