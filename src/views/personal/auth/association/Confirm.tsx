import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'
import { Button, Image } from 'antd-mobile'
import React from 'react'
import LineIconLeft from '@/assets/line-left.png'

const Confirm = () => {
  const navigator = useNavigate()
  const location: any = useLocation()
  const payInfo = store.getState().global.payInfo

  let setmeal_level_tip = ''
  if (payInfo.stripeInfo?.setmeal_level * 1 === 1) {
    setmeal_level_tip = '季度'
  }
  if (payInfo?.stripeInfo.setmeal_level * 1 === 2) {
    setmeal_level_tip = '年'
  }
  if (payInfo?.stripeInfo.setmeal_level * 1 === 3) {
    setmeal_level_tip = '月'
  }

  return (
    <div className="flex flex-col pt-[48px] justify-center items-center sm:(pt-0 w-400px)">
      <HeaderNav title="确认套餐" renderRight={false} />
      <div className="flex flex-col w-[80%] pt-20 items-center">
        <div className="flex justify-center items-center w-[70px] h-[70px] rounded-full bg-[#f4f6f6]">
          <SvgIcon name="car" className="w-[38px] h-[28px]" />
        </div>
        <p className="text-sm pt-4">确认购买此套餐</p>
        <div className="flex w-full py-8 px-4 items-center justify-between rounded-lg mt-4 bg-[#f8f8f8]">
          <p className="text-xs text-color-[#000]">{payInfo.stripeInfo?.name}</p>
          <div className="flex items-center">
            <p className="text-lg font-600">${payInfo.stripeInfo?.amount}</p>
            <p className="text-xs pl-2">/{setmeal_level_tip}</p>
          </div>
        </div>
        <div
          onClick={() => {
            navigator('/agreement')
          }}
          className="w-full rounded-lg py-1 bg-gradient-to-r from-[#3a5050]  to-[#768586]  flex items-center justify-between mt-4"
        >
          <Button className="flex text-color-[#fff] items-center justify-between" fill="none">
            确认并前往阅读使用条款
          </Button>
          <SvgIcon
            name="user-left"
            style={{ color: '#fff', transform: 'rotateZ(180deg)' }}
            className="w-[38px] h-[6px]"
          />
        </div>
      </div>
      <div
        onClick={() => navigator(-1)}
        className="flex items-center cursor-pointer items-center <sm:(hidden) font-600 fixed top-30 left-40"
      >
        <Image src={LineIconLeft} className="mr-4 w-30px" />
        返回
      </div>
    </div>
  )
}

export default Confirm
