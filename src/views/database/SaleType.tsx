import React from 'react'
import { Skeleton } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { Picker, ProgressBar } from 'antd-mobile'
import { useSize } from 'ahooks'

const SaleType = (props: any) => {
  const { saleTypeLoading, saleTypeRes = [], ProgressTextStyle } = props
  const navigate = useNavigate()
  const size = useSize(document.querySelector('body'))

  const [selecttype, setSelecttype] = useState<any>(0)
  const [incomeList, setIncomeList] = useState<any>([])

  let columns = []
  columns = saleTypeRes?.map((x: any) => ({
    value: x.id,
    label: x.name,
  }))
  columns.unshift({
    value: 0,
    label: '全部',
  })
  useEffect(() => {
    if (saleTypeRes.length) {
      setIncomeList(saleTypeRes)
    }
  }, [saleTypeRes])

  const saleTypeColumns: any = [columns]

  return (
    <Skeleton loading={saleTypeLoading}>
      <div
        onClick={() => navigate('/database/kanban/saletype')}
        className="flex flex-col p-4 shadow-sm rounded-lg mt-4 sm:(mt-0 h-220px overflow-auto)"
      >
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-col">
            <p className="text-sm">类型</p>
            <p className="text-xs text-color-[#98a3a3]">近7日内</p>
          </div>
          <SvgIcon
            onClick={async (e: any) => {
              if (size?.width && size?.width > 640) return false
              e.stopPropagation()
              const value: any = await Picker.prompt({
                columns: saleTypeColumns,
                defaultValue: [selecttype],
              })
              if (value) {
                if (value[0] === 0) {
                  setIncomeList(saleTypeRes)
                } else {
                  setIncomeList(saleTypeRes.filter((d: any) => d.id === value[0]))
                }
                setSelecttype(value[0])
              }
            }}
            name="point"
            className="w-[18px] h-[4px] cursor-pointer"
          />
        </div>
        {incomeList?.map((mode: any, index: string) => {
          return (
            <div key={index} className="flex items-center pt-1 w-full">
              <div className="flex flex-col mr-2">
                <p className="text-xs w-10 font-600">{mode?.name}</p>
                <p className="text-xs text-color-[#ADADAD]">${mode?.price}</p>
              </div>
              <ProgressBar
                percent={mode?.parent}
                text={<div style={ProgressTextStyle(mode?.parent)}>{`${mode?.parent}%`}</div>}
                style={{
                  flex: 1,
                  position: 'relative',
                  '--fill-color': '#6b7c7d',
                  '--track-width': '20px',
                  '--track-color': '#f6f8f8',
                }}
              />
            </div>
          )
        })}
      </div>
    </Skeleton>
  )
}

export default SaleType
