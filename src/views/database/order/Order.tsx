import React from 'react'
import styles from '../index.module.scss'
import { Button, Calendar, InfiniteScroll, Popup, SearchBar, Selector } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import RangeSlider from '../RangeSlider'
import DataBaseApi from '@/http/api/data'
import { useRequest, useUpdateEffect } from 'ahooks'
import { OPTIONS_ORDERS, OPTIONS_TYPES } from './constant'
import moment from 'moment'
import DownApi from '@/http/api/down'

const SelectorStyle = {
  '--border-radius': '20px',
  '--border': 'solid transparent 1px',
  '--checked-border': 'solid var(--adm-color-primary) 1px',
  '--padding': '4px 12px',
  '--color': 'rgba(42, 73, 72, 0.08)',
  '--checked-color': '#2A4948',
  '--checked-text-color': '#fff',
  fontSize: '12px',
}

const Order = (props: any) => {
  const { orderType, tabKey } = props
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)

  const [sale_type, setsaleType] = useState('0')
  const [duration_time, setDurationTime] = useState('0')
  const [channel_type, setChannelType] = useState('0')
  const [count, setCount] = useState(1)

  const [hasMore, setHasMore] = useState(true)
  const [resultData, setResultData] = useState<string[]>([])
  const [time, setTime] = useState<any[]>([
    moment().add('-6', 'd').format('YYYY/MM/DD'),
    moment().startOf('day').format('YYYY/MM/DD'),
  ])
  const [params, setParams] = useState({
    price_min: '',
    price_max: '',
    search: '',
  })
  const [optionsTimes, setOptionsTimes] = useState<any>([])

  // 订单列表
  const getOrderList = async (count: number) => {
    const begin_time = moment(time[0]).unix()
    let end_time: any = moment(time[1]).unix()

    // 同一天的时候结束时间为23:59:59的时间戳
    if (moment(time[0]).unix() === moment(time[1]).unix()) {
      end_time = moment(time[1]).endOf('day').format('X')
    }

    return await DataBaseApi.getOrderList({
      ...params,
      begin_time,
      end_time,
      duration_time,
      channel_type,
      sale_type,
      order_type: orderType,
      page: count,
    })
  }
  const requestLoadMore = async () => {
    const append = await getOrderList(count)
    setCount((count) => count + 1)
    setResultData((val) => [...val, ...append.data.data])
    setHasMore(append.data.data.length > 0)
  }

  useUpdateEffect(() => {
    setResultData([])
    setCount(1)
    setHasMore(true)
  }, [orderType])

  const { data: res } = useRequest(() => DataBaseApi.getOrderFilter({ begin_time: '-1' }), {
    onSuccess(respon) {
      setParams({
        ...params,
        price_min: respon?.data?.price_min,
        price_max: respon?.data?.price_max,
      })
      respon.data.duration.map((i: any) => {
        if (i.value === 600) {
          i.label = '包夜'
        }
      })
      setOptionsTimes([{ value: '0', label: '全部' }, ...respon.data.duration])
    },
  })

  const renderItem = (item: any, index: number) => {
    const { order_no, date, time, status, sale_type, price, staff_name, source, duration } = item
    return (
      <div
        onClick={() => {
          navigate('/database/order/detail', {
            state: {
              id: item.id,
            },
          })
        }}
        style={{ display: '-webkit-box' }}
        className="flex text-xs mt-2"
        key={index}
      >
        <p className="w-45 rounded-l-lg border-r-0 px-2 py-2 border-width-[0.5px] border-color-[#e9e9e9] border-solid">
          {order_no}
        </p>
        <p className="order-table">{date}</p>
        <p className="order-table">{time}</p>
        <p className="order-table">{duration}</p>
        <p className="order-table">{staff_name}</p>
        <p className="order-table">{sale_type}</p>
        <p className="order-table">${price}</p>
        <p className="order-table">{source}</p>
        <p className="w-25 rounded-r-lg border-l-0 px-2 py-2 border-width-[0.5px] border-color-[#e9e9e9] border-solid">
          {status}
        </p>
      </div>
    )
  }

  const optionsTypes = OPTIONS_TYPES
  const optionsOrders = OPTIONS_ORDERS

  const confirmFilter = () => {
    setVisible(false)
    setCount(1)
    setResultData([])
    setHasMore(true)
  }

  const reset = () => {
    setsaleType('0')
    setDurationTime('0')
    setChannelType('0')
    setHasMore(true)
    setParams({
      price_min: res?.data?.price_min,
      price_max: res?.data?.price_max,
      search: '',
    })
  }

  // 导出
  const orderDown = async () => {
    const data: any = {
      type: 6,
      file_type: 'xlsx',
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    }
    if (duration_time) data.duration_time = duration_time
    if (channel_type) data.channel_type = channel_type
    if (sale_type) data.sale_type = sale_type
    if (orderType) data.order_type = orderType
    if (params.price_max) data.price_max = params.price_max
    if (params.price_min) data.price_min = params.price_min
    if (params.search) data.search = params.search
    await DownApi.uploadFile(data)
  }

  const orderList = () => {
    return (
      <div ref={ref} className="flex flex-col pt-5 overflow-x-auto">
        <div style={{ display: '-webkit-box' }} className="pl-2 items-center text-xs font-600">
          <p className="w-45">订单号#</p>
          <p className="w-25">日期</p>
          <p className="w-25">时间</p>
          <p className="w-25">时长</p>
          <p className="w-25">员工</p>
          <p className="w-25">类型</p>
          <p className="w-25">价格</p>
          <p className="w-25">场景</p>
          <p className="w-25">状态</p>
        </div>
        {<>{resultData.map((item, index) => renderItem(item, index))}</>}
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>
    )
  }

  return (
    <div className={`flex flex-col w-[90%] mt-4 ${styles.order} ${tabKey !== 'order' && 'hidden'}`}>
      <div className="flex items-center w-full">
        <div className={`${styles.searchinput} pr-4 w-full justify-between`}>
          <SearchBar
            onSearch={(val) => {
              setResultData([])
              setCount(1)
              setHasMore(true)
              setParams({
                ...params,
                search: val,
              })
            }}
            onClear={() => {
              setResultData([])
              setCount(1)
              setHasMore(true)
              setParams({
                ...params,
                search: '',
              })
            }}
            placeholder={'员工或订单号搜索'}
          />
          <div className="flex items-center">
            <SvgIcon name="filter-order" className="w-[11px] h-[13px]" />
            <p onClick={() => setVisible(true)} className="text-xs pl-1">
              筛选
            </p>
          </div>
        </div>
      </div>
      {/*  */}
      <div
        onClick={() => setCalendarVisible(true)}
        className="flex rounded-lg px-3 py-1.5 items-center w-full justify-between my-4 bg-[#f4f6f6] border border-width-[0.5px] border-solid border-color-[#e1e5e5]"
      >
        <SvgIcon name="verify-right" className="w-[6px] h-[12px] transform rotate-z-180" />
        <p className="text-xs">{`${time[0]}-${time[1]}`}</p>
        <SvgIcon name="verify-right" className="w-[6px] h-[12px]" />
      </div>
      {orderList()}
      <div className="fixed-b-btn flex">
        <div
          onClick={orderDown}
          className="flex w-[70%] rounded-3xl py-1 px-8 bg-[#2A4948] justify-center items-center text-color-[#fff]"
        >
          <Button className="text-color-[#fff]" fill="none">
            导出
          </Button>
          <SvgIcon name="user-left" style={{ transform: 'rotateZ(90deg' }} className="w-[10px] h-[10px]" />
        </div>
      </div>
      {/*  */}
      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyStyle={{ height: 'auto', borderRadius: '20px 20px 0 0' }}
      >
        <div className="flex flex-col pt-5">
          <div className="flex flex-col items-center">
            <div className="w-full bg-[#D9D9D9] w-[50px] h-[7px] rounded-2xl"></div>
          </div>
          <div className="px-9 pb-8">
            <p className="flex  pb-4 pt-10 text-sm text-color-[#000]">类型</p>
            <Selector
              onChange={(val) => {
                if (val.length === 0) return false
                setsaleType(val[0])
              }}
              style={SelectorStyle}
              showCheckMark={false}
              options={optionsTypes}
              value={[sale_type]}
            />
          </div>
          <div className="px-9 pb-8">
            <p className="flex pb-4 pt-5 text-sm text-color-[#000]">时长</p>
            <Selector
              onChange={(val) => {
                if (val.length === 0) return false
                setDurationTime(val[0])
              }}
              style={SelectorStyle}
              showCheckMark={false}
              options={optionsTimes}
              value={[duration_time]}
            />
          </div>
          <div className="px-9 pb-8">
            <p className="flex pb-4 pt-5 text-sm text-color-[#000]">线上/线下</p>
            <Selector
              onChange={(val) => {
                if (val.length === 0) return false
                setChannelType(val[0])
              }}
              style={SelectorStyle}
              showCheckMark={false}
              options={optionsOrders}
              value={[channel_type]}
            />
          </div>
          <div className="px-9 pb-2">
            <p className="flex pb-1 pt-5 text-sm text-color-[#000]">
              价格（${params?.price_min}-${params?.price_max}）
            </p>
            <div>
              <RangeSlider setParams={setParams} price_min={res?.data?.price_min} price_max={res?.data?.price_max} />
            </div>
          </div>
          <div className="flex py-5 justify-center items-center shadow-sm w-full">
            <div
              onClick={reset}
              className="text-sm flex opacity-50 rounded-l-2xl items-center justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
            >
              重置
            </div>
            <div
              onClick={confirmFilter}
              className="text-sm flex items-center rounded-r-2xl justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
            >
              完成
            </div>
          </div>
        </div>
      </Popup>
      <Popup visible={calendarVisible} onMaskClick={() => setCalendarVisible(false)} bodyStyle={{ height: 'auto' }}>
        <Calendar
          className={styles.calendarCustom}
          value={time as [Date, Date]}
          selectionMode="range"
          nextYearButton={<></>}
          prevYearButton={<></>}
          nextMonthButton={
            <div className="flex justify-center items-center rounded-lg py-1 px-3 border border-solid border-color-[#ccc]">
              <SvgIcon name="verify-right" className="w-[8px] h-[12px] !transform !rotate-0" />
            </div>
          }
          prevMonthButton={
            <div className="flex justify-center items-center rounded-lg py-1 px-3 border border-solid border-color-[#ccc]">
              <SvgIcon name="verify-right" className="w-[8px] h-[12px] transform rotate-z-180" />
            </div>
          }
          weekStartsOn="Monday"
          onChange={(val: any) => {
            setCount(1)
            setResultData([])
            setHasMore(true)
            setTime([moment(val[0]).format('YYYY/MM/DD'), moment(val[1]).format('YYYY/MM/DD')])
          }}
        />
      </Popup>
    </div>
  )
}

export default Order
