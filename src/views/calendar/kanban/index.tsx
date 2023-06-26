import React from 'react'
import moment from 'moment'
import { Card, Picker } from 'antd-mobile'
import { useRequest } from 'ahooks'
import HeaderNav from '@/components/HeaderNav'
import InfiniteList from '@/components/InfiniteList'
import ChartLineComponent from '@/views/database/ChartLineComponent'
import CalendarApi from '@/http/api/calendar'
import DataBaseApi from '@/http/api/data'
import styles from './index.module.scss'
import { getWeek } from '@/utils/util'
import SvgIcon from '@/components/SvgIcon'
import Pcindex from './Pcindex'

function CalendarKanban() {
  const [incomingCount, setIncomingCount] = useState(1)
  const [ongoingCount, setOngoingCount] = useState(1)
  const [selectType, setSelectType] = useState<any>(1)
  const { runAsync: getOrderAsyncIncoming } = useRequest(CalendarApi.orderSubscribe, {
    manual: true,
  })
  const { runAsync: getOrderAsyncOngoing } = useRequest(CalendarApi.orderSubscribe, {
    manual: true,
  })
  const { data: turnoverRes, loading: turnoverLoading } = useRequest(DataBaseApi.getTurnover, {
    defaultParams: [{ begin_time: -1 }],
  })

  const requestLoadMore = async (type: 'incoming' | 'ongoing') => {
    let res
    if (type === 'incoming') {
      res = await getOrderAsyncIncoming({
        type: 1,
        page: incomingCount,
      })
    }
    if (type === 'ongoing') {
      res = await getOrderAsyncOngoing({
        type: 2,
        page: ongoingCount,
      })
    }
    type === 'incoming'
      ? setIncomingCount((incomingCount) => incomingCount + 1)
      : setOngoingCount((ongoingCount) => ongoingCount + 1)
    return res.data.data
  }

  const renderOrderListItem = (item: any, key: any) => {
    return (
      <div key={key} className={`${styles.cardContentItem} flex items-center justify-between`}>
        <div className="font-600 w-12">
          <p>{moment(item.start_time * 1000).format('MM月')}</p>
          <p>{moment(item.start_time * 1000).format('DD日')}</p>
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex flex-col mr-4">
            <div className="text-[12px] mb-1">
              <span className={`${styles.cardContentTags} text-color-[#848484]`}>
                {item.server_type === 1 ? '堂食' : '外卖'}
              </span>
              {item.status === 0 && <span className="text-color-[#D2693F] ml-4">新预约</span>}
              {item.status === 2 && <span className="text-color-[#D2693F] ml-4">已取消</span>}
              {item.status === 7 && <span className="text-color-[#D2693F] ml-4">已取消</span>}
            </div>
            <span className="text-xs mb-1">
              {getWeek(item.start_time * 1000)}
              {moment(item.start_time * 1000).format('HH:mm')}
            </span>
            <span className="text-[12px] leading-16px text-color-[#848484]">
              {item.client_name} 与 {item.staff_name || item?.nickname}
              {item.duration}分钟的预约
            </span>
          </div>
          <span className="font-600 text-right w-60px">${item.amount}</span>
        </div>
      </div>
    )
  }

  const SALETYPE_COLUMS: any = [
    [
      {
        id: 1,
        label: '全部',
        value: 1,
      },
      {
        id: 2,
        label: '每日预约总量',
        value: 2,
      },
      {
        id: 3,
        label: '每日收入金额',
        value: 3,
      },
    ],
  ]

  if (turnoverLoading) return <></>

  return (
    <>
      <div className={`${styles.calendarKanban} pt-[4rem] bg-[#fff] sm:(hidden)`}>
        <HeaderNav title={'订单看板'} renderLeft={false} />
        <div className={`${styles.cardList} pb-4 px-6`}>
          <div className="sm:(flex justify-between)">
            <Card title={'即将进行'} className="sm:(w-[48%] mb-0) mb-5">
              <InfiniteList requestLoadMore={() => requestLoadMore('incoming')} renderItem={renderOrderListItem} />
            </Card>
            <Card title={'正在进行'} className="sm:w-[48%]">
              <InfiniteList requestLoadMore={() => requestLoadMore('ongoing')} renderItem={renderOrderListItem} />
            </Card>
          </div>
          <Card
            title={
              <div className="w-full">
                <div className="flex justify-between items-center w-full">
                  <span>历史订单汇总</span>
                  <SvgIcon
                    onClick={async () => {
                      const value = await Picker.prompt({
                        columns: SALETYPE_COLUMS,
                        defaultValue: [selectType],
                      })
                      if (value) setSelectType(value[0])
                    }}
                    name="point"
                    className="w-16px h-16px cursor-pointer"
                  />
                </div>
                <span className="block text-base font-400 text-color-[#2A494880]">近7日内</span>
              </div>
            }
          >
            <div className="text-xs mb-1 text-color-[#2A494880]">
              <span>总预约数：</span>
              <span className="text-color-[#2A4948] mr-4">{turnoverRes?.data?.turnover?.order_num}</span>
              <span>总收入金额：</span>
              <span className="text-color-[#2A4948]">${turnoverRes?.data?.turnover?.amount_total}</span>
            </div>
            <ChartLineComponent
              key="h5"
              width={'100%'}
              className="sm:(!h-400px)"
              height={200}
              data={turnoverRes?.data?.turnover}
              selecttype={selectType}
            />
            <div className="flex items-center text-xs text-color-[#5C6370]">
              {selectType === 1 && (
                <>
                  <div className="w-[5px] h-[5px] rounded-full bg-[#D2693F] mr-1" />
                  <span className="mr-4">每日预约总量</span>
                  <div className="w-[5px] h-[5px] rounded-full bg-[#2A4948] mr-1" />
                  <span>每日收入金额</span>
                </>
              )}
              {selectType === 2 && (
                <>
                  <div className="w-[5px] h-[5px] rounded-full bg-[#D2693F] mr-1" />
                  <span className="mr-4">每日预约总量</span>
                </>
              )}
              {selectType === 3 && (
                <>
                  <div className="w-[5px] h-[5px] rounded-full bg-[#2A4948] mr-1" />
                  <span>每日收入金额</span>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
      {/* pc */}
      <div className="<sm:(hidden)">
        <Pcindex />
      </div>
    </>
  )
}

export default CalendarKanban
