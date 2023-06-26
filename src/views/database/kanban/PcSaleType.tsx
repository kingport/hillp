import React from 'react'
import styles from '../index.module.scss'
import DataBaseApi from '@/http/api/data'
import { useMount, useUpdateEffect } from 'ahooks'
import moment from 'moment'
import DownApi from '@/http/api/down'
import PcMenu from './Pcmenu'
import { Button, DatePicker, Dropdown, Space } from 'antd'
import { ArrowDownOutlined, FilterOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

const Income = (props: any) => {
  const ref = useRef<HTMLDivElement>(null)

  const [resultData, setResultData] = useState<string[]>([])
  const [columns, setColumns] = useState<any>([])
  const [selectType, setSelectType] = useState<any>('0')
  const [time, setTime] = useState<any[]>([
    moment().add('-6', 'd').format('YYYY/MM/DD'),
    moment().startOf('day').format('YYYY/MM/DD'),
  ])

  // 营业额
  const getOrderList = async () => {
    return await DataBaseApi.getSaleTypeDetail({
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    })
  }

  const requestLoadMore = async () => {
    const append = await getOrderList()
    setColumns(
      append?.data?.detail?.map((x: any, index: any) => ({
        key: `${index}`,
        label: index === 0 ? '全部' : x.income,
      }))
    )
    setResultData(
      append?.data?.detail?.map((i: any, index: any) => ({
        id: `${index}`,
        ...i,
      }))
    )
  }

  useMount(() => {
    requestLoadMore()
  })

  useUpdateEffect(() => {
    requestLoadMore()
  }, [time])

  const renderItem = (item: any, index: number) => {
    const { income, amount, parent, order_num } = item
    return (
      <div style={{ display: '-webkit-box' }} className="flex text-xs mt-2" key={index}>
        <p className="w-[25%] border-l-0 border-r-0 px-2 py-4 border-width-[0.5px] border-color-[#e9e9e9] border-solid">
          {income}
        </p>
        <p className="order-table w-[25%] py-4">{order_num}</p>
        <p className="order-table w-[25%] py-4">{parent}%</p>
        <p className="order-table w-[25%] py-4 text-right">{amount}</p>
      </div>
    )
  }

  // 导出
  const orderDown = async () => {
    await DownApi.uploadFile({
      type: 4,
      file_type: 'xlsx',
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    })
  }

  const orderList = () => {
    return (
      <div ref={ref} className="flex flex-col pt-5 overflow-x-auto w-600px">
        <div style={{ display: '-webkit-box' }} className="pl-2 items-center text-xs font-600">
          <p className="w-[25%]">收款方式</p>
          <p className="w-[25%]">预约数量</p>
          <p className="w-[25%]">百分比</p>
          <p className="w-[25%] text-right">营业额</p>
        </div>
        <>
          {selectType !== '0'
            ? resultData?.filter((i: any) => i?.id === selectType)?.map((item, index) => renderItem(item, index))
            : resultData?.map((item, index) => renderItem(item, index))}
        </>
      </div>
    )
  }

  const handleMenuClick = (e: any) => {
    if (e.key) {
      setSelectType(e.key)
    }
  }

  const menuProps = {
    items: columns,
    onClick: handleMenuClick,
  }

  return (
    <div className="flex w-[calc(100vw-60px)] min-h-[calc(100vh-60px)]">
      <div className="w-165px border-color-[#000] border-opacity-20 pt-10 border border-solid border-l-0 border-t-0 border-b-0">
        <PcMenu />
      </div>
      <div className={`flex flex-col flex-1  items-center pt-20`}>
        <div className="flex w-full justify-between items-center w-600px">
          <p className="font-600 text-2xl">类型</p>
          <Button
            onClick={orderDown}
            style={{ display: 'flex', alignItems: 'center' }}
            type="primary"
            icon={<ArrowDownOutlined />}
          >
            导出
          </Button>
        </div>
        <div className="w-600px bg-[#f6f6f6] flex justify-end py-5 rounded-md my-4">
          <div className="flex items-center justify-end">
            <RangePicker
              style={{ minWidth: 160 }}
              className="!bg-[#fff] rounded-2xl"
              value={[dayjs(time[0]), dayjs(time[1])]}
              placeholder={['开始时间', '结束时间']}
              onChange={(time) => {
                if (time) {
                  setTime([dayjs(time[0]).format('YYYY/MM/DD'), dayjs(time[1]).format('YYYY/MM/DD')])
                }
              }}
            />
            <Dropdown menu={menuProps}>
              <Button type="primary" className="mx-4">
                <Space>
                  筛选
                  <FilterOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
        {orderList()}
      </div>
    </div>
  )
}

export default Income
