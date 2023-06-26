import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'

const Auth = () => {
  const navigate = useNavigate()
  const userInfo = store.getState().global.userInfo
  // 个人账号有推广签约
  const navs =
    userInfo?.user_type === 1
      ? [
          {
            id: 1,
            title: '线上推广',
            desc: '购买线上推广套餐',
            path: '/personal/auth/online',
          },
          {
            id: 2,
            title: '关联账号',
            desc: '查看可关联账号余额',
            path: '/personal/auth/association',
          },
          {
            id: 3,
            title: '推广签约',
            desc: '发送推广信息，签约更多渠道',
            path: '/personal/auth/sign',
          },
        ]
      : [
          {
            id: 1,
            title: '线上推广',
            desc: '购买线上推广套餐',
            path: '/personal/auth/online',
          },
          {
            id: 2,
            title: '关联账号',
            desc: '查看可关联账号余额',
            path: '/personal/auth/association',
          },
        ]
  const NavList = () => {
    return (
      <div className="flex w-full flex-col sm:(shadow-sm py-4 rounded-xl)">
        {navs.map((item: any) => {
          return (
            <div
              onClick={() => navigate(item.path)}
              key={item.id}
              style={{ borderBottom: '1px solid #eee' }}
              className="flex px-10 py-10 items-center justify-between active:bg-[#f9f9fa] sm:(py-4) cursor-pointer"
            >
              <div className="flex flex-col">
                <p className="text-sm">{item?.title}</p>
                <p className="text-xs text-color-[#646464]">{item?.desc}</p>
              </div>
              <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-[48px] sm:(w-full w-340px items-center justify-center pt-0)">
      <HeaderNav renderRight={false} title="账号权限" border onBack={() => navigate('/personal')} />
      <p className="w-full pb-5 font-600 text-2xl text-left <sm:(hidden)">账号权限</p>
      <NavList />
    </div>
  )
}

export default Auth
