import React, { Fragment } from 'react'
import HeaderNav from '@/components/HeaderNav'
import Empty from '@/components/Empty'
import InfiniteList from '@/components/InfiniteList'
import SvgIcon from '@/components/SvgIcon'
import HiilpActionSheet from '@/components/HiilpActionSheet'

import styles from './index.module.scss'
import MessengerApi from '@/http/api/messenger'
import moment from 'moment'
import { useMount, useRequest } from 'ahooks'
import { store } from '@/redux'
import { setPayOrderInfo } from '@/redux/modules/global/action'

const OfficialNotice = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [count, setCount] = useState(1)

  const navigate = useNavigate()

  const check = (item: any) => {
    const { source, extra_params } = item
    // 活动
    if (source === 11) {
      window.location.href = extra_params?.url_cn
    }
    if (source === 30) {
      window.location.href = extra_params?.url
    }
  }

  const more = () => {
    setVisible(true)
  }

  let len = null
  const requestLoadMore = async () => {
    const res = await MessengerApi.getMessageList({ page: count, type: 3 })
    setCount((count) => count + 1)
    len = res.data.data.length
    return res.data.data
  }

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

  useMount(() => {
    runAsync({
      id: '',
      type: 3,
      operation: 1,
    })
  })

  const renderItem = (item: any, index: number) => {
    const { title, source, extra_params, text } = item
    return (
      <div
        key={index}
        onClick={() => check(item)}
        className={`${
          item?.is_read === 1 ? 'opacity-50' : 'opacity-100'
        } py-4 px-1.5rem bg-[#fff] mb-4 shadow-sm rounded-xl`}
      >
        <div className="flex justify-between">
          <div className="text-[#2A4948]  mb-4">
            <p className="text-sm font-600">{title}</p>
            {/* source 11 活动 */}
            {source === 11 && (
              <div className="flex text-xs">
                活动时间：{moment(extra_params?.start_time * 1000).format('YYYY/MM/DD')}-
                {moment(extra_params?.end_time * 1000).format('YYYY/MM/DD')}
              </div>
            )}
            {/* source 14 员工签约 12商家申请签约 */}
            {[14, 12].includes(source) && (
              <div
                onClick={() => {
                  if (source === 12) {
                    navigate('/messenger/official/notice/merchant/sigin', {
                      state: {
                        data: item?.extra_params,
                      },
                    })
                  }
                  if (source === 14) {
                    navigate('/manage/employee/info', {
                      state: {
                        id: item?.extra_params?.staff_id,
                      },
                    })
                  }
                }}
                className="flex text-xs underline"
              >
                查看详情
              </div>
            )}
            {/* source 13 渠道签约 */}
            {[13].includes(source) && (
              <div
                onClick={() => {
                  navigate('/manage/channel/info', {
                    state: {
                      id: item?.extra_params?.merchant_id,
                    },
                  })
                }}
                className="flex text-xs underline"
              >
                查看详情
              </div>
            )}
            {/* 15 订单完成 待支付 */}
            {[15].includes(source) && (
              <div
                onClick={() => {
                  store.dispatch(
                    setPayOrderInfo({
                      stripeInfo: { staff_id: item?.extra_params?.staff_id },
                      type: 4,
                    })
                  )
                  navigate('/pay')
                }}
                className="flex text-xs underline"
              >
                立即支付
              </div>
            )}
            {/* 已完成 */}
            {[22].includes(source) && <div className="flex text-xs">已支付完成</div>}
            {/* 员工申请更改成本 */}
            {[17, 16].includes(source) && (
              <div
                onClick={() => {
                  navigate('/messenger/official/change/cost', {
                    state: {
                      data: item?.extra_params,
                    },
                  })
                }}
                className="flex text-xs underline"
              >
                查看详情
              </div>
            )}
          </div>
        </div>
        <div className="text-[#999999] text-xs">{text}</div>
      </div>
    )
  }

  return (
    <div className={`${styles.officialNotice} pt-[48px]`}>
      <HeaderNav
        title="官方通知"
        border
        renderRight={
          <SvgIcon
            onClick={() => more()}
            style={{ color: '##2A4948', width: '20px', height: '48px' }}
            name="icon-more"
          />
        }
      />

      {len == 0 && (
        <div className={`${styles.content} flex justify-center items-center`}>
          <Empty
            img="official-notice-empty-page"
            text={
              <>
                <p>关联其他Hiilp账户后</p>
                <p>相关通知会出现在这里 前往邀请</p>
              </>
            }
          />
        </div>
      )}

      <div className={`${styles.contentList}`}>
        <InfiniteList renderItem={renderItem} requestLoadMore={requestLoadMore} />
      </div>

      <HiilpActionSheet
        actions={[
          {
            text: '将所有通知标记为已读',
            key: 'empty',
            onClick() {
              runAsync({
                id: '',
                type: 3,
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
                type: 3,
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

export default OfficialNotice
