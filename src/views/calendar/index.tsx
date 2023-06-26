import React from 'react'
import moment from 'moment'
import { Popup, Calendar } from 'antd-mobile'
import styles from './index.module.scss'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import ReserveCalendar from './components/ReserveCalendar'
import PlanCalendar from './components/PlanCalendar'

function CalendarCom() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarMode, setCalendarMode] = useState('reserve')
  const [popupVisible, setPopupVisible] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)

  const navigate = useNavigate()
  const params: any = useParams()
  const routerCalendarMode = params?.mode || 'reserve'

  useEffect(() => {
    if (routerCalendarMode) {
      setCalendarMode(routerCalendarMode)
    }
  }, [routerCalendarMode])

  const setDateString = (dateString: string) => {
    setSelectedDate(moment(dateString, 'YYYY-MM-DD').toDate())
  }

  const onMoreClick = () => {
    setPopupVisible(true)
  }

  const onOrderClick = () => {
    navigate('/calendar/kanban')
  }

  const onTitleClick = () => {
    setPickerVisible(true)
  }

  const moreIcon = () => {
    return (
      <SvgIcon name="calendar-more" className="w-[28px] h-[28px]" style={{ color: '#2A4948' }} onClick={onMoreClick} />
    )
  }

  const orderIcon = () => {
    return (
      <SvgIcon
        name="calendar-order"
        className="w-[20px] h-[20px]"
        style={{ color: '#2A4948' }}
        onClick={onOrderClick}
      />
    )
  }

  return (
    <div className={`${styles.calendar} pt-[48px] sm:(pt-0)`}>
      <div className='sm:(hidden)'>
        <HeaderNav
          title={calendarMode === 'reserve' ? moment(selectedDate, 'YYYY-MM-DD').format('dddd YYYY-MM-DD') : '排班日历'}
          renderLeft={moreIcon()}
          renderRight={orderIcon()}
          onTitleClick={calendarMode === 'reserve' ? onTitleClick : null}
        />
      </div>
      <div>
        {calendarMode === 'reserve' ? (
          <ReserveCalendar dateString={moment(selectedDate).format('YYYY-MM-DD')} setDateString={setDateString} />
        ) : calendarMode === 'plan' ? (
          <PlanCalendar />
        ) : null}
      </div>
      <Popup
        visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false)
        }}
        bodyStyle={{ height: '20.87rem', borderRadius: '20px 20px 0 0' }}
      >
        <div className="w-full h-full flex flex-col items-center px-4">
          <p className="w-13 m-4 h-2 bg-[#D9D9D9] rounded-xl"></p>
          <span className="text-xl font-500 mb-10 mt-8">日历选择</span>
          <div className="w-full flex justify-around">
            <div className="text-center">
              <SvgIcon
                name={`calendar-reserve${calendarMode === 'reserve' ? '-active' : ''}`}
                className="w-[90px] h-[150px]"
                onClick={() => {
                  navigate('/calendar', { replace: true })
                  setPopupVisible(false)
                }}
              />
              <span className={`text-sm ${calendarMode !== 'reserve' ? 'text-color-[#B4B4B4]' : ''}`}>预约日历</span>
            </div>
            <div className="text-center">
              <SvgIcon
                name={`calendar-plan${calendarMode === 'plan' ? '-active' : ''}`}
                className="w-[90px] h-[150px]"
                onClick={() => {
                  navigate('/calendar/plan', { replace: true })
                  setPopupVisible(false)
                }}
              />
              <span className={`text-sm ${calendarMode !== 'plan' ? 'text-color-[#B4B4B4]' : ''}`}>排班日历</span>
            </div>
          </div>
        </div>
      </Popup>
      <Popup visible={pickerVisible} onMaskClick={() => setPickerVisible(false)} bodyStyle={{ height: 'auto' }}>
        <Calendar
          value={selectedDate}
          selectionMode="single"
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
            setSelectedDate(val)
            setPickerVisible(false)
          }}
        />
      </Popup>
    </div>
  )
}

export default CalendarCom
