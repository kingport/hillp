import React from 'react'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'
import { headerMenuList } from '../menu/menu.config'
import styles from './index.module.scss'
import { Badge, Button, Divider, Drawer, Popover, Tooltip } from 'antd'
import { Dialog } from 'antd-mobile'
import UserApi from '@/http/api/user'
import RelevanceAccount from './RelevanceAccount'
import OnlineBooking from './OnlineBooking'
import { useRequest } from 'ahooks'
import MessengerApi from '@/http/api/messenger'
import OfficialNotice from './OfficialNotice'
import { MessageContext, UpdateMessageContext } from '@/utils/message'

const LayoutHeader = (props: any) => {
  const userInfo = store.getState().global.userInfo
  const userId = store.getState().global.userId
  const navigator = useNavigate()

  const [open, setOpen] = useState(false)
  const [openOfficial, setOpenOfficial] = useState(false)
  const [selectKey, setSelectKey] = useState('relevance')
  const [typeList, setTypeList] = useState<any>([])
  const messageNumber: any = React.useContext(MessageContext)
  const [node, setNode] = useState<any>(<></>)
  const update = React.useContext(UpdateMessageContext)

  // 消息未读
  const { run } = useRequest(() => MessengerApi.getNewMessage({}), {
    manual: true,
    onSuccess(res) {
      update(res.data)
      setTypeList([
        {
          id: 2,
          title: '关联账号提醒',
          message: res?.data?.ref_count,
          key: 'relevance',
          name: 'pc-relevance',
        },
        {
          id: 1,
          title: '线上预约提醒',
          message: res?.data?.sub_count,
          key: 'online',
          name: 'pc-online',
        },
      ])
    },
  })

  useEffect(() => {
    if (userId) {
      run()
    }
  }, [userId])

  // 退出登录
  const logout = () => {
    Dialog.show({
      content: <div className="font-600 text-center pb-2 text-xl">确认退出登录</div>,
      closeOnAction: true,
      maskStyle: {
        minWidth: '50%',
      },
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
              const user_id = store.getState().global.userId
              const res = await UserApi.logout({ user_id })
              if (res?.status === 200) {
                navigator('/user')
              }
            },
          },
        ],
      ],
    })
  }

  const content = (
    <div className="flex flex-col justify-center items-center min-w-190px">
      <HiilpAvatar
        sx={{ width: '42px', height: '42px' }}
        name={userInfo?.nickname || 'H'}
        headurl={userInfo?.head}
        className="!text-font-14px"
      />
      <p className="text-color-[#2A4948] font-600 text-base pt-2">{userInfo?.nickname}</p>
      <p className="text-xs opacity-70 text-color-[#2A4948]">UID {userInfo?.user_id}</p>
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col pr-2">
          <p className="text-color-[#2a4948] text-xs">评分</p>
          <p className="text-color-[#2a4948] text-base font-600">{userInfo?.synthesis_score || 0}</p>
        </div>
        <Divider type="vertical" style={{ background: '#2a4948' }} />
        <div className="flex flex-col px-2">
          <p className="text-color-[#2a4948] text-xs">订单数</p>
          <p className="text-color-[#2a4948] text-base font-600">{userInfo?.order_num || 0}</p>
        </div>
        <Divider type="vertical" style={{ background: '#2a4948' }} />
        <div className="flex flex-col pl-2">
          <p className="text-color-[#2a4948] text-xs">粉丝</p>
          <p className="text-color-[#2a4948] text-base font-600">{userInfo?.fans_num || 0}</p>
        </div>
      </div>
      <Button onClick={() => navigator('/personal/information')} type="text">
        个人资料
      </Button>
      <Divider style={{ margin: '5px 0' }} />
      <Button onClick={logout} type="text">
        退出登录
      </Button>
    </div>
  )

  return (
    <div
      className={`flex w-full px-5 items-center justify-between h-[60px] border border-w-0.5px border-solid border-color-[#F3F3F3] ${styles.header}`}
    >
      <div className="flex cursor-pointer">
        <SvgIcon name="logo" className="w-97px h-22px" />
      </div>
      <div className="flex items-center">
        {headerMenuList(messageNumber)?.map((item: any) => (
          <Tooltip placement="bottom" zIndex={99} key={item?.id} title={item?.name} color={'#8fa2a2'}>
            <div
              className={`${styles.headerMenu} cursor-pointer mr-3 w-41px h-41px flex justify-center items-center rounded-full hover:(bg-[#f2f8f8]) relative`}
              onClick={() => {
                // 消息
                if (item?.id === 3) {
                  setOpen(true)
                }
                // 官方通知
                if (item?.id === 2) {
                  setOpenOfficial(true)
                }
                navigator(item?.path)
              }}
            >
              {item?.icon}
            </div>
          </Tooltip>
        ))}
        {/* {node} */}
        <div className=" cursor-pointer">
          <Popover placement="bottomRight" content={content}>
            <HiilpAvatar
              sx={{ width: '30px', height: '30px' }}
              name={userInfo?.nickname || 'H'}
              headurl={userInfo?.head}
              className="!text-font-14px"
            />
          </Popover>
        </div>
      </div>
      {/* 抽屉弹窗 */}
      <Drawer
        title=""
        closable={false}
        placement="right"
        onClose={() => {
          //
        }}
        width={500}
        open={open}
      >
        <div className="flex h-full">
          <div className="w-108px p-4 flex flex-col items-center">
            <SvgIcon onClick={() => setOpen(false)} className="w-[20px] h-[20px] cursor-pointer" name="nav-cancel" />
            <Divider style={{ background: '#D0D0D0' }} />
            {typeList?.map((i: any) => (
              <div
                onClick={() => {
                  setSelectKey(i.key)
                }}
                key={i.id}
                className="flex flex-col items-center mt-6"
              >
                <Badge dot={i?.message} color="#2A4948">
                  <div
                    className={`flex cursor-pointer justify-center items-center w-50px h-50px ${
                      selectKey === i.key ? 'bg-[#2A4948]' : 'bg-[#f0f0f2]'
                    }  rounded-full border border-solid border-color-[#fff] transition all hover:(border-color-[#8ea3a2])`}
                  >
                    <SvgIcon
                      name={i?.name}
                      style={{ color: selectKey === i.key ? '#fff' : '#91a5a5' }}
                      className="w-22px h-22px"
                    />
                  </div>
                </Badge>
                <p className="text-xs font-600 pt-2  text-color-[#597b78]">{i?.title}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-[#fcfcfc]">
            {selectKey === 'relevance' && <RelevanceAccount />}
            {selectKey === 'online' && <OnlineBooking />}
          </div>
        </div>
      </Drawer>
      {/* 官方通知 */}
      <Drawer
        title=""
        placement="right"
        onClose={() => {
          setOpenOfficial(false)
        }}
        open={openOfficial}
      >
        <div className="flex h-full px-4">
          <OfficialNotice />
        </div>
      </Drawer>
    </div>
  )
}

export default LayoutHeader
