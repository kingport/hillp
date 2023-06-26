import React from 'react'
import moment from 'moment'
import { Card, Picker, Image } from 'antd-mobile'
import { useRequest } from 'ahooks'
import InfiniteList from '@/components/InfiniteList'
import ChartLineComponent from '@/views/database/ChartLineComponent'
import CalendarApi from '@/http/api/calendar'
import DataBaseApi from '@/http/api/data'
import styles from './index.module.scss'
import { getWeek } from '@/utils/util'
import SvgIcon from '@/components/SvgIcon'
import { Dropdown, MenuProps, Skeleton } from 'antd'
import Empty from '@/assets/empty.png'
import EmptyPending from '@/assets/emptyPending.png'

function CalendarKanban() {
  const navigate = useNavigate()
  const [incomingCount, setIncomingCount] = useState(1)
  const [ongoingCount, setOngoingCount] = useState(1)
  const [selectType, setSelectType] = useState<any>(1)
  const { runAsync: getOrderAsyncIncoming, loading: incomingLoading } = useRequest(CalendarApi.orderSubscribe, {
    manual: true,
  })
  const { runAsync: getOrderAsyncOngoing, loading: ongoingLoading } = useRequest(CalendarApi.orderSubscribe, {
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

  const toDetail = (item: any) => {
    navigate('/calendar/view', {
      state: {
        id: item?.id,
      },
    })
  }

  const renderOrderListItem = (item: any, key: any) => {
    return (
      <div key={key} className={`${styles.cardContentItem} cursor-pointer flex items-center justify-between`} onClick={() => toDetail(item)}>
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

  const renderEmpty = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image src={Empty} className="w-60px h-60px" />
        <span className="text-color-[#B1BCBD] text-xs">暂无任何数据</span>
      </div>
    )
  }

  const renderEmptyPending = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image src={EmptyPending} className="w-60px h-60px" />
        <span className="text-color-[#B1BCBD] text-xs">暂无任何数据</span>
      </div>
    )
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '全部',
    },
    {
      key: '2',
      label: '每日预约总量',
    },
    {
      key: '3',
      label: '每日收入金额',
    },
  ]

  if (turnoverLoading) return <Skeleton />

  return (
    <div className={`pt-[4rem] bg-[#fff] w-[calc(100vw-60px)]`}>
      <div className={`${styles.cardList} pb-4 px-6`}>
        <Card
          title={
            <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <span>历史订单汇总</span>
                <Dropdown
                  menu={{
                    items,
                    onClick: (e) => {
                      if (e.key) {
                        setSelectType(Number(e.key))
                      }
                    },
                  }}
                >
                  <SvgIcon name="point" className="w-16px h-16px cursor-pointer" />
                </Dropdown>
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
            keyrender="pc"
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
        <div className="sm:(flex justify-between) pt-5">
          <Card title={'即将进行'} className="sm:(w-[48%] mb-0) mb-5">
            <span className="block text-base font-400 text-color-[#2A494880]">近7日内</span>
            <InfiniteList
              requestLoadMore={() => requestLoadMore('incoming')}
              renderItem={renderOrderListItem}
              renderEmpty={renderEmpty}
            />
          </Card>
          <Card title={'正在进行'} className="sm:w-[48%]">
            <span className="block text-base font-400 text-color-[#2A494880]">近7日内</span>
            <InfiniteList
              requestLoadMore={() => requestLoadMore('ongoing')}
              renderItem={renderOrderListItem}
              renderEmpty={renderEmptyPending}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalendarKanban
