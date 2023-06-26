import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import Empty from '@/components/Empty'
import SvgIcon from '@/components/SvgIcon'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import styles from './index.module.scss'
import MessengerApi from '@/http/api/messenger'
import moment from 'moment'
import CalendarApi from '@/http/api/calendar'
import { useRequest } from 'ahooks'
import { InfiniteScroll, Toast, Dialog } from 'antd-mobile'

const OnlineBooking = () => {
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(1)
  const [data, setData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)

  const navigate = useNavigate()

  const editOrder = (source: number, id: string, params?: any) => {
    return CalendarApi.editOrder({ source, id })
  }

  let len = null
  const requestLoadMore = async (page: any) => {
    const res = await MessengerApi.getMessageList({ page: page || count, type: 1 })
    setCount((count) => count + 1)
    len = res.data.data.length
    setData([...data, ...res.data.data])
    setHasMore(res.data.data.length > 0)
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
    onSuccess(res) {
      setVisible(false)
    },
  })

  // 发送再次邀请下单
  const sendInvite = async (item: any) => {
    let res = await MessengerApi.invitation({ msg_id: item.id })
    if (res?.status === 200) {
      Toast.show('邀约成功')
      setData([])
      requestLoadMore(count - 1)
    } else {
      Toast.show(res?.msg)
    }
  }

  // 跳转
  const check = async (e: any, item: any) => {
    e.stopPropagation()

    // 查看预约 前往评分
    if ([1, 2, 200, 4, 302].includes(item?.source)) {
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
            setCount(1)
            setData([])
            setHasMore(true)
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
            setCount(1)
            setData([])
            setHasMore(true)
          }
        }
      }
    }
  }

  const more = () => setVisible(true)

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
    const { source, extra_params } = item
    if ([1, 200].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} h-h24 text-[#2A4948] text-center underline`}
        >
          查看预约
        </div>
      )
    }
    if ([2].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} h-h24 text-[#2A4948] text-center underline`}
        >
          前往评分
        </div>
      )
    }
    if ([3].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px]`}
        >
          员工到达
        </div>
      )
    }
    if ([303].includes(source)) {
      return (
        <div
          className={`${styles.scaleFont} bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px] opacity-50`}
        >
          员工到达
        </div>
      )
    }
    if ([301].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} bg-[#2A4948] py-2 px-2 w-30 h-h24 text-[#fff] text-xs text-center rounded-[20px]`}
        >
          发送房间号
        </div>
      )
    }
    if ([300].includes(source)) {
      return (
        <div
          className={`${styles.scaleFont} bg-[#2A4948] py-2 px-2 w-30 h-h24 text-[#fff] text-xs text-center rounded-[20px] opacity-50`}
        >
          发送房间号
        </div>
      )
    }

    // 进行中 去结算
    if ([302].includes(source)) {
      return (
        <div
          onClick={(e) => check(e, item)}
          className={`${styles.scaleFont} h-h24 text-[#2A4948] text-center underline`}
        >
          去结算
        </div>
      )
    }

    // 已取消 再次邀约
    if ([4].includes(source) && String(extra_params.is_invite) == '0') {
      return (
        <div
          className={`${styles.scaleFont} bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px]`}
          onClick={(e) => {
            e.stopPropagation()
            Dialog.show({
              content: (
                <div className="font-600 text-center pb-2 text-xl">
                  <p>确定邀请用户再次预约？</p>
                </div>
              ),
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
                    text: '确认',
                    className: 'dialog-confirm',
                    onClick: async () => {
                      await sendInvite(item)
                    },
                  },
                ],
              ],
            })
          }}
        >
          再次邀约
        </div>
      )
    }
    if ([4].includes(source) && String(extra_params.is_invite) == '1') {
      return (
        <div
          className={`${styles.scaleFont} bg-[#2A4948] py-2 px-2 w-20 h-h24 text-[#fff] text-xs text-center rounded-[20px] opacity-50`}
        >
          已邀约
        </div>
      )
    }
    return <></>
  }

  // 点击阅读
  const readMessage = async (item: any) => {
    const { source } = item

    if (![1, 200, 4, 2, 3, 303, 301, 300, 302].includes(source))
      await runAsync({
        id: item.id,
        type: 1,
        operation: 1,
      })

    navigate('/calendar/view', {
      state: {
        id: item?.extra_params?.id,
      },
    })
  }

  const renderItem = (item: any, index: string) => {
    return (
      <div
        key={index}
        className={`flex justify-between items-center p-4 bg-[#fff] mb-4 shadow-sm rounded-xl ${
          item?.is_read === 1 ? 'opacity-50' : 'opacity-100'
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

  return (
    <div className={`${styles.onlineBooking} pt-[48px]`}>
      <HeaderNav
        title="线上预约提醒"
        border
        renderRight={
          <SvgIcon
            onClick={() => more()}
            style={{ color: '##2A4948', width: '20px', height: '48px' }}
            name="icon-more"
          />
        }
      />

      {len === 0 && (
        <div className={`${styles.content} flex justify-center items-center`}>
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
      )}

      <div className={`${styles.contentList}`}>
        <>{data.map((item: any, index: any) => renderItem(item, index))}</>
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>

      <HiilpActionSheet
        actions={[
          {
            text: '将所有通知标记为已读',
            key: 'empty',
            onClick() {
              runAsync({
                id: '',
                type: 1,
                operation: 1,
              })
            },
          },
          {
            text: '全部删除',
            key: 'delete',
            danger: true,
            onClick() {
              runAsync({
                id: '',
                type: 1,
                operation: 2,
              })
            },
          },
        ]}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  )
}

export default OnlineBooking
