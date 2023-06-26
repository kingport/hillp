import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'

const ChangeMode = () => {
  return (
    <div className="flex flex-col pt-[48px] items-center">
      <HeaderNav renderRight={false} />
      <div className="flex justify-center items-center w-full pt-20 flex-col">
        <div className="flex justify-center items-center w-[45px] h-[45px] rounded-full border border-solid border-color-[#2A4948]">
          <SvgIcon name="lock" className="w-[17px] h-[23px]" />
        </div>
        <p className="font-lg font-500 pt-2 pb-10">更换支付方式</p>
        <div className="flex justify-between w-[80%] rounded-xl px-4 py-5 items-center  border border-solid border-color-[#d5dbda]">
          <div className="flex items-center">
            <p className="text-xs text-color-[#000] pr-4">信用卡/借记卡</p>
            <SvgIcon name="visa" style={{ color: '#d5dbda' }} className="w-[34px] h-[24px] mr-2" />
            <SvgIcon name="visa-r" style={{ color: '#d5dbda' }} className="w-[34px] h-[24px]" />
          </div>
          <SvgIcon name="verify-right" className="w-[5px] h-[12px]" />
        </div>
        <div className="flex justify-between mt-4 w-[80%] rounded-xl px-4 py-5 items-center  border border-solid border-color-[#d5dbda]">
          <div className="flex items-center">
            <p className="text-xs text-color-[#000] pr-8">Paypal</p>
            <SvgIcon name="paypal" style={{ color: '#d5dbda' }} className="w-[34px] h-[24px]" />
          </div>
          <SvgIcon name="verify-right" className="w-[5px] h-[12px]" />
        </div>
        <div className="flex justify-between mt-4 w-[80%] rounded-xl px-4 py-5 items-center  border border-solid border-color-[#d5dbda]">
          <div className="flex items-center">
            <p className="text-xs text-color-[#000] pr-8">Apple Pay</p>
            <SvgIcon name="applepay" style={{ color: '#d5dbda' }} className="w-[34px] h-[24px]" />
          </div>
          <SvgIcon name="verify-right" className="w-[5px] h-[12px]" />
        </div>
      </div>
    </div>
  )
}
export default ChangeMode
