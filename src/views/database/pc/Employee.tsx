import React from 'react'
import { DatePicker, Input, Dropdown, Popover, Button } from 'antd'
import { Selector, InfiniteScroll } from 'antd-mobile'
import { ArrowDownOutlined, CaretDownOutlined } from '@ant-design/icons'
import SvgIcon from '@/components/SvgIcon'
import { useRequest, useUpdateEffect } from 'ahooks'
import DataBaseApi from '@/http/api/data'
import moment from 'moment'
import dayjs from 'dayjs'
import { store } from '@/redux'
import DownApi from '@/http/api/down'

const { RangePicker } = DatePicker
const { Search } = Input

const SelectorStyle = {
  '--border-radius': '20px',
  '--border': 'solid transparent 1px',
  '--checked-border': 'solid var(--adm-color-primary) 1px',
  '--padding': '4px 12px',
  '--color': 'rgba(42, 73, 72, 0.08)',
  '--checked-color': '#2A4948',
  '--checked-text-color': '#fff',
  fontSize: '12px',
}

const Employee = (props: any) => {
  const { tabKey } = props
  const navigate = useNavigate()
  const userInfo = store.getState().global.userInfo

  const [sourceType, setSourceType] = useState<any>('0')
  const [orderType, setOrderType] = useState('0')

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState<any>('')

  const [time, setTime] = useState<any[]>([
    moment().add('-6', 'd').format('YYYY/MM/DD'),
    moment().startOf('day').format('YYYY/MM/DD'),
  ])

  const { data: res, run } = useRequest(
    () =>
      DataBaseApi.getChannelOrStaffList({
        begin_time: moment(time[0]).unix(),
        end_time: moment(time[1]).unix(),
        order_type: orderType,
        source_type: sourceType,
        search,
      }),
    {
      manual: true,
    }
  )

  const items = [
    { label: '全部', key: '0' },
    { label: '营业额（低-高）', key: '1' },
    { label: '营业额（高-低）', key: '2' },
    { label: '预约数（低-高）', key: '3' },
    { label: '预约数（高-低）', key: '4' },
  ]

  const options = [
    {
      label: '全部',
      value: '0',
    },
    {
      label: '普通',
      value: '1',
    },
    {
      label: '已关联',
      value: '2',
    },
    {
      label: '平台签约',
      value: '3',
    },
  ]

  // 导出
  const orderDown = async () => {
    const params: any = {
      type: 7,
      file_type: 'xlsx',
      begin_time: moment(time[0]).unix(),
      end_time: moment(time[1]).unix(),
    }
    if (orderType) params.order_type = orderType
    if (sourceType) params.source_type = sourceType
    if (search) params.search = search
    await DownApi.uploadFile(params)
  }

  const confirmFilter = () => {
    setOpen(false)
    run()
  }

  const reset = () => {
    setSourceType('0')
  }

  useEffect(() => {
    run()
  }, [tabKey, time, orderType, search])

  const orderList = () => {
    return (
      <div className="flex flex-col pt-5 overflow-x-auto">
        <div className="flex items-center justify-between text-xs font-600">
          <p className="flex w-[20%]">{userInfo?.user_type === 2 ? '员工' : '渠道'}编号#</p>
          <p className="flex w-[20%] justify-center">名称</p>
          <p className="flex w-[20%] justify-center">预约数</p>
          <p className="flex w-[20%] justify-center">营业额</p>
          <p className="flex w-[20%] justify-end">成本</p>
        </div>
        {<>{res?.data?.detail?.map((item: any) => renderItem(item))}</>}
      </div>
    )
  }

  const renderItem = (item: any) => {
    const { staff_id, staff_name, order_num, cost, amount } = item
    return (
      <div
        key={staff_id}
        onClick={() => {
          // 员工
          if (userInfo?.user_type === 2) {
            navigate(`/manage/employee/info`, {
              state: {
                id: staff_id,
              },
            })
          }
        }}
        className="flex justify-between cursor-pointer hover:(transition-all shadow-sm) items-center text-xs border border-width-[0.5px] border-color-[#e9e9e9] border-solid mt-2 px-2 py-5 rounded-lg"
      >
        <p className="flex w-[20%]">{staff_id}</p>
        <p className="flex w-[20%] justify-center">{staff_name}</p>
        <p className="flex w-[20%] justify-center">{order_num}</p>
        <p className="flex w-[20%] justify-center">${amount}</p>
        <p className="flex w-[20%] justify-end">${cost}</p>
      </div>
    )
  }

  const Content = () => {
    return (
      <div className="flex flex-col pt-4">
        <div className="px-4 pb-8">
          <p className="flex pb-4 text-sm text-color-[#000]">类型</p>
          <Selector
            onChange={(val) => setSourceType(val[0])}
            style={SelectorStyle}
            showCheckMark={false}
            options={options}
            value={[sourceType]}
          />
        </div>

        <div className="flex py-5 justify-center items-center w-full">
          <div
            onClick={reset}
            className="text-sm cursor-pointer flex opacity-50 rounded-l-2xl items-center justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
          >
            重置
          </div>
          <div
            onClick={confirmFilter}
            className="text-sm flex cursor-pointer items-center rounded-r-2xl justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
          >
            完成
          </div>
        </div>
      </div>
    )
  }

  const changeRangeTime = (val: any, timeString: any) => {
    setTime([timeString[0], timeString[1]])
  }

  return (
    <div className="flex flex-col">
      <div className="bg-[#f4f6f6] rounded-md py-4 px-8 flex justify-between ">
        <div>
          <RangePicker
            value={[dayjs(time[0]), dayjs(time[1])]}
            className="!bg-[#fff] rounded-3xl"
            placeholder={['开始时间', '结束时间']}
            onChange={changeRangeTime}
            clearIcon={false}
          />
        </div>
        <div className="flex items-center">
          <Search
            placeholder="员工搜索"
            onSearch={(val) => {
              setSearch(val)
            }}
            enterButton
          />
          <Dropdown
            menu={{
              items,
              onClick: (e) => {
                if (e.key) {
                  setOrderType(e.key)
                }
              },
            }}
          >
            <div className="border text-color-[#2A4948] min-w-80px flex justify-center mx-3 cursor-pointer border-solid border-color-[#eee] bg-[#fff] rounded-3xl  py-1">
              排序
              <CaretDownOutlined />
            </div>
          </Dropdown>
          <Popover
            open={open}
            placement="topRight"
            onOpenChange={() => setOpen(() => !open)}
            content={<Content />}
            trigger="click"
          >
            <div className="border text-color-[#2A4948] min-w-80px flex items-center justify-center cursor-pointer border-solid border-color-[#eee] bg-[#fff] rounded-3xl  py-1">
              筛选
              <SvgIcon name="filter-order" className="w-[11px] h-[13px] ml-1" />
            </div>
          </Popover>
        </div>
        <Button
          className="absolute right-3 -top-12"
          onClick={orderDown}
          style={{ display: 'flex', alignItems: 'center' }}
          type="primary"
          icon={<ArrowDownOutlined />}
        >
          导出
        </Button>
      </div>
      {orderList()}
    </div>
  )
}

export default Employee
