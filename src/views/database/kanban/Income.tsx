import React from 'react'
import styles from '../index.module.scss'
import { Button, Calendar, Picker, Popup } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import DataBaseApi from '@/http/api/data'
import { useMount, useUpdateEffect } from 'ahooks'
import moment from 'moment'
import DownApi from '@/http/api/down'
import HeaderNav from '@/components/HeaderNav'
import PcIncome from './PcIncome'

const Income = (props: any) => {
  const ref = useRef<HTMLDivElement>(null)
  const [calendarVisible, setCalendarVisible] = useState(false)

  const [resultData, setResultData] = useState<string[]>([])
  const [columns, setColumns] = useState<any>([])
  const [selectType, setSelectType] = useState<any>('0')
  const [time, setTime] = useState<any[]>([
    moment().add('-6', 'd').format('YYYY/MM/DD'),
    moment().startOf('day').format('YYYY/MM/DD'),
  ])

  // 营业额
  const getOrderList = async () => {
    return await DataBaseApi.getIncomeDetail({
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    })
  }

  const requestLoadMore = async () => {
    const append = await getOrderList()
    setColumns(
      append?.data?.detail?.map((x: any, index: any) => ({
        value: `${index}`,
        label: index === 0 ? '全部' : x.income,
      }))
    )
    setResultData(
      append?.data?.detail?.map((i: any, index: any) => ({
        id: `${index}`,
        ...i,
      }))
    )
  }

  useMount(() => {
    requestLoadMore()
  })

  useUpdateEffect(() => {
    requestLoadMore()
  }, [time])

  const renderItem = (item: any, index: number) => {
    const { income, amount, deposit, parent, total } = item
    return (
      <div style={{ display: '-webkit-box' }} className="flex text-xs mt-2" key={index}>
        <p className="w-[20%] rounded-l-lg border-r-0 px-2 py-2 border-width-[0.5px] border-color-[#e9e9e9] border-solid">
          {income}
        </p>
        <p className="order-table w-[20%]">{deposit}</p>
        <p className="order-table w-[20%]">{amount}</p>
        <p className="order-table w-[20%]">{parent}%</p>
        <p className="order-table w-[20%] text-right">{total}</p>
      </div>
    )
  }

  // 导出
  const orderDown = async () => {
    await DownApi.uploadFile({
      type: 2,
      file_type: 'xlsx',
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    })
  }

  const orderList = () => {
    return (
      <div ref={ref} className="flex flex-col pt-5 overflow-x-auto">
        <div style={{ display: '-webkit-box' }} className="pl-2 items-center text-xs font-600">
          <p className="w-[20%]">收款方式</p>
          <p className="w-[20%]">定金</p>
          <p className="w-[20%]">收款</p>
          <p className="w-[20%]">百分比</p>
          <p className="w-[20%] text-right">总收款</p>
        </div>
        <>
          {selectType !== '0'
            ? resultData?.filter((i: any) => i?.id === selectType)?.map((item, index) => renderItem(item, index))
            : resultData?.map((item, index) => renderItem(item, index))}
        </>
      </div>
    )
  }

  const NavRightList = () => {
    return (
      <div onClick={selectFilter} className="flex items-center ">
        <SvgIcon name="filter" className="w-[15px] h-[15px] mr-1" />
      </div>
    )
  }

  const selectFilter = async () => {
    const value = await Picker.prompt({
      columns: [columns],
      defaultValue: [selectType],
    })
    if (value) {
      setSelectType(value[0])
    }
  }

  return (
    <>
      <div className="flex flex-col items-center pt-[48px] pb-[90px] w-full sm:(hidden)">
        <HeaderNav renderRight={<NavRightList />} title="收款方式" />
        <div className={`flex flex-col w-[90%] mt-4 ${styles.order}`}>
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
          <Popup visible={calendarVisible} onMaskClick={() => setCalendarVisible(false)} bodyStyle={{ height: 'auto' }}>
            <Calendar
              value={time as [Date, Date]}
              className={styles.calendarCustom}
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
                setTime([moment(val[0]).format('YYYY/MM/DD'), moment(val[1]).format('YYYY/MM/DD')])
              }}
            />
          </Popup>
        </div>
      </div>
      <div className="<sm:(hidden)">
        <PcIncome />
      </div>
    </>
  )
}

export default Income
