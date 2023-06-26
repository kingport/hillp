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

interface ObjKey {
  [key: number | string]: any
}

enum STATUS {
  UPDATETIME = 1, //预约时间已更改
  CANCEL = 2, //已取消
  UPDATEADDRESS = 3, //工作地址已更改
}

enum MESSAGESTATUS {
  DONE = 1, //已查看
  UOTDONE = 0, //未查看
}

const TODOCOlORMAP: ObjKey = {
  [STATUS.UPDATETIME]: '#8EBDC1',
  [STATUS.CANCEL]: '#404040',
  [STATUS.UPDATEADDRESS]: '#8EBDC1',
}

const MGCOlORMAP: ObjKey = {
  [MESSAGESTATUS.DONE]: 'text-[#404040] text-opacity-40',
  [MESSAGESTATUS.UOTDONE]: null,
}

const RelevanceAccount = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [count, setCount] = useState(1)

  const more = () => {
    setVisible(true)
  }

  let len = null
  const requestLoadMore = async () => {
    const res = await MessengerApi.getMessageList({ page: count, type: 2 })
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
      type: 2,
      operation: 1,
    })
  })

  const renderItem = (item: any, index: number) => {
    const { id, title, todoStatus, messageStatus } = item
    return (
      <div
        key={index}
        className={`py-4 px-1.5rem bg-[#fff] mb-4 shadow-sm rounded-xl ${
          item?.is_read === 1 ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <div className="flex justify-between">
          <div className={`text-[${TODOCOlORMAP[todoStatus]}] text-xs font-600 my-2 ${MGCOlORMAP[messageStatus]}`}>
            <div className="">{title}</div>
            {item?.extra_params?.timestamp && (
              <p>{moment(item?.extra_params?.timestamp * 1000).format('YYYY/MM/DD HH:mm:ss')}</p>
            )}
          </div>

          {item.is_read === 2 && (
            <span
              className={`${styles.scaleFont} bg-[#D9D9D9] h24 bg-opacity-30 py-0.5 px-2 text-[#D2693F] text-xs rounded-[10px]`}
            >
              NEW
            </span>
          )}
        </div>

        <div className={`text-[#404040] text-xs  ${MGCOlORMAP[messageStatus]}`}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{item?.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.relevanceAccount} pt-[48px]`}>
      <HeaderNav
        title="关联账号提醒"
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
            img="relevance-account-empty-page"
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
        <InfiniteList requestLoadMore={requestLoadMore} renderItem={renderItem} />
      </div>
      <HiilpActionSheet
        actions={[
          {
            text: '将所有通知标记为已读',
            key: 'empty',
            onClick() {
              runAsync({
                id: '',
                type: 2,
                operation: 1,
              })
            },
          },
          {
            text: '全部删除',
            key: 'delete',
            danger: true,
            async onClick() {
              runAsync({
                id: '',
                type: 2,
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

export default RelevanceAccount
