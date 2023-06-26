import React from 'react'
import Search from '../Search'
import styles from '../index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import DataBaseApi from '@/http/api/data'
import { Button, Calendar, Popup, SearchBar, Selector } from 'antd-mobile'
import { useRequest } from 'ahooks'
import UserApi from '@/http/api/user'
import DownApi from '@/http/api/down'
import moment from 'moment'
import { store } from '@/redux'

const SelectorStyle = {
  '--border-radius': '20px',
  '--border': 'solid transparent 1px',
  '--checked-border': 'solid var(--adm-color-primary) 1px',
  '--padding': '4px 12px',
  fontSize: '12px',
  '--color': 'rgba(42, 73, 72, 0.08)',
  '--checked-color': '#2A4948',
  '--checked-text-color': '#fff',
}
const Employee = (props: any) => {
  const { tabKey, orderType } = props
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()

  const [visible, setVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [sourceType, setSourceType] = useState<any>('0')
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
        className="flex justify-between items-center text-xs border border-width-[0.5px] border-color-[#e9e9e9] border-solid mt-2 px-2 py-2 rounded-lg"
      >
        <p className="flex w-[20%]">{staff_id}</p>
        <p className="flex w-[20%] justify-center">{staff_name}</p>
        <p className="flex w-[20%] justify-center">{order_num}</p>
        <p className="flex w-[20%] justify-center">${amount}</p>
        <p className="flex w-[20%] justify-end">${cost}</p>
      </div>
    )
  }

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

  useEffect(() => {
    if (tabKey === 'employee') {
      run()
    }
  }, [tabKey, time, orderType, search])

  return (
    <div className={`flex flex-col w-[90%] mt-4 ${styles.order}  ${tabKey !== 'employee' && 'hidden'}`}>
      <div className="flex items-center w-full">
        <div className={`${styles.searchinput} pr-4 w-full justify-between`}>
          <SearchBar
            onSearch={(val) => {
              setSearch(val)
            }}
            onClear={() => setSearch('')}
            placeholder={'员工搜索'}
          />
          <div className="flex items-center">
            <SvgIcon name="filter-order" className="w-[11px] h-[13px]" />
            <p onClick={() => setVisible(true)} className="text-xs pl-1">
              筛选
            </p>
          </div>
        </div>
      </div>

      <div
        onClick={() => setCalendarVisible(true)}
        className="flex rounded-lg px-3 py-1.5 items-center w-full justify-between my-4 bg-[#f4f6f6] border border-width-[0.5px] border-solid border-color-[#e1e5e5]"
      >
        <SvgIcon name="verify-right" className="w-[6px] h-[12px] transform rotate-z-180" />
        <p className="text-xs">{`${time[0]}-${time[1]}`}</p>
        <SvgIcon name="verify-right" className="w-[6px] h-[12px]" />
      </div>

      {/*  */}
      <div className="flex flex-col pt-5">
        <div className="flex items-center justify-between text-xs font-600">
          <p className="flex w-[20%]">{userInfo?.user_type === 2 ? '员工编号#' : '渠道'}</p>
          <p className="flex w-[20%] justify-center">名称</p>
          <p className="flex w-[20%] justify-center">预约数</p>
          <p className="flex w-[20%] justify-center">营业额</p>
          <p className="flex w-[20%] justify-end">成本</p>
        </div>
        {res?.data?.detail?.map((item: any) => renderItem(item))}
      </div>
      <div className="fixed-b-btn flex">
        <div
          onClick={orderDown}
          className="flex w-[70%] rounded-3xl py-1 px-8 bg-[#2A4948] justify-center items-center text-color-[#fff]"
        >
          <Button className="text-color-[#fff]" fill="none">
            导出
          </Button>
          <SvgIcon name="user-left" style={{ transform: 'rotateZ(90deg' }} className="w-[10px] h-[10px]" />
        </div>
      </div>
      {/*  */}
      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyStyle={{ height: 'auto', borderRadius: '20px 20px 0 0' }}
      >
        <div className="flex flex-col pt-5">
          <div className="flex flex-col items-center">
            <div className="w-full bg-[#D9D9D9] w-[50px] h-[7px] rounded-2xl"></div>
          </div>
          <div className="px-7 pb-10">
            <p className="flex  pb-4 pt-10 text-sm text-color-[#000]">状态</p>
            <Selector
              onChange={(val) => {
                if (val.length === 0) return false
                setSourceType(val[0])
              }}
              style={SelectorStyle}
              showCheckMark={false}
              options={options}
              value={[sourceType]}
            />
          </div>
          <div className="flex py-5 justify-center items-center shadow-sm w-full">
            <div
              onClick={() => {
                setSourceType('0')
              }}
              className="text-sm flex opacity-50 rounded-l-2xl items-center justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
            >
              重置
            </div>
            <div
              onClick={() => {
                setVisible(false)
                run()
              }}
              className="text-sm flex items-center rounded-r-2xl justify-center py-2 w-[40%] bg-[#2A4948] text-color-[#fff]"
            >
              完成
            </div>
          </div>
        </div>
      </Popup>
      <Popup visible={calendarVisible} onMaskClick={() => setCalendarVisible(false)} bodyStyle={{ height: 'auto' }}>
        <Calendar
          className={styles.calendarCustom}
          value={time as [Date, Date]}
          selectionMode="range"
          nextYearButton={<></>}
          prevYearButton={<></>}
          nextMonthButton={
            <div className="flex justify-center items-center rounded-lg py-1 px-3 border border-solid border-color-[#ccc]">
              <SvgIcon name="verify-right" className="w-[8px] h-[12px] !transform !rotate-0" />
            </div>
          }
          prevMonthButton={
            <div className="flex justify-center items-center rounded-lg py-1 px-3 border border-solid border-color-[#ccc]">
              <SvgIcon name="verify-right" className="w-[8px] h-[12px] transform rotate-z-180" />
            </div>
          }
          weekStartsOn="Monday"
          onChange={(val: any) => {
            setTime([moment(val[0]).format('YYYY/MM/DD'), moment(val[1]).format('YYYY/MM/DD')])
          }}
        />
      </Popup>
    </div>
  )
}

export default Employee
