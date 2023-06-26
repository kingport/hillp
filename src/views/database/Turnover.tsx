import React from 'react'
import { Skeleton } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import ChartLineComponent from './ChartLineComponent'
import { Picker } from 'antd-mobile'
import { useSize } from 'ahooks'

const Turnover = (props: any) => {
  const { turnoverRes, loading, keyrender } = props
  const navigate = useNavigate()
  const size = useSize(document.querySelector('body'))

  const [selecttype, setSelecttype] = useState<any>(1)

  const turnoverColumns: any = [
    [
      {
        value: 1,
        label: '全部',
      },
      {
        value: 3,
        label: '每日预约总量',
      },
      {
        value: 2,
        label: '每日收入金额',
      },
    ],
  ]

  return (
    <Skeleton loading={loading}>
      <div
        onClick={() => navigate('/database/kanban/turnover')}
        className="flex flex-col p-4 shadow-sm rounded-lg sm:(w-full)"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm">营业额</p>
            <p className="text-xs text-color-[#98a3a3]">近7日内</p>
          </div>
          <SvgIcon
            onClick={async (e: any) => {
              if (size?.width && size?.width > 640) return false
              e.stopPropagation()
              const value = await Picker.prompt({
                columns: turnoverColumns,
                defaultValue: [selecttype],
              })
              if (value) {
                setSelecttype(value[0])
              }
            }}
            name="point"
            className="w-[18px] h-[4px] cursor-pointer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-xs pt-2">
            <p className="text-color-[#5d636f]">总预约数：{turnoverRes?.data?.turnover?.order_num}</p>
            <p className="text-color-[#5d636f] pl-4">总收入金额：${turnoverRes?.data?.turnover?.amount_total}</p>
          </div>
          <ChartLineComponent
            keyrender={keyrender}
            width={'100%'}
            height={220}
            data={turnoverRes?.data?.turnover}
            selecttype={selecttype}
          />
          <div className="flex items-center text-xs pt-2">
            <div className="text-color-[#5d636f] flex items-center">
              <p className="bg-[#2A4948] w-[5px] h-[5px] rounded-full"></p>
              <p className="pl-2 text-xs">每日预约总量</p>
            </div>
            <div className="text-color-[#5d636f] flex items-center pl-5">
              <p className="bg-[#D2693F] w-[5px] h-[5px] rounded-full"></p>
              <p className="pl-2 text-xs">每日收入金额</p>
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  )
}

export default Turnover
