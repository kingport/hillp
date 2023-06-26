import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Dialog } from 'antd-mobile'
import UserApi from '@/http/api/user'
import { store } from '@/redux'

const navs = [
  {
    id: 1,
    title: '修改密码',
    path: '/personal/setting/info',
    key: 'changpwd',
  },
  {
    id: 2,
    title: '注销账号',
    path: '/personal/setting/notice',
    key: 'cancellation',
  },
  {
    id: 3,
    title: '退出登录',
    path: '/personal/setting/storage',
    key: 'logout',
  },
]

const Security = () => {
  const navigator = useNavigate()

  const accountOptions = (item: any) => {
    // 注销账号
    if (item?.key === 'cancellation') {
      Dialog.show({
        content: <div className="font-600 text-center pb-2 text-xl">确认注销此账号</div>,
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
              onClick: () => {
                navigator('/personal/security/cancellation')
              },
            },
          ],
        ],
      })
    }
    // 修改密码
    if (item?.key === 'changpwd') {
      navigator('/user/change/old/pwd')
    }
    // 退出登录
    if (item?.key === 'logout') {
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
  }
  const NavList = () => {
    return (
      <div className="flex w-full flex-col sm:(w-340px shadow-sm py-4 rounded-xl)">
        <p className="px-10 font-600 text-2xl <sm:(hidden)">账号安全</p>
        {navs.map((item: any) => {
          return (
            <div
              onClick={() => accountOptions(item)}
              key={item.id}
              style={{ borderBottom: '1px solid #eee' }}
              className="flex px-10 cursor-pointer py-10 items-center justify-between active:bg-[#f9f9fa]"
            >
              <div className="flex flex-col">
                <p className="text-sm">{item?.title}</p>
              </div>
              <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-[48px] sm:(w-full items-center justify-center pt-0)">
      <HeaderNav renderRight={false} title="账号安全" border />
      <NavList />
    </div>
  )
}

export default Security
