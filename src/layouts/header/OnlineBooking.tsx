import React from 'react'

import Empty from '@/components/Empty'

import styles from './index.module.scss'
import InfiniteList from '@/components/InfiniteList'
import MessengerApi from '@/http/api/messenger'
import moment from 'moment'
import CalendarApi from '@/http/api/calendar'
import { useMount, useRequest } from 'ahooks'
import { Toast } from 'antd-mobile'

const OnlineBooking = () => {
  const [count, setCount] = useState(1)
  const [data, setData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  const editOrder = (source: number, id: string, params?: any) => {
    return CalendarApi.editOrder({ source, id })
  }

  // 发送房间号
  const { runAsync: sendRunAsync } = useRequest(editOrder, {
    manual: true,
    onSuccess(res) {
      Toast.show(res?.msg)
    },
  })

  // 消息操作
  const messageoperation = async (params: any) => {
    return await MessengerApi.messageoperation(params)
  }
  const { runAsync } = useRequest(messageoperation, {
    manual: true,
  })
  // 跳转
  const check = async (e: any, item: any) => {
    e.stopPropagation()

    // 查看预约 前往评分
    if ([1, 2, 200, 4].includes(item?.source)) {
      // 已读
      const res = await runAsync({
        id: item.id,
        type: 1,
        operation: 1,
      })
      if (res?.status === 200) {
        navigate('/calendar/view', {
          state: {
            id: item?.extra_params?.id,
          },
        })
      }
    }
    // 员工到达 外卖 发送房间号 堂食
    if ([3, 301].includes(item?.source)) {
      // 外卖
      if (item?.extra_params?.server_type === 2) {
        const res = await sendRunAsync(5, item?.extra_params?.id)
        if (res?.status === 200) {
          const resmessage = await runAsync({
            id: item.id,
            type: 1,
            operation: 1,
          })
          if (resmessage.status === 200) {
            item.source = 303
            setCount(1)
            setData([])
            setHasMore(true)
            const res = await MessengerApi.getMessageList({ page: 1, type: 1 })
            setCount((count) => count + 1)
          }
        }
      }
      // 堂食
      if (item?.extra_params?.server_type === 1) {
        const res = await sendRunAsync(8, item?.extra_params?.id)
        if (res?.status === 200) {
          const resmessage = await runAsync({
            id: item.id,
            type: 1,
            operation: 1,
          })
          if (resmessage.status === 200) {
            item.source = 302
            setCount(1)
            setData([])
            setHasMore(true)
            const res = await MessengerApi.getMessageList({ page: 1, type: 1 })
            setCount((count) => count + 1)
          }
        }
      }
    }
  }

  // 渲染tag
  const renderTag = (item: any) => {
    const { source } = item
    if (source === 1) {
      return (
        <div className="text-xs rounded-[20px] py-0.5 px-2 ml-3 border border-color-[#D2693F] border-solid text-color-[#D2693F]">
          新预约
        </div>
      )
    }
    if ([2, 200].includes(source)) {
      return (
        <div className="text-xs rounded-[20px] py-0.5 px-2 ml-3 border border-color-[#2A4948] border-solid text-color-[#2A4948]">
          已完成
        </div>
      )
    }
    if ([3, 300, 301].includes(source)) {
      return (
        <div className="text-xs rounded-[20px] py-0.5 px-2 ml-3 border border-color-[#2A4948] border-solid text-color-[#2A4948]">
          已接单
        </div>
      )
    }
    if ([302, 303].includes(source)) {
      return (
        <div className="text-xs rounded-[20px] py-0.5 px-2 ml-3 border border-color-[#2A4948] border-solid text-color-[#2A4948]">
          进行中
        </div>
      )
    }
    if ([4].includes(source)) {
      return (
        <div className="text-xs rounded-[20px] py-0.5 px-2 ml-3 border border-color-[#2A4948] border-solid text-color-[#2A4948]">
          已取消
        </div>
      )
    }
    return <></>
  }

  // 渲染跳转链接
  const renderHref = (item: any) => {
    const { source } = item
    if ([1, 200, 4].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} cursor-pointer h-h24 text-[#2A4948] text-center underline`}
        >
          查看预约
        </div>
      )
    }
    if ([2].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} cursor-pointer h-h24 text-[#2A4948] text-center underline`}
        >
          前往评分
        </div>
      )
    }
    if ([3].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} cursor-pointer bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px]`}
        >
          员工到达
        </div>
      )
    }
    if ([303].includes(source)) {
      return (
        <div
          className={`${styles.scaleFont} cursor-pointer bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px] opacity-50`}
        >
          员工到达
        </div>
      )
    }
    if ([301].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} cursor-pointer bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px]`}
        >
          发送房间号
        </div>
      )
    }
    if ([300,302].includes(source)) {
      return (
        <div
          className={`${styles.scaleFont} cursor-pointer bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px] opacity-50`}
        >
          发送房间号
        </div>
      )
    }
    return <></>
  }

  // 点击阅读
  const readMessage = (item: any) => {
    const { source } = item
    if ([1, 200, 4, 2, 3, 303, 301, 300, 302].includes(source)) return false
    runAsync({
      id: item.id,
      type: 1,
      operation: 1,
    })
  }

  const requestLoadMore = async () => {
    const res = await MessengerApi.getMessageList({ page: count, type: 1 })
    setCount((count) => count + 1)
    return res.data.data
  }

  useMount(() => {
    runAsync({
      id: '',
      type: 1,
      operation: 1,
    })
  })

  const renderItem = (item: any, index: string) => {
    return (
      <div
        key={index}
        className={`flex justify-between items-center p-4 bg-[#fff] mb-4 shadow-sm rounded-xl ${item?.is_read === 1 ? 'opacity-50' : 'opacity-100'
          }`}
        onClick={() => readMessage(item)}
      >
        <div>
          <div className="text-[#2A4948] text-sm  font-600 my-2">
            <div className="flex">
              <div>{moment(item?.title * 1000).format('YYYY/MM/DD')}</div>
              <div className={`${styles.scaleFont}`}>{renderTag(item)}</div>
            </div>
            <p>{moment(item?.title * 1000).format('HH:mm')}</p>
          </div>
          <div className="text-gray-500 text-xs">
            <p style={{ whiteSpace: 'pre-wrap' }}>{item?.text}</p>
          </div>
        </div>
        {renderHref(item)}
      </div>
    )
  }

  const renderEmpty = () => {
    return (
      <div className={`${styles.content} flex justify-center items-center pt-20`}>
        <Empty
          img="online-booking-empty-page"
          text={
            <>
              <p>上线Marketplace后</p>
              <p>线上预约通知会出现在这里</p>
            </>
          }
        />
      </div>
    )
  }

  return (
    <div className={`${styles.onlineBooking} p-4`}>
      <div className={`${styles.contentList}`}>
        <InfiniteList renderItem={renderItem} requestLoadMore={requestLoadMore} renderEmpty={renderEmpty} />
      </div>
    </div>
  )
}

export default OnlineBooking
