import React from 'react'
import { DatePicker, Input, Dropdown, Popover, Button } from 'antd'
import { Selector, InfiniteScroll } from 'antd-mobile'
import { ArrowDownOutlined, CaretDownOutlined } from '@ant-design/icons'
import SvgIcon from '@/components/SvgIcon'
import { OPTIONS_ORDERS, OPTIONS_TYPES } from '../order/constant'
import { useRequest, useUpdateEffect } from 'ahooks'
import DataBaseApi from '@/http/api/data'
import PcRangeSlider from './PcRangeSlider'
import moment from 'moment'
import dayjs from 'dayjs'
import DownApi from '@/http/api/down'
import { ORDER_COLUMS } from '../list/constant'

const { RangePicker } = DatePicker
const { Search } = Input

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
  const { orderType, setOrderType } = props
  const navigate = useNavigate()

  const [sale_type, setsaleType] = useState('0')
  const [duration_time, setDurationTime] = useState('0')
  const [channel_type, setChannelType] = useState('0')
  const [open, setOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [count, setCount] = useState(1)
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

  const handleMenuClick = (e: any) => {
    if (e.key) {
      setOrderType(e.key)
    }
  }

  const menuProps = {
    items: ORDER_COLUMS[0],
    onClick: handleMenuClick,
  }

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

  const optionsTypes = OPTIONS_TYPES
  const optionsOrders = OPTIONS_ORDERS

  const confirmFilter = () => {
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

  const onSearch = (val: string) => {
    setResultData([])
    setCount(1)
    setHasMore(true)
    setParams({
      ...params,
      search: val,
    })
  }

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
  }, [orderType, time])

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
      <div className="flex flex-col pt-5 overflow-x-auto">
        <div style={{ display: '-webkit-box' }} className="pl-2 items-center text-xs font-600">
          <p className="w-[20%]">订单号#</p>
          <p className="w-[10%] text-center">日期</p>
          <p className="w-[10%] text-center">时间</p>
          <p className="w-[10%] text-center">时长</p>
          <p className="w-[10%] text-center">员工</p>
          <p className="w-[10%] text-center">类型</p>
          <p className="w-[10%] text-center">价格</p>
          <p className="w-[10%] text-center">场景</p>
          <p className="w-[10%] text-right pr-4">状态</p>
        </div>
        {<>{resultData.map((item, index) => renderItem(item, index))}</>}
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>
    )
  }

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
        className="flex text-xs mt-2 cursor-pointer transition-all hover:(shadow-sm)"
        key={index}
      >
        <p className="w-[20%] rounded-l-lg border-r-0 px-2 py-4 border-width-[0.5px] border-color-[#e9e9e9] border-solid">
          {order_no}
        </p>
        <p className="order-table py-4 w-[10%] text-center">{date}</p>
        <p className="order-table py-4 w-[10%] text-center">{time}</p>
        <p className="order-table py-4 w-[10%] text-center">{duration}</p>
        <p className="order-table py-4 w-[10%] text-center">{staff_name}</p>
        <p className="order-table py-4 w-[10%] text-center">{sale_type}</p>
        <p className="order-table py-4 w-[10%] text-center">${price}</p>
        <p className="order-table py-4 w-[10%] text-center">{source}</p>
        <p className="w-[10%] text-right py-4 rounded-r-lg border-l-0 px-2 py-2 border-width-[0.5px] border-color-[#e9e9e9] border-solid">
          {status}
        </p>
      </div>
    )
  }

  const Content = () => {
    return (
      <div className="flex flex-col pt-4">
        <div className="px-4 pb-8">
          <p className="flex pb-4 text-sm text-color-[#000]">类型</p>
          <Selector
            onChange={(val) => setsaleType(val[0])}
            style={SelectorStyle}
            showCheckMark={false}
            options={optionsTypes}
            value={[sale_type]}
          />
        </div>
        {!!res?.data?.duration.length && (
          <div className="px-4 pb-8">
            <p className="flex pb-4 text-sm text-color-[#000]">时长</p>
            <Selector
              onChange={(val) => setDurationTime(val[0])}
              style={SelectorStyle}
              showCheckMark={false}
              options={optionsTimes}
              value={[duration_time]}
            />
          </div>
        )}
        <div className="px-4 pb-8">
          <p className="flex pb-4  text-sm text-color-[#000]">线上/线下</p>
          <Selector
            onChange={(val) => setChannelType(val[0])}
            style={SelectorStyle}
            showCheckMark={false}
            options={optionsOrders}
            value={[channel_type]}
          />
        </div>
        <div className="px-4 pb-2">
          <p className="flex pb-1  text-sm text-color-[#000]">
            价格（${params?.price_min}-${params?.price_max}）
          </p>
          <div>
            <PcRangeSlider
              setParams={setParams}
              price_min={params?.price_min}
              min={res?.data?.price_min}
              max={res?.data?.price_max}
              price_max={params?.price_max}
            />
          </div>
        </div>
        <div className="flex py-5 justify-center items-center w-full">
          <div
            onClick={reset}
            className="text-sm cursor-pointer flex opacity-50 rounded-l-2xl items-center justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
          >
            重置
          </div>
          <div
            onClick={confirmFilter}
            className="text-sm flex cursor-pointer items-center rounded-r-2xl justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
          >
            完成
          </div>
        </div>
      </div>
    )
  }

  const changeRangeTime = (val: any, timeString: any) => {
    setTime([timeString[0], timeString[1]])
  }

  return (
    <div className="flex flex-col">
      <div className="bg-[#f4f6f6] rounded-md py-4 px-8 flex justify-between relative">
        <div>
          <RangePicker
            value={[dayjs(time[0]), dayjs(time[1])]}
            placeholder={['开始时间', '结束时间']}
            onChange={changeRangeTime}
            clearIcon={false}
            className="!bg-[#fff] rounded-3xl"
          />
        </div>
        <div className="flex items-center">
          <Search placeholder="员工或订单号搜索" onSearch={onSearch} enterButton />
          <Dropdown menu={menuProps}>
            <div className="border text-color-[#2A4948] min-w-80px flex justify-center mx-3 cursor-pointer border-solid border-color-[#eee] bg-[#fff] rounded-3xl  py-1">
              排序
              <CaretDownOutlined />
            </div>
          </Dropdown>
          <Popover
            open={open}
            placement="topRight"
            onOpenChange={() => setOpen(() => !open)}
            content={<Content />}
            trigger="click"
          >
            <div className="border text-color-[#2A4948] min-w-80px flex items-center justify-center cursor-pointer border-solid border-color-[#eee] bg-[#fff] rounded-3xl  py-1">
              筛选
              <SvgIcon name="filter-order" className="w-[11px] h-[13px] ml-1" />
            </div>
          </Popover>
        </div>
        <Button
          className="absolute right-3 -top-12"
          onClick={orderDown}
          style={{ display: 'flex', alignItems: 'center' }}
          type="primary"
          icon={<ArrowDownOutlined />}
        >
          导出
        </Button>
      </div>
      {orderList()}
    </div>
  )
}

export default Order
