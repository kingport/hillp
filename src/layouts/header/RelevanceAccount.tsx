import React, { Fragment } from 'react'

import Empty from '@/components/Empty'
import InfiniteList from '@/components/InfiniteList'

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
  const [count, setCount] = useState(1)
  const navigtae = useNavigate()

  const requestLoadMore = async () => {
    const res = await MessengerApi.getMessageList({ page: count, type: 2 })
    setCount((count) => count + 1)
    return res.data.data
  }

  // 消息操作
  const messageoperation = async (params: any) => {
    return await MessengerApi.messageoperation(params)
  }

  const { runAsync } = useRequest(messageoperation, {
    manual: true,
    onSuccess(res) {
      //
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
      <div key={index} className="py-4 px-1.5rem bg-[#fff] mb-4 shadow-sm rounded-xl">
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

  const renderEmpty = () => {
    return (
      <div className={`${styles.content} flex justify-center pt-20 items-center`}>
        <Empty
          img="relevance-account-empty-page"
          text={
            <>
              <p>关联其他Hiilp账户后</p>
              <p>相关通知会出现在这里 前往邀请</p>
              <p
                onClick={() => navigtae('/manage/employee/intive')}
                className="text-xs text-color-[#777] underline cursor-pointer pt-4"
              >
                前往邀请
              </p>
            </>
          }
        />
      </div>
    )
  }

  return (
    <div className={`${styles.relevanceAccount} p-4`}>
      <div className={`${styles.contentList}`}>
        <InfiniteList requestLoadMore={requestLoadMore} renderItem={renderItem} renderEmpty={renderEmpty} />
      </div>
    </div>
  )
}

export default RelevanceAccount
