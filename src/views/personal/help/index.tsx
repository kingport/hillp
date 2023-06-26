import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'

const navs = [
  {
    id: 1,
    title: '联系客服',
    url: 'https://www.hiilp.com/contact-us',
  },
  {
    id: 2,
    title: '常见问题',
    url: '/news',
  },
  {
    id: 3,
    title: '合作/投资',
    url: 'https://www.hiilp.com/business-ad',
  },
  {
    id: 4,
    title: '意见/投诉',
    url: 'https://www.hiilp.com/support',
  },
]

const Help = () => {
  const NavList = () => {
    return (
      <div className="flex w-full flex-col sm:(w-340px shadow-sm py-4 rounded-xl)">
        <p className="px-10 font-600 text-2xl <sm:(hidden)">帮助</p>
        {navs.map((item: any) => {
          return (
            <div
              onClick={() => (window.location.href = item?.url)}
              key={item.id}
              style={{ borderBottom: '1px solid #eee' }}
              className="flex px-10 py-10 items-center cursor-pointer justify-between active:bg-[#f9f9fa]"
            >
              <div className="flex flex-col">
                <p className="text-xs">{item?.title}</p>
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
      <HeaderNav renderRight={false} title="帮助" border />
      <NavList />
    </div>
  )
}

export default Help
