import SvgIcon from '@/components/SvgIcon'
import { Picker } from 'antd-mobile'
import React from 'react'

const CollectionPayment = () => {
  const navigate = useNavigate()

  const payArr = ['现金', '电子转账', '信用/借记卡', 'EFTPOS']
  const columns: any = [
    [
      {
        label: '现金',
        value: 1,
      },
      {
        label: '电子转账',
        value: 2,
      },
      {
        label: '信用/借记卡',
        value: 3,
      },
      {
        label: '代金券',
        value: 4,
      },
      {
        label: '在线支付',
        value: 5,
      },
    ],
  ]
  return (
    <>
      <div className="flex flex-col">
        <p className="px-5 py-4  rounded-md bg-[#f4f6f6] text-xs font-500 text-color-[#000]">收款方式</p>
        {/* 暂无 */}
        <div className="text-xs text-color-[#5c5c5c] pt-5">暂无收款方式</div>
        {/* 收款方式 */}
        {payArr.map((i) => {
          return (
            <div className="text-xs pt-2 text-color-[#000]" key={i}>
              {i}
            </div>
          )
        })}
        <div
          onClick={async () => {
            //
            const value = await Picker.prompt({
              columns: columns,
            })
          }}
          className="flex items-center pt-2"
        >
          <SvgIcon name="add" className="w-[8px] h-[8px]" />
          <p className="text-xs font-500 pl-1">添加</p>
        </div>
      </div>
      <div className="flex flex-col mt-9 ">
        <p className="px-5 py-4  rounded-md bg-[#f4f6f6] text-xs font-500 text-color-[#000]">付款方式</p>
        {/* 暂无 */}
        <div className="text-xs text-color-[#5c5c5c] pt-5">暂无付款方式</div>
        <div className="flex items-center mt-5">
          <p className="text-xs text-color-[#5C5C5C]">Peter Lee</p>
          <SvgIcon name="visa-r" style={{ color: '#d3d9df' }} className="ml-10 mr-4 w-[34px] h-[24px]" />
          <div className="flex items-center text-xs">
            MasterCard <SvgIcon name="point" className="w-[16px] h-[6px] mx-2" /> 7282
          </div>
        </div>
        <div onClick={() => navigate('/pay/add/mode')} className="flex items-center pt-2">
          <SvgIcon name="add" className="w-[8px] h-[8px]" />
          <p className="text-xs font-500 pl-1">添加</p>
        </div>
      </div>
    </>
  )
}

export default CollectionPayment
