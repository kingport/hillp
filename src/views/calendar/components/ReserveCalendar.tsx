import React from 'react'
import { Swiper, Popover, Dialog, SwiperRef, Toast } from 'antd-mobile'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useRequest, useSize } from 'ahooks'
import SuspendMenu from './SuspendMenu'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import CalendarApi from '@/http/api/calendar'
import { store } from '@/redux'
import styles from './index.module.scss'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import HiilpAvatar from '@/components/HiilpAvatat'
import { setPayOrderInfo } from '@/redux/modules/global/action'
import { min } from 'lodash'
import PcSuspendMenu from './PcSuspendMenu'
import { Dropdown, MenuProps, Modal, Spin } from 'antd'
import dayjs from 'dayjs'
import PcAddBreakForm from '../add/PcAddBreakForm'
import { LeftOutline, RightOutline } from 'antd-mobile-icons'

interface ReserveCalendarProps {
  dateString: string
  setDateString: (newDateString: string) => void
}

function ReserveCalendar(props: ReserveCalendarProps) {
  const { dateString, setDateString } = props
  const ref = useRef<SwiperRef>(null)
  const refReserve = useRef<any>(null)
  const navigate = useNavigate()
  const userInfo = store.getState().global.userInfo

  const { runAsync: getEmployeeAsync, loading: employeeLoading } = useRequest(ManageApi.getStaffSelect, {
    manual: true,
  })
  const {
    runAsync: getSubscribeAsync,
    loading,
    data: res,
    refresh,
  } = useRequest(CalendarApi.getMySubscribe, {
    manual: true,
    onSuccess(res) {
      if (res.status === 203) {
        Dialog.show({
          content: `${res?.data?.text}`,
          closeOnAction: true,
          actions: [
            [
              {
                key: 'cancel',
                text: '拒绝关联',
                className: 'dialog-cancel',
                onClick() {
                  confirm({
                    type: 2,
                    temp_token: res?.data?.temp_token,
                    is_success: 2,
                  })
                },
              },
              {
                key: 'confirm',
                text: `立即关联`,
                className: 'dialog-confirm',
                async onClick() {
                  confirm({
                    type: 2,
                    temp_token: res?.data?.temp_token,
                    is_success: 1,
                  })
                },
              },
            ],
          ],
        })
      }

      if (res.status === 202) {
        Dialog.show({
          content: `${res?.data?.text}`,
          closeOnAction: true,
          actions: [
            [
              {
                key: 'cancel',
                text: '联系客服',
                className: 'dialog-cancel',
                onClick() {
                  window.location.href = `${location.origin}/personal/help`
                },
              },
              {
                key: 'confirm',
                text: `${res?.data?.title}`,
                className: 'dialog-confirm',
                async onClick() {
                  store.dispatch(
                    setPayOrderInfo({
                      stripeInfo: { staff_id: res?.data?.staff_id },
                      type: 4,
                    })
                  )
                  window.location.href = `${location.origin}/pay`
                },
              },
            ],
          ],
        })
      }
    },
  })
  const { run: confirm } = useRequest((params) => ManageApi.confirm(params), {
    manual: true,
    onSuccess() {
      window.location.reload()
    },
  })

  const [page, setPage] = useState(-1)
  const [subscribeData, setSubscribeData] = useState<any>(null)
  const [employeeDoubleList, setEmployeeDoubleList] = useState<any[]>([])
  const [employeeTotal, setEmployeeTotal] = useState<number>(0)
  const [reservationListLeft, setReservationListLeft] = useState<any[]>([])
  const [reservationListRight, setReservationListRight] = useState<any[]>([])
  const [sheetVisible, setSheetVisible] = useState(false)
  const [selectEmployInfo, setSelectEmployInfo] = useState<any>(null)
  const [leftId, setLeftId] = useState(null)
  const [rightId, setRightId] = useState(null)
  const [clickItem, setClickItem] = useState<any>({})
  const [currentSwiperIndex, setCurrentSwiperIndex] = useState(1)
  const [showTime, setShowTime] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const size = useSize(document.querySelector('body'))

  const parseEmployeeItem = (item: any) => {
    return {
      id: String(item?.id || item?.user_id || item?.staff_id),
      name: item?.nickname,
      avatar: item?.head,
      online: item?.online,
      schedule: item?.schedule,
      type: item?.type,
    }
  }

  const parseOrdersNRest = (employeeId: string) => {
    const resultItems = []

    if (subscribeData && subscribeData.length) {
      const subscribeItem = subscribeData.find((item: any) => String(item.staff_id) === employeeId)
      if (subscribeItem && subscribeItem.order.length) {
        resultItems.push(
          ...subscribeItem.order.map((order: any) => ({
            id: order.id,
            start: moment.unix(order.start_time).format('HH:mm'),
            end: moment.unix(order.end_time).format('HH:mm'),
            title: order.server_type === 1 ? '堂食' : '外卖',
            name: order.client_name,
            status: order.server_type,
            note: order.remark,
            isNew: order.status === 0,
            source: order.source,
          }))
        )
      }
      // 休息时间
      if (subscribeItem && subscribeItem.rest.length) {
        resultItems.push(
          ...subscribeItem.rest.map((rest: any) => ({
            type: 'rest',
            id: rest.id,
            start: moment.unix(rest.start_time).format('HH:mm'),
            end: moment.unix(rest.end_time).format('HH:mm'),
          }))
        )
      }

      // 不可点击时间
      if (subscribeItem && subscribeItem.no_schedule.length) {
        resultItems.push(
          ...subscribeItem.no_schedule.map((rest: any) => ({
            start: moment.unix(rest.start_time).format('HH:mm'),
            end: moment.unix(rest.end_time).format('HH:mm'),
            status: 5,
          }))
        )
      }
    }
    return resultItems
  }

  useEffect(() => {
    if (page >= 0) {
      setLeftId(employeeDoubleList[page][0].id)
      setReservationListLeft(parseOrdersNRest(employeeDoubleList[page][0].id))

      if (employeeDoubleList[page][1]) {
        setRightId(employeeDoubleList[page][1].id)
      }
      setReservationListRight((employeeDoubleList[page][1] && parseOrdersNRest(employeeDoubleList[page][1].id)) || [])
    }
  }, [page])

  useEffect(() => {
    if (page === -1 && subscribeData && subscribeData.length && employeeDoubleList && employeeDoubleList.length) {
      setPage(0)
    }
  }, [subscribeData, employeeDoubleList])

  const initSubscribeData = async () => {
    const { data } = await getSubscribeAsync({ date: dateString })
    ref.current?.swipeTo(0)
    setSubscribeData(data || null)
    setPage(-1)
  }
  useEffect(() => {
    initSubscribeData()
  }, [dateString])

  const initEmployeeData = async () => {
    if (userInfo && userInfo.user_type === 1) {
      setEmployeeDoubleList([[parseEmployeeItem(res?.data[0])]])
    } else if (userInfo && userInfo.user_type === 2) {
      const doubleList = []
      const { data: employeeData } = await getEmployeeAsync({})
      setEmployeeTotal(employeeData.length)
      for (let i = 0; i < employeeData.length; i += 2) {
        const currentList = [parseEmployeeItem(employeeData[i])]
        if (employeeData[i + 1]) {
          currentList.push(parseEmployeeItem(employeeData[i + 1]))
        }
        doubleList.push(currentList)
      }
      setEmployeeDoubleList(doubleList)
    }
  }
  const initPcEmployeeData = async () => {
    if (userInfo && userInfo.user_type === 1) {
      setEmployeeDoubleList([[parseEmployeeItem(res?.data[0])]])
    } else if (userInfo && userInfo.user_type === 2) {
      const doubleList = []
      const { data: employeeData } = await getEmployeeAsync({})
      setEmployeeTotal(employeeData.length)
      for (let i = 0; i < employeeData.length / 10; i++) {
        const currentList = employeeData.slice(i * 10, (i + 1) * 10)
        doubleList.push(currentList.map((item: any) => parseEmployeeItem(item)))
      }
      setEmployeeDoubleList(doubleList)
    }
  }

  useEffect(() => {
    if (res) {
      if (size?.width && size?.width >= 640) {
        initPcEmployeeData()
      } else {
        initEmployeeData()
      }
    }
  }, [userInfo, userInfo.user_type, res])

  // 滚动到最早排班节点
  useEffect(() => {
    if (employeeDoubleList.length && subscribeData.length) {
      const currentSchedule: any = []
      // 找出当前页面员工的排班
      subscribeData?.map((s: any) => {
        employeeDoubleList[page]?.map((e: any) => {
          if (`${s.staff_id}` === `${e.id}` && s.start_time !== 0) {
            currentSchedule.push(s.start_time)
          }
        })
      })

      // 过滤出最早排班时间
      if (currentSchedule.length) {
        const minScheduleTime: any = min(currentSchedule)
        const timeFormart = moment(minScheduleTime * 1000).format('HH:mm')
        const anchorElement = document.getElementById(timeFormart)

        if (anchorElement) {
          if (refReserve.current) {
            window.scrollTo({
              top: anchorElement?.offsetTop,
            })
          }
        }
      } else {
        if (refReserve.current) {
          window.scrollTo(0, 0)
        }
      }
    }
  }, [page])

  const onIndexChange = async (index: number) => {
    setPage(index)
  }

  // 定位到当前时间
  const onLocateClick = () => {
    // 当前分钟
    let nowMoment_mm: any = moment().format('mm')
    if (nowMoment_mm * 1 >= 0 && nowMoment_mm * 1 < 15) {
      nowMoment_mm = `00`
    }
    if (nowMoment_mm * 1 >= 15 && nowMoment_mm * 1 < 30) {
      nowMoment_mm = `15`
    }
    if (nowMoment_mm * 1 >= 30 && nowMoment_mm * 1 < 45) {
      nowMoment_mm = `30`
    }
    if (nowMoment_mm * 1 >= 45 && nowMoment_mm * 1 < 60) {
      nowMoment_mm = `45`
    }
    const moment_id = `${moment().format('HH')}:${nowMoment_mm}`
    const anchorElement = document.getElementById(moment_id)
    const targetArr = document.getElementsByClassName(`date${moment_id}`) as any
    const target = Array.from(targetArr).find((i: any) => i.offsetTop) as any
    if (target) {
      if (refReserve.current) {
        window.scrollTo(0, target?.offsetTop - 200)
      }
    }
  }

  const onEventCardClick = (id: number) => {
    navigate('/calendar/view', { state: { id } })
  }

  const onGridClick = (timeString?: string, id?: string) => {
    navigate('/calendar/add/order', {
      state: {
        dateString,
        timeString,
        employeeId: id,
      },
    })
  }

  // 把名字超15个字符的截取
  const cutName = (name: string) => {
    if (name.length > 16) {
      return name.slice(0, 16) + '...'
    }
    return name
  }

  const renderTimeLabel = () => {
    const labelItems = []

    const suffixText = moment().format('H:mm')
    const suffixText_min = moment().format('mm')
    const suffixText_h = moment().format('H')
    const minArr = Array.from({ length: 60 }, (v, k) => k)
    for (let i = 0; i <= 23; i++) {
      let timeText = ''
      timeText = `${i}:00`
      labelItems.push(
        <div
          className={`${styles.CalendarTimeLabel} flex flex-col items-end text-xs font-600 relative leading-3`}
          key={i}
        >
          <span>{timeText}</span>
          {suffixText_h === `${i}` &&
            minArr?.map((x) => {
              if (`${suffixText_min}` === `${x < 10 ? '0' + x : x}`) {
                return (
                  <div
                    key={x}
                    style={{ top: x * 1.5 + '%', opacity: showTime ? 1 : 0 }}
                    className="absolute flex items-center w-98vw left-2vw z-99 sm:(w-[calc(100vw-90px+0.5rem)])"
                  >
                    <span
                      id={`now_${suffixText_h}_${x}`}
                      className={`border flex justify-center items-center border-solid border-color-[#9e1d1d] rounded-xl px-1 py-2px text-xs text-color-[#9e1d1d] bg-[#fff]`}
                    >
                      {suffixText}
                    </span>
                    <div className="flex-1 h-2px bg-[#9E1D1D]"></div>
                  </div>
                )
              }
            })}
        </div>
      )
    }
    return labelItems
  }

  const renderTimeGrid = (data: any[] = [], id: any) => {
    const gridItems = []
    const subscribeItem = subscribeData?.find((item: any) => String(item.staff_id) === String(id))

    for (let i = 0; i < 96; i++) {
      const fullHourFlag = i % 4 === 3

      // 是否在排班中
      let isBetween = 0
      const a = `${Math.floor(i / 4) < 10 ? '0' + Math.floor(i / 4) : Math.floor(i / 4)}:${
        (i % 4) * 15 === 0 ? '00' : (i % 4) * 15
      }`
      if (subscribeItem) {
        const b = moment(subscribeItem?.start_time * 1000).format('YYYY-MM-DD')

        if (
          moment(subscribeItem?.start_time * 1000).unix() * 1 <= moment(`${b} ${a}`).unix() * 1 &&
          moment(`${b} ${a}`).unix() * 1 < moment(subscribeItem?.end_time * 1000).unix() * 1
        ) {
          isBetween = 1
        }
      }

      gridItems.push(
        <div
          key={i}
          id={`${a}`}
          className={`${'date' + a} ${styles.CalendarTimeGrid} ${fullHourFlag ? styles.FullHourTimeGrid : ''}
          ${isBetween ? 'bg-[#fff]' : 'bg-[#f1f1f1]'}           
          ${
            a === clickItem?.time && id === clickItem?.id && size?.width && size?.width < 640
              ? 'bg-[#2a4948] transform shadow-sm flex items-center'
              : ''
          }
          h-[30px]  border-[0.5px] border-solid border-color-[#e1e1e1] cursor-pointer sm:hover:bg-[#e5f2f1]`}
          onClick={() => {
            // 不在排班中无法点击
            // if (!isBetween) return false
            setClickItem({
              time: `${Math.floor(i / 4) < 10 ? '0' + Math.floor(i / 4) : Math.floor(i / 4)}:${
                (i % 4) * 15 === 0 ? '00' : (i % 4) * 15
              }`,
              id: id,
            })

            if (a === clickItem?.time && id === clickItem?.id) {
              onGridClick(`${Math.floor(i / 4)}:${(i % 4) * 15}`, id)
            }
          }}
        >
          {a === clickItem?.time && id === clickItem?.id && size?.width && size?.width < 640 && (
            <SvgIcon style={{ color: '#fff' }} name="add" className="w-10px h-10px absolute left-1" />
          )}
          {size?.width && size?.width >= 640 && (
            <p className="opacity-0 bg-transparent w-full h-full flex items-center pl-1 sm:hover:opacity-100">{`${
              Math.floor(i / 4) < 10 ? '0' + Math.floor(i / 4) : Math.floor(i / 4)
            }:${(i % 4) * 15 === 0 ? '00' : (i % 4) * 15}`}</p>
          )}
        </div>
      )
    }

    const eventItems = []
    const dateTimeFormat = 'YYYY-MM-DD HH:mm'
    const startOfDayMoment = moment(`${dateString} 00:00`, dateTimeFormat)
    for (let i = 0; i < data.length; i++) {
      const startOfEventMoment = moment(`${dateString} ${data[i].start}`, dateTimeFormat)
      const endOfEventMoment = moment(`${dateString} ${data[i].end}`, dateTimeFormat)
      const offsetTop = (startOfEventMoment.diff(startOfDayMoment, 'minutes') / 15) * 30
      const eventHeight = (endOfEventMoment.diff(startOfEventMoment, 'minutes') / 15) * 30

      const backgroundColor =
        data[i].source === 1
          ? '#E1EAE9'
          : data[i].source === 2
          ? '#FFEBE3E5'
          : data[i].status === 3
          ? '#FFEBE34D'
          : '#F3F3F3'
      const iconColor = data[i].source === 1 ? '#7AB1B0' : '#C25F37'
      const textColor = data[i].source === 1 ? '#2A4948' : '#3C1E12'
      eventItems.push(
        <div
          key={96 + i}
          className={`${styles.CalendarEventCard} ${data[i].status ? 'z-2' : 'z-1'} absolute px-4 py-2 text-xs`}
          style={{ top: offsetTop, height: eventHeight, backgroundColor: backgroundColor, color: textColor }}
          onClick={() => {
            // 没有status认为是休息，不可点击
            // data[i].status
            if (data[i].status === 5) return false

            if (!data[i].status) {
              return navigate('/calendar/rest/check', {
                state: {
                  id: data[i].id,
                },
              })
            }
            onEventCardClick(data[i].id)
          }}
        >
          <div className="font-600 text-right relative">
            <span className="top-6 left-0 absolute">{data[i].name}</span>
            <span>{data[i].title}</span>
          </div>
          {data[i]?.type === 'rest' || data[i].status === 5 ? (
            <span className="absolute">
              {/* 休息时间又不展示 怕了怕了 先注释吧 */}
              {/* {data[i].start}-{data[i].end} */}
            </span>
          ) : (
            <span className="-mt-4 absolute">
              {data[i].start}-{data[i].end}
            </span>
          )}
          {data[i].isNew ? (
            <div
              className={`${styles.CalendarEventLabel} absolute px-2 text-center text-xs text-color-[#D2693F] bg-[#FFF]`}
            >
              新预约
            </div>
          ) : null}
          {data[i].note ? (
            <Popover content={data[i].note} trigger="click">
              <span
                className={`${styles.CalendarNoteIcon} absolute z-2`}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <SvgIcon name="event-note" className="w-[12px] h-[12px]" style={{ color: iconColor }} />
              </span>
            </Popover>
          ) : null}
        </div>
      )
    }
    return [...gridItems, ...eventItems]
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          onClick={async (e) => {
            e.preventDefault()
            const res = await ManageApi.staffOnline({
              id: selectEmployInfo.id,
            })
            if (res.status === 200) {
              Toast.show(res.msg)
              refresh()
              if (size?.width && size?.width >= 640) {
                initPcEmployeeData()
              } else {
                initEmployeeData()
              }
            }
          }}
          className="flex items-center border border-solid w-56px rounded-2xl justify-center my-2"
        >
          <p className="text-color-[#8c8c8c] text-xs pr-1">{selectEmployInfo?.online === 1 ? '上线' : '下线'}</p>
          <span
            className={`${selectEmployInfo?.online === 1 ? 'bg-[#2A4948]' : 'bg-[#970D0D]'} p-1 rounded-full`}
          ></span>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            // 商家账号
            if (userInfo?.user_type === 2) {
              navigate('/manage/add/employee/information', {
                state: { id: selectEmployInfo?.id },
              })
            }
            // 个人账号
            if (userInfo?.user_type === 1) {
              navigate('/personal/information')
            }
          }}
        >
          编辑资料
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            navigate('/calendar/add/order', {
              state: {
                employeeId: selectEmployInfo?.id,
                dateString,
              },
            })
          }}
        >
          添加新预约
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          添加新休息时间
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '5',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            navigate('/calendar/plan')
          }}
        >
          更改工作时间
        </div>
      ),
    },
  ]

  // 关联员工
  const itemsCorrelation: MenuProps['items'] = [
    {
      key: '3',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            navigate('/calendar/add/order', {
              state: {
                employeeId: selectEmployInfo?.id,
                dateString,
              },
            })
          }}
        >
          添加新预约
        </div>
      ),
    },
  ]

  // 签约员工
  const itemsCorrelationSign: MenuProps['items'] = [
    {
      key: '2',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            // 商家账号
            if (userInfo?.user_type === 2) {
              navigate('/manage/add/employee/information', {
                state: { id: selectEmployInfo?.id },
              })
            }
            // 个人账号
            if (userInfo?.user_type === 1) {
              navigate('/personal/information')
            }
          }}
        >
          编辑资料
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div
          className="my-2"
          onClick={(e) => {
            e.preventDefault()
            navigate('/calendar/add/order', {
              state: {
                employeeId: selectEmployInfo?.id,
                dateString,
              },
            })
          }}
        >
          添加新预约
        </div>
      ),
    },
  ]

  // 左员工容器
  const employeeLeftContainer = (item: any) => {
    return (
      <div
        onClick={() => {
          setSelectEmployInfo(item[0])
          if (size?.width && size?.width < 640) setSheetVisible(true)
        }}
        className={`flex flex-col h-full justify-center items-center sm:hover:bg-[#f9fcfb] ${
          item.length === 1 ? styles.swiperItemFull : styles.swiperItem
        }`}
      >
        <div className="flex items-center justify-center w-[45px] h-[45px] border-[1.5px] border-solid border-color-[#C8E3E2] rounded-full overflow-hidden">
          {item[0].avatar ? (
            <img className="w-[39px] h-[39px] rounded-full" style={{ objectFit: 'cover' }} src={item[0].avatar} />
          ) : (
            <div className="flex items-center justify-center w-[39px] h-[39px] bg-[#C8E3E24D] rounded-full text-lg text-color-[#C8E3E2]">
              {item[0].name[0].toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-xs font-600 mt-1.5">{cutName(item[0].name)}</span>
      </div>
    )
  }

  // 右员工容器
  const employeeRightContainer = (item: any) => {
    return (
      <div
        key={Math.random()}
        onClick={() => {
          setSelectEmployInfo(item[1])
          if (size?.width && size?.width < 640) setSheetVisible(true)
        }}
        className="flex flex-col h-full justify-center items-center w-[50%] sm:hover:bg-[#f9fcfb]"
      >
        <div className="flex items-center justify-center w-[45px] h-[45px] border-[1.5px] border-solid border-color-[#C8E3E2] rounded-full">
          {item[1].avatar ? (
            <img className="w-[39px] h-[39px] rounded-full" style={{ objectFit: 'cover' }} src={item[1].avatar} />
          ) : (
            <div className="flex items-center justify-center w-[39px] h-[39px] bg-[#C8E3E24D] rounded-full text-lg text-color-[#C8E3E2]">
              {item[1].name[0].toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-xs font-600 mt-1.5">{cutName(item[1].name)}</span>
      </div>
    )
  }

  const employeePcContainer = (current: any) => {
    return (
      <div
        onClick={() => {
          setSelectEmployInfo(current)
          if (size?.width && size?.width < 640) setSheetVisible(true)
        }}
        className={`flex flex-col h-full justify-center items-center sm:hover:bg-[#f9fcfb] ${styles.swiperItem}`}
      >
        <div className="flex items-center justify-center w-[45px] h-[45px] border-[1.5px] border-solid border-color-[#C8E3E2] rounded-full overflow-hidden">
          {current.avatar ? (
            <img className="w-[39px] h-[39px] rounded-full" style={{ objectFit: 'cover' }} src={current.avatar} />
          ) : (
            <div className="flex items-center justify-center w-[39px] h-[39px] bg-[#C8E3E24D] rounded-full text-lg text-color-[#C8E3E2]">
              {current.name[0].toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-xs font-600 mt-1.5">{current.name}</span>
      </div>
    )
  }

  const renderArrow = () => {
    return (
      <>
        <LeftOutline onClick={toPrev} className={`${styles.leftOutlineStyle} top-[30px] sm:(top-[102px])`} />
        <RightOutline onClick={toNext} className={`${styles.rightOutlineStyle} top-[30px] sm:(top-[102px])`} />
      </>
    )
  }

  let timer = null

  const toNext = (e: any) => {
    e.stopPropagation()
    ref.current?.swipeNext()
  }
  const toPrev = (e: any) => {
    e.stopPropagation()
    ref.current?.swipePrev()
  }

  return (
    <div className="relative">
      {/* h5 */}
      <SuspendMenu
        dateString={dateString}
        onLocateClick={onLocateClick}
        setShowTime={setShowTime}
        showTime={showTime}
      />
      {/* pc */}
      <PcSuspendMenu
        dateString={dateString}
        setDateString={setDateString}
        onLocateClick={onLocateClick}
        setShowTime={setShowTime}
        showTime={showTime}
        setOpen={setOpen}
      />
      <Spin spinning={loading}>
        <div className="w-[100%] <sm:(shadow-sm) fixed z-9 bg-[#FFF] sm:(pt-75px w-[97%]) ">
          {employeeDoubleList.length === 0 && !loading && !employeeLoading && (
            <div className="<sm:(hidden) flex items-center justify-center h-22">
              <div
                onClick={() => navigate('/manage/add/employee')}
                className="h-50px bg-[#f4f6f6] rounded-lg flex items-center px-4 cursor-pointer"
              >
                <div className="w-34px h-34px rounded-full bg-[#cdd3d3] flex justify-center items-center">
                  <SvgIcon name="add-new" className="w-12px h-16px" style={{ color: '#fff' }} />
                </div>
                <div className="px-2">开始添加新的员工吧！</div>
                <RightOutline />
              </div>
            </div>
          )}
          {employeeTotal >= 10 && size?.width && size?.width >= 640 ? renderArrow() : null}

          <Swiper
            ref={ref}
            className="flex-shrink-0 w-auto sm:(mx-16)"
            indicator={() => <></>}
            onIndexChange={onIndexChange}
          >
            {employeeDoubleList.map((item, index) => (
              <Swiper.Item key={index}>
                <div className="flex items-center h-[90px] justify-center" id="swiper-first">
                  {/* H5 */}
                  {size?.width && size?.width < 640 && employeeLeftContainer(item)}
                  {/* H5 */}
                  {item.length > 1 && size?.width && size?.width < 640 ? employeeRightContainer(item) : null}
                  {/* pc */}
                  {size?.width &&
                    size?.width >= 640 &&
                    item.map((el: any) => {
                      return (
                        <Dropdown
                          key={Math.random()}
                          menu={{
                            items,
                          }}
                          overlayStyle={{
                            minWidth: 164,
                          }}
                          trigger={['click']}
                          placement="bottom"
                        >
                          {employeePcContainer(el)}
                        </Dropdown>
                      )
                    })}
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
        <div className="flex py-[90px] sm:(overflow-x-hidden pt-[180px])" ref={refReserve} id="reserve">
          <div className="flex flex-col flex-shrink-0 w-[64px] pr-2">{renderTimeLabel()}</div>
          {/* 由于没有回调函数判断是左滑还是右滑动 我们用三个相同swiper来判断用户是左还是右 1-0 0-2 2-1 左 1-2 0-1 2-0右 */}
          <Swiper
            loop
            indicator={() => <></>}
            onIndexChange={(index) => {
              setCurrentSwiperIndex(index)
              // 向右 日期+1
              if (
                (index === 2 && currentSwiperIndex === 1) ||
                (index === 1 && currentSwiperIndex === 0) ||
                (index === 0 && currentSwiperIndex === 2)
              ) {
                // 切换日期
                // const time = moment(dateString).add(1, 'days').format('YYYY-MM-DD')
                // setDateString(dayjs(time).format('YYYY-MM-DD'))
                // 切换员工swiper
                ref.current?.swipeTo(page + 1)
              }
              // 向左 日期-1
              if (
                (index === 1 && currentSwiperIndex === 2) ||
                (index === 2 && currentSwiperIndex === 0) ||
                (index === 0 && currentSwiperIndex === 1)
              ) {
                // 切换日期
                // const time = moment(dateString).add(-1, 'days').format('YYYY-MM-DD')
                // setDateString(dayjs(time).format('YYYY-MM-DD'))
                // 切换员工swiper
                ref.current?.swipeTo(page - 1)
              }
            }}
            defaultIndex={1}
          >
            <Swiper.Item key={0}>
              <div className="flex w-full sm:(hidden)">
                <div className="flex-grow relative z-1">{renderTimeGrid(reservationListLeft, leftId)}</div>
                {employeeDoubleList[page]?.length > 1 && (
                  <div className="flex-grow relative">{renderTimeGrid(reservationListRight, rightId)}</div>
                )}
              </div>
              <div className="flex w-full <sm:(hidden)">
                {employeeDoubleList[page]?.map((el: any) => {
                  return (
                    <div key={Math.random()} className="flex-grow relative z-1">
                      {renderTimeGrid(parseOrdersNRest(el.id), el.id)}
                    </div>
                  )
                })}
              </div>
            </Swiper.Item>
            <Swiper.Item key={1}>
              <div className="flex w-full sm:(hidden)">
                <div className="flex-grow relative z-1">{renderTimeGrid(reservationListLeft, leftId)}</div>
                {employeeDoubleList[page]?.length > 1 && (
                  <div className="flex-grow relative">{renderTimeGrid(reservationListRight, rightId)}</div>
                )}
              </div>
              <div className="flex w-full <sm:(hidden)">
                {employeeDoubleList[page]?.map((el: any) => {
                  return (
                    <div key={Math.random()} className="flex-grow relative z-1">
                      {renderTimeGrid(parseOrdersNRest(el.id), el.id)}
                    </div>
                  )
                })}
              </div>
            </Swiper.Item>
            <Swiper.Item key={2}>
              <div className="flex w-full sm:(hidden)">
                <div className="flex-grow relative z-1">{renderTimeGrid(reservationListLeft, leftId)}</div>
                {employeeDoubleList[page]?.length > 1 && (
                  <div className="flex-grow relative">{renderTimeGrid(reservationListRight, rightId)}</div>
                )}
              </div>
              <div className="flex w-full <sm:(hidden)">
                {employeeDoubleList[page]?.map((el: any) => {
                  return (
                    <div key={Math.random()} className="flex-grow relative z-1">
                      {renderTimeGrid(parseOrdersNRest(el.id), el.id)}
                    </div>
                  )
                })}
              </div>
            </Swiper.Item>
          </Swiper>
        </div>
      </Spin>
      {/* 员工弹窗 */}
      <HiilpActionSheet
        actions={[
          {
            text: (
              <div className="flex flex-col justify-center items-center">
                <HiilpAvatar
                  name={selectEmployInfo?.name}
                  headurl={selectEmployInfo?.avatar}
                  sx={{ width: 52, height: 52 }}
                />
                <p className="text-xs py-1">{selectEmployInfo?.name}</p>
                {(selectEmployInfo?.type === 1 || userInfo?.user_type === 1) && (
                  <div
                    onClick={async () => {
                      const res = await ManageApi.staffOnline({
                        id: selectEmployInfo.id,
                      })
                      if (res.status === 200) {
                        Toast.show(res.msg)
                        setSheetVisible(false)
                        refresh()
                        if (size?.width && size?.width >= 640) {
                          initPcEmployeeData()
                        } else {
                          initEmployeeData()
                        }
                      }
                    }}
                    className="flex border border-solid px-1 justify-center items-center bg-[#fff] rounded-xl"
                  >
                    <p className="text-color-[#8c8c8c] text-xs pr-1">
                      {selectEmployInfo?.online === 1 ? '上线' : '下线'}
                    </p>
                    <span
                      className={`${selectEmployInfo?.online === 1 ? 'bg-[#2A4948]' : 'bg-[#970D0D]'} p-1 rounded-full`}
                    ></span>
                  </div>
                )}
              </div>
            ),
            key: 'info',
          },
          {
            text: '编辑资料',
            key: 'view',
            onClick: () => {
              setSheetVisible(false)
              // 商家账号
              if (userInfo?.user_type === 2) {
                navigate('/manage/add/employee/information', {
                  state: { id: selectEmployInfo?.id },
                })
              }
              // 个人账号
              if (userInfo?.user_type === 1) {
                navigate('/personal/information')
              }
            },
          },
          {
            text: '添加新预约',
            key: 'add',
            onClick: () => {
              setSheetVisible(false)
              navigate('/calendar/add/order', {
                state: {
                  employeeId: selectEmployInfo?.id,
                  dateString,
                },
              })
            },
          },
          {
            text: '添加新休息时间',
            key: 'add-time',
            onClick: () => {
              setSheetVisible(false)
              if (size?.width && size?.width > 640) {
                setOpen(true)
              } else {
                navigate('/calendar/add/break', {
                  state: { dateString, employeeId: selectEmployInfo?.id },
                })
              }
            },
          },
          {
            text: '更改工作时间',
            key: 'add-work-time',
            onClick: () => {
              setSheetVisible(false)
              navigate('/calendar/plan')
            },
          },
        ]}
        visible={sheetVisible}
        setVisible={setSheetVisible}
      />
      {/* pc 添加休息时间弹窗 */}
      <Modal open={open} width={365} footer={null} onCancel={() => setOpen(false)}>
        <PcAddBreakForm
          dateString={dateString}
          setOpen={setOpen}
          employeeId={selectEmployInfo?.id}
          initSubscribeData={initSubscribeData}
          open={open}
        />
      </Modal>
    </div>
  )
}

export default ReserveCalendar
