import React, { Fragment } from 'react'

import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'

import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import MessengerApi from '@/http/api/messenger'
import { UpdateMessageContext } from '@/utils/message'
import { Skeleton } from 'antd'

interface List {
  id?: string | number
  title?: string
  subTitle?: string
  message?: string | number
  path: string
}

const RelevanceAccount = () => {
  const [typeList, setTypeList] = useState<Array<List>>([])
  const navigate = useNavigate()

  const update = React.useContext(UpdateMessageContext)

  const { loading } = useRequest(() => MessengerApi.getNewMessage({}), {
    onSuccess(res) {
      update(res?.data)
      setTypeList([
        {
          id: 1,
          title: '线上预约提醒',
          subTitle: '查看并回复预约情况',
          message: res?.data?.sub_count,
          path: '/messenger/online/booking',
        },
        {
          id: 2,
          title: '关联账号提醒',
          subTitle: '商家/个人提醒',
          message: res?.data?.ref_count,
          path: '/messenger/relevance/account',
        },
        {
          id: 3,
          title: '官方通知',
          subTitle: '了解官方活动及查看提现申请',
          message: res?.data?.pub_count,
          path: '/messenger/official/notice',
        },
      ])
    },
  })

  const messageListPage = (path: string) => {
    navigate(path)
  }

  const NavlList = () => {
    return (
      <div className="flex flex-col">
        {typeList.map((item, index) => {
          const { title, id, subTitle, message, path } = item
          return (
            <Fragment key={id}>
              <div className="flex items-center justify-between py-9 px-11" onClick={() => messageListPage(path)}>
                <div className="flex-col">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-color-[#2A4948]">{title}</p>
                    {!!message && (
                      <div className="bg-[#2A4948] h-4 px-2 ml-2 rounded-[6px]">
                        <div className="h-[100%] flex justify-center items-center text-xs scale-90 text-[#fff]">
                          {message}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-color-[#646464]">{subTitle}</p>
                </div>
                <SvgIcon name="verify-right" className="w-1.5 h-[10px]" />
              </div>
              {index !== typeList?.length - 1 && <div className="border-b"></div>}
            </Fragment>
          )
        })}
      </div>
    )
  }

  const PublishButton = () => {
    return (
      <div className="hidden shadow-sm flex justify-between items-center rounded-md py-2 px-4 fixed right-5 bottom-30">
        <SvgIcon name="message-publish" className="w-[18px] h-[18px]" />
        <div className="text-xs pl-1 font-600">发布</div>
      </div>
    )
  }

  if (loading) return <Skeleton />

  return (
    <div className={`${styles.messenger} pt-[48px]`}>
      <HeaderNav title="消息" border renderLeft={false} renderRight={false} />
      <NavlList />
      <PublishButton />
    </div>
  )
}

export default RelevanceAccount
