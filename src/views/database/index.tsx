import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import DataBaseApi from '@/http/api/data'
import { store } from '@/redux'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Calendar, Popup } from 'antd-mobile'
import Duration from './Duration'
import SaleType from './SaleType'
import Channel from './Channel'
import Income from './Income'
import Turnover from './Turnover'
import PcDataBase from './pc'
import styles from './index.module.scss'
import moment from 'moment'

const Kanban = () => {
  const navigator = useNavigate()
  const [calendarVisible, setCalendarVisible] = useState(false)

  const [time, setTime] = useState<any[]>([
    moment().add('-6', 'd').format('YYYY/MM/DD'),
    moment().startOf('day').format('YYYY/MM/DD'),
  ])

  const userInfo = store.getState().global.userInfo

  const ProgressTextStyle: any = (parent: number) => {
    return {
      position: 'absolute',
      fontSize: '12px',
      left: parent >= 90 ? parent - 20 + '%' : parent + 4 + '%',
      marginTop: '-8px',
      color: parent > 90 ? '#fff' : '#2A4948',
    }
  }

  const NavRightList = () => {
    return (
      <div onClick={() => navigator('/database/list')} className="flex items-center ">
        <SvgIcon name="list" className="w-[15px] h-[15px] mr-1" />
        <p className="text-xs">列表</p>
      </div>
    )
  }

  // 首页数据
  const {
    data: turnoverRes,
    loading,
    refresh,
  } = useRequest(() =>
    DataBaseApi.getDataBase({ begin_time: moment(time[0]).unix(), end_time: moment(time[1]).unix() })
  )

  useUpdateEffect(() => {
    refresh()
  }, [time])

  const H5Database = () => {
    return (
      <div className="flex flex-col items-center pt-[48px] pb-[90px] w-full sm:(hidden)">
        <HeaderNav renderRight={<NavRightList />} renderLeft={false} />
        <div
          onClick={() => setCalendarVisible(true)}
          className="flex w-[90%] rounded-lg px-3 py-1.5 items-center w-full justify-between my-4 bg-[#f4f6f6] border border-width-[0.5px] border-solid border-color-[#e1e5e5]"
        >
          <SvgIcon name="verify-right" className="w-[6px] h-[12px] transform rotate-z-180" />
          <p className="text-xs">{`${time[0]}-${time[1]}`}</p>
          <SvgIcon name="verify-right" className="w-[6px] h-[12px]" />
        </div>
        <div className="flex flex-col w-[90%] mt-5">
          {/* 营业额 */}
          <Turnover loading={loading} turnoverRes={turnoverRes} keyrender="h5" />
          {/* 收款方式 */}
          <Income
            incomeLoading={loading}
            incomeDetailRes={turnoverRes?.data?.income}
            ProgressTextStyle={ProgressTextStyle}
          />
          {/* 员工 */}
          <Channel
            channelLoading={loading}
            userInfo={userInfo}
            channelOrStaffRes={turnoverRes?.data?.channelOrStaff}
            ProgressTextStyle={ProgressTextStyle}
          />
          {/*  类型*/}
          <SaleType
            saleTypeLoading={loading}
            saleTypeRes={turnoverRes?.data?.sale_type}
            ProgressTextStyle={ProgressTextStyle}
          />
          {/* 时长 */}
          <Duration
            durationLoading={loading}
            durationRes={turnoverRes?.data?.duration}
            ProgressTextStyle={ProgressTextStyle}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* h5 */}
      <H5Database />
      {/* Pc */}
      <PcDataBase
        time={time}
        turnoverRes={turnoverRes}
        loading={loading}
        incomeLoading={loading}
        incomeDetailRes={turnoverRes?.data?.income}
        ProgressTextStyle={ProgressTextStyle}
        channelLoading={loading}
        userInfo={userInfo}
        channelOrStaffRes={turnoverRes?.data?.channelOrStaff}
        saleTypeLoading={loading}
        saleTypeRes={turnoverRes?.data?.sale_type}
        durationLoading={loading}
        durationRes={turnoverRes?.data?.duration}
      />
      <Popup visible={calendarVisible} onMaskClick={() => setCalendarVisible(false)} bodyStyle={{ height: 'auto' }}>
        <Calendar
          className={styles.calendarCustom}
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
    </>
  )
}

export default Kanban
