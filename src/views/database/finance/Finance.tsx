import React from 'react'
import Search from '../Search'
import styles from '../index.module.scss'
import { Button, Calendar, InfiniteScroll, Popup, Radio, SearchBar, Selector } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import DataBaseApi from '@/http/api/data'
import { useRequest, useUpdateEffect } from 'ahooks'
import DownApi from '@/http/api/down'
import moment from 'moment'
const SelectorStyle = {
  '--border-radius': '20px',
  '--border': 'solid transparent 1px',
  '--checked-border': 'solid var(--adm-color-primary) 1px',
  '--padding': '4px 12px',
  fontSize: '12px',
  '--color': 'rgba(42, 73, 72, 0.08)',
  '--checked-color': '#2A4948',
  '--checked-text-color': '#fff',
}
const Finance = (props: any) => {
  const { tabKey, orderType } = props
  const [visible, setVisible] = useState(false)
  const [resultData, setResultData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [time, setTime] = useState<any[]>([
    moment().add('-6', 'd').format('YYYY/MM/DD'),
    moment().startOf('day').format('YYYY/MM/DD'),
  ])
  const [countFinance, setCountFinance] = useState(1)
  const [search, setSearch] = useState('')
  const [payType, setPayType] = useState<any>('0')
  const [options, setOptions] = useState<any>([])

  // 订单列表
  const getFinanceList = async (count: number) => {
    return await DataBaseApi.getFinanceList({
      page: count,
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
      order_type: orderType,
      search,
      pay_type: payType,
    })
  }

  const requestLoadMore = async () => {
    const append = await getFinanceList(countFinance)
    setCountFinance((countFinance) => countFinance + 1)
    setResultData((val) => [...val, ...append.data.data])
    setHasMore(append.data.data.length > 0)
  }

  useRequest(() => DataBaseApi.getFinancePayType({}), {
    onSuccess(res) {
      setOptions([{ value: '0', label: '全部' }, ...res.data])
    },
  })

  useUpdateEffect(() => {
    setResultData([])
    setCountFinance(1)
    setHasMore(true)
  }, [orderType, search])

  const renderItem = (item: any, index: number) => {
    const { income_amount, date, income_type, order_no, order_type } = item
    return (
      <div
        key={index}
        className="flex justify-between text-xs border border-width-[0.5px] border-color-[#e9e9e9] border-solid mt-2 px-2 py-2 rounded-lg"
      >
        <p className="w-[20%] break-words">{order_no}</p>
        <p className="flex w-[20%] justify-center">{date}</p>
        <p className="flex w-[20%] justify-center">{order_type}</p>
        <p className="flex w-[20%] justify-center">{income_type}</p>
        <p className="flex w-[20%] justify-end">${income_amount}</p>
      </div>
    )
  }

  // 导出
  const orderDown = async () => {
    const params: any = {
      type: 8,
      file_type: 'xlsx',
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    }

    if (orderType) params.order_type = orderType
    if (search) params.search = search
    if (payType) params.pay_type = payType
    await DownApi.uploadFile(params)
  }

  return (
    <div className={`flex flex-col w-[90%] mt-4 ${styles.order}  ${tabKey !== 'finance' && 'hidden'}`}>
      <div className="flex items-center w-full">
        <div className={`${styles.searchinput} pr-4 w-full justify-between`}>
          <SearchBar
            onSearch={(val) => {
              setSearch(val)
            }}
            onClear={() => {
              setSearch('')
            }}
            placeholder={'付款方式和订单号搜索'}
          />
          <div className="flex items-center">
            <SvgIcon name="filter-order" className="w-[11px] h-[13px]" />
            <p onClick={() => setVisible(true)} className="text-xs pl-1">
              筛选
            </p>
          </div>
        </div>
      </div>

      <div
        onClick={() => setCalendarVisible(true)}
        className="flex rounded-lg px-3 py-1.5 items-center w-full justify-between my-4 bg-[#f4f6f6] border border-width-[0.5px] border-solid border-color-[#e1e5e5]"
      >
        <SvgIcon name="verify-right" className="w-[6px] h-[12px] transform rotate-z-180" />
        <p className="text-xs">{`${time[0]}-${time[1]}`}</p>
        <SvgIcon name="verify-right" className="w-[6px] h-[12px]" />
      </div>

      {/*  */}
      <div className="flex flex-col pt-5">
        <div className="flex items-center justify-between text-xs font-600">
          <p className="flex w-[20%]">订单号#</p>
          <p className="flex w-[20%] justify-center">收款日期</p>
          <p className="flex w-[20%] justify-center">收款类型</p>
          <p className="flex w-[20%] justify-center">收款方式</p>
          <p className="flex w-[20%] justify-end">收款金额</p>
        </div>
        {<>{resultData.map((item, index) => renderItem(item, index))}</>}
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>
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
          <div className="px-7 pb-10">
            <p className="flex  pb-4 pt-10 text-sm text-color-[#000]">收款方式</p>
            <Selector
              onChange={(val) => {
                if (val.length === 0) return false
                setPayType(val[0])
              }}
              style={SelectorStyle}
              showCheckMark={false}
              options={options}
              value={[payType]}
            />
          </div>
          <div className="flex py-5 justify-center items-center shadow-sm w-full">
            <div
              onClick={() => {
                setPayType('0')
              }}
              className="text-sm flex opacity-50 rounded-l-2xl items-center justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
            >
              重置
            </div>
            <div
              onClick={() => {
                setResultData([])
                setCountFinance(1)
                setHasMore(true)
                setVisible(false)
              }}
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
            setCountFinance(1)
            setResultData([])
            setHasMore(true)
            setTime([moment(val[0]).format('YYYY/MM/DD'), moment(val[1]).format('YYYY/MM/DD')])
          }}
        />
      </Popup>
    </div>
  )
}

export default Finance
