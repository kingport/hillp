import React, { RefObject } from 'react'
import { Picker, PickerRef, Calendar, Popup, Form, InfiniteScroll, Modal, Image } from 'antd-mobile'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useGetState, useRequest, useSize, useUpdateEffect } from 'ahooks'
import ManageApi from '@/http/api/manage'
import CalendarApi from '@/http/api/calendar'
import PickerContent from './PickerContent'
import HiilpModal from '@/components/HiilpModal'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'
import styles from './index.module.scss'
import { stringAvatar } from '@/utils/util'
import { map, max } from 'lodash'
import { TimePicker, DatePicker, Popover } from 'antd'
import dayjs from 'dayjs'
import { LeftOutline, RightOutline } from 'antd-mobile-icons'

let selectedDate = moment().format('YYYY/MM/DD')
let selectedEmployee = 0
let selectedSchedule = 0
const { RangePicker } = DatePicker

function PlanCalendar() {
  const navigate = useNavigate()
  const [formInstance] = Form.useForm()
  const userInfo = store.getState().global.userInfo
  const { runAsync: getEmployeeAsync } = useRequest(ManageApi.getStaffSelect, {
    manual: true,
  })
  const { runAsync: getScheduleAsync } = useRequest(CalendarApi.scheduleList, {
    manual: true,
  })
  const { runAsync: saveScheduleAsync } = useRequest(CalendarApi.saveSchedule, {
    manual: true,
    onSuccess() {
      setModalVisible(false)
      setCount(1)
      setEmployeeScheduleList([])
      formInstance.resetFields()
    },
  })
  const { runAsync: editScheduleAsync } = useRequest(CalendarApi.editSchedule, {
    manual: true,
    onSuccess() {
      setCount(1)
      setEmployeeScheduleList([])
      setModalVisible(false)
    },
  })
  const { runAsync: deleteScheduleAsync } = useRequest(CalendarApi.deleteSchedule, {
    manual: true,
    onSuccess() {
      setCount(1)
      setModalVisible(false)
      setEmployeeScheduleList([])
    },
  })

  const [modalVisible, setModalVisible] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [employeeScheduleList, setEmployeeScheduleList] = useState<any[]>([])
  const [employeeList, setEmployeeList] = useState<any[]>([])
  const [selectEmployeeId, setSelectEmployeeId] = useState<any>('0')
  const [timeColumns] = useState(() => {
    const hourColumn = []
    const minuteColumn = []

    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        const hourValue = String(i)
        hourColumn.push({ label: hourValue, value: hourValue })
      }
      const minuteValue = i < 10 ? `0${i}` : String(i)
      minuteColumn.push({ label: minuteValue, value: minuteValue })
    }
    return [hourColumn, minuteColumn]
  })
  const [hasMore, setHasMore] = useState(true)
  const [employee, setEmployee] = useState('0')
  const [modalTitle, setModalTitle] = useState('')
  const [modalActions, setModalActions] = useState<any[]>([])
  const [modalContent, setModalContent] = useState<any>(null)
  const [date, setDate] = useState<any[]>([moment().format('YYYY/MM/DD'), moment().add(6, 'days').format('YYYY/MM/DD')])
  const [count, setCount] = useGetState(1)
  const [nameLen, setNamelen] = useState<any>(1)
  const size: any = useSize(document.querySelector('body'))

  const onScheduleDelete = async () => {
    await deleteScheduleAsync({
      id: selectedSchedule,
    })
  }

  // 提交排班时间
  const onFinish = async (values: any) => {
    const startTimeUnix =
      size?.width >= 640
        ? dayjs(`${selectedDate} ${dayjs(values.start_time).format('H:mm')}`).unix()
        : moment(`${selectedDate} ${values.start_time[0]}:${values.start_time[1]}`, 'YYYY/MM/DD H:mm').unix()
    const endTimeUnix =
      size?.width >= 640
        ? dayjs(`${selectedDate} ${dayjs(values.end_time).format('H:mm')}`).unix()
        : moment(`${selectedDate} ${values.end_time[0]}:${values.end_time[1]}`, 'YYYY/MM/DD H:mm').unix()
    const result = selectedSchedule
      ? await editScheduleAsync({
          staff_id: selectedEmployee,
          id: selectedSchedule,
          start_time: startTimeUnix,
          end_time: endTimeUnix,
        })
      : await saveScheduleAsync({
          staff_id: selectedEmployee,
          start_time: startTimeUnix,
          end_time: endTimeUnix,
        })
  }

  // 显示时间选择
  const onPickerClick = (_e: any, ref: RefObject<PickerRef>) => {
    ref.current && ref.current.open()
  }

  const onModalShow = (employeeId: number, dateIndex: number, scheduleId: number) => {
    let initialValues: any = {
      start_time: [],
      end_time: [],
    }
    const basicActions: any[] = [
      {
        text: '取消',
        key: 'cancel',
        onClick: () => {
          setModalVisible(false)
        },
      },
      {
        text: '保存',
        key: 'save',
        primary: true,
        onClick: () => {
          formInstance.submit()
        },
      },
    ]
    if (scheduleId) {
      const selectedScheduleItem = employeeScheduleList.find((item: any) => String(item.id) === String(employeeId))
      const selectedScheduleDate = selectedScheduleItem.children[dateIndex]
      const selectedStartMoment = moment.unix(selectedScheduleDate[0].start_time)
      const selectedEndMoment = moment.unix(selectedScheduleDate[0].end_time)

      initialValues = {
        start_time: [selectedStartMoment.format('H'), selectedStartMoment.format('mm')],
        end_time: [selectedEndMoment.format('H'), selectedEndMoment.format('mm')],
      }

      if (size?.width > 640) {
        initialValues = {
          start_time: dayjs(`${selectedStartMoment.format('H')}:${selectedStartMoment.format('mm')}`, 'H:mm'),
          end_time: dayjs(`${selectedEndMoment.format('H')}:${selectedEndMoment.format('mm')}`, 'H:mm'),
        }
      }

      basicActions.unshift({
        text: '删除',
        key: 'delete',
        danger: true,
        onClick: () => {
          const confirmModal = Modal.show({
            content: <span className="text-base font-600">确认删除此排班</span>,
            actions: [
              {
                text: '取消',
                key: 'cancel_delete',
                onClick: () => {
                  confirmModal.close()
                },
              },
              {
                text: '确认',
                key: 'confirm_delete',
                primary: true,
                onClick: async () => {
                  await onScheduleDelete()
                  confirmModal.close()
                  setModalVisible(false)
                },
              },
            ],
          })
        },
      })
    } else {
      // 默认时间
      initialValues = {
        start_time: [moment().format('H'), moment().format('mm')],
        end_time: [
          moment().format('H'),
          moment(moment().unix() * 1000)
            .add(1, 'minutes')
            .format('mm'),
        ],
      }

      if (size?.width > 640) {
        initialValues = {
          start_time: dayjs(`${moment().format('H')}:${moment().format('mm')}`, 'H:mm'),
          end_time: dayjs(
            `${moment().format('H')}:${moment(moment().unix() * 1000)
              .add(1, 'minutes')
              .format('mm')}`,
            'H:mm'
          ),
        }
      }
    }

    formInstance.setFieldsValue(initialValues)

    setModalContent(
      <Form
        className={styles.ModalForm}
        requiredMarkStyle="none"
        layout="horizontal"
        form={formInstance}
        onFinish={onFinish}
      >
        <div className="flex w-[100%]">
          <div className="flex flex-col w-[50%] pr-1">
            <span className="text-xs font-600 pl-1 pb-1">开始时间</span>
            {size?.width >= 640 ? (
              <Form.Item name="start_time" rules={[{ required: true }]}>
                <TimePicker size="small" defaultValue={dayjs('12:08', 'H:mm')} format={'H:mm'} />
              </Form.Item>
            ) : (
              <Form.Item name="start_time" trigger="onConfirm" rules={[{ required: true }]} onClick={onPickerClick}>
                <Picker columns={timeColumns}>{(items) => <PickerContent val={items} textType="time" />}</Picker>
              </Form.Item>
            )}
          </div>
          <div className="flex flex-col w-[50%] pl-1">
            <span className="text-xs font-600 pl-1 pb-1">结束时间</span>
            {size?.width >= 640 ? (
              <Form.Item name="end_time" rules={[{ required: true }]}>
                <TimePicker size="small" defaultValue={dayjs('12:08', 'H:mm')} format={'H:mm'} />
              </Form.Item>
            ) : (
              <Form.Item name="end_time" trigger="onConfirm" rules={[{ required: true }]} onClick={onPickerClick}>
                <Picker columns={timeColumns}>{(items) => <PickerContent val={items} textType="time" />}</Picker>
              </Form.Item>
            )}
          </div>
        </div>
      </Form>
    )
    setModalActions(basicActions)
    setModalTitle(scheduleId ? '编辑排班' : '添加排班')
    setModalVisible(true)
  }

  const onScheduleClick = (employeeId: number, dateIndex: number, scheduleId: number) => {
    selectedEmployee = employeeId
    selectedDate = moment(date[0], 'YYYY/MM/DD').add(dateIndex, 'days').format('YYYY/MM/DD')
    if (scheduleId) {
      selectedSchedule = scheduleId
      onModalShow(employeeId, dateIndex, scheduleId)
    } else {
      selectedSchedule = 0
      onModalShow(employeeId, dateIndex, scheduleId)
    }
  }

  const onEmployeeClick = (id: number) => {
    // 商家
    if (userInfo?.user_type === 2) {
      navigate('/manage/employee/info', { state: { id } })
    }
    // 个人
    if (userInfo?.user_type === 1) {
      navigate('/personal/information')
    }
  }

  const parseEmployeeItem = (item: any) => ({
    value: String(item.staff_id || item.user_id || item?.id),
    label: item.nickname,
    avatar: item.head || '',
  })

  const renderHeader = () => {
    const headerItems = ['员工']
    let currentMoment = moment(date[0], 'YYYY/MM/DD')
    const endMoment = moment(date[1], 'YYYY/MM/DD')
    while (currentMoment.isSameOrBefore(endMoment)) {
      headerItems.push(currentMoment.format('dddd YYYY/MM/DD'))
      currentMoment = currentMoment.add(1, 'day')
    }

    return headerItems.map((item, index) => (
      <div
        key={index}
        className={`${styles.CalendarScheduleItem} flex flex-shrink-0 items-center justify-center bg-[#fff] sm:(border border-solid border-color-[#e9e9e9] border-r-0 border-l-0 py-3)`}
        style={{
          width: index === 0 ? (nameLen * 18 < 120 ? 120 : nameLen * 18) : 145,
          borderLeft: index === 0 ? '1px solid #e9e9e9' : 'none',
        }}
      >
        {item}
      </div>
    ))
  }

  const renderItem = (item: any, key: any) => {
    const content = (
      <div className="flex flex-col">
        <div className="flex items-center">
          <p className="w-100px text-color-[#2A4948] opacity-80">{item?.nickname}</p>
          <SvgIcon
            name="online"
            className="w-[24px] h-[15px] ml-[6px] flex-shrink-0"
            style={{ visibility: item.isOnline ? 'visible' : 'hidden' }}
          />
        </div>
        <div>
          <p>{item?.email || '--'}</p>
          <p>{item?.phone || '--'}</p>
        </div>
      </div>
    )
    return (
      <div key={key} className="flex">
        {size?.width >= 640 ? (
          <Popover content={content} placement="rightTop">
            <div
              className={`${styles.CalendarScheduleItem} flex cursor-pointer flex-shrink-0 items-center justify-center px-[6px] sm:(border border-solid border-color-[#e9e9e9] border-r-0 border-t-0 border-b-0 py-3)`}
              style={{ width: nameLen * 18 < 120 ? 120 : nameLen * 18 }}
              onClick={() => {
                onEmployeeClick(item.id)
              }}
            >
              <div className="flex flex-shrink-0 items-center justify-center w-[22px] h-[22px] border-[1.5px] border-solid border-color-[#C8E3E2] rounded-full">
                {item.head ? (
                  <img className="w-[19px] h-[19px] rounded-full" style={{ objectFit: 'cover' }} src={item.head} />
                ) : (
                  <div className="flex items-center justify-center w-[19px] h-[19px] bg-[#C8E3E24D] rounded-full text-sm text-color-[#C8E3E2]">
                    {stringAvatar(item?.nickname).children}
                  </div>
                )}
              </div>
              <span className="ml-[6px] text-left flex-grow sm:(text-16px)">{item.nickname}</span>
              <SvgIcon
                name="online"
                className="w-[24px] h-[15px] ml-[6px] flex-shrink-0"
                style={{ visibility: item.isOnline ? 'visible' : 'hidden' }}
              />
            </div>
          </Popover>
        ) : (
          <div
            className={`${styles.CalendarScheduleItem} flex cursor-pointer flex-shrink-0 items-center justify-center px-[6px] sm:(border border-solid border-color-[#e9e9e9] border-r-0 border-t-0 border-b-0 py-3)`}
            style={{ width: nameLen * 18 < 120 ? 120 : nameLen * 18 }}
            onClick={() => {
              onEmployeeClick(item.id)
            }}
          >
            <div className="flex flex-shrink-0 items-center justify-center w-[22px] h-[22px] border-[1.5px] border-solid border-color-[#C8E3E2] rounded-full">
              {item.head ? (
                <img className="w-[19px] h-[19px] rounded-full" style={{ objectFit: 'cover' }} src={item.head} />
              ) : (
                <div className="flex items-center justify-center w-[19px] h-[19px] bg-[#C8E3E24D] rounded-full text-sm text-color-[#C8E3E2]">
                  {stringAvatar(item?.nickname).children}
                </div>
              )}
            </div>
            <span className="ml-[6px] text-left flex-grow sm:(text-16px)">{item.nickname}</span>
            <SvgIcon
              name="online"
              className="w-[24px] h-[15px] ml-[6px] flex-shrink-0"
              style={{ visibility: item.isOnline ? 'visible' : 'hidden' }}
            />
          </div>
        )}

        {item.children.map((child: any[], index: number) => (
          <div
            key={index}
            className={`${styles.CalendarScheduleItem} cursor-pointer flex flex-col flex-shrink-0 justify-center`}
            style={{ width: 145 }}
            onClick={() => {
              onScheduleClick(item.id, index, child && child[0] ? child[0].id : 0)
            }}
          >
            {child && child[0] ? (
              <div className={`${styles.CalendarScheduleLabel} sm:(min-h-36px !leading-9)`}>
                {moment.unix(child[0].start_time).format('H:mm')}-{moment.unix(child[0].end_time).format('H:mm')}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  const requestLoadMore = async () => {
    const employeeScheduleItems: any = []
    const scheduleData = await getScheduleAsync({
      start_time: moment(date[0], 'YYYY/MM/DD').unix(),
      end_time: moment(date[1], 'YYYY/MM/DD').unix(),
      staff_id: selectEmployeeId,
      page: count,
    })
    if (scheduleData && scheduleData.data.data) {
      scheduleData?.data?.data.map((item: any) => {
        const { list = [] } = item
        employeeScheduleItems.push({
          ...item,
          isOnline: item.online === 1,
          children: list.map((item: any) => item.schedule),
        })
      })
    }
    setCount((count) => count + 1)
    setEmployeeScheduleList(employeeScheduleList.concat(employeeScheduleItems))
    setHasMore(scheduleData.data.data.length > 0)
  }

  useUpdateEffect(() => {
    setEmployeeScheduleList([])
    requestLoadMore()
  }, [employee, date, selectEmployeeId])

  useEffect(() => {
    if (count === 1 && employeeScheduleList.length === 0) {
      requestLoadMore()
    }
  }, [count, employeeScheduleList.length])

  useEffect(() => {
    const initEmployeeData = async () => {
      const baseEmployeeList = [{ label: '全部员工', value: '0' }]
      if (userInfo && userInfo.user_type === 1) {
        setEmployeeList([...baseEmployeeList, parseEmployeeItem(userInfo)])
      } else if (userInfo && userInfo.user_type === 2) {
        const { data: employeeData } = await getEmployeeAsync({})
        // 名字合集
        const namesArr: any = []
        map(employeeData, function (o) {
          namesArr.push(o.nickname.length)
        })
        setNamelen(max(namesArr))
        setEmployeeList(baseEmployeeList.concat(employeeData.map((item: any) => parseEmployeeItem(item))))
      }
    }

    initEmployeeData()
  }, [userInfo, userInfo.user_type])

  return (
    <div className="min-w-[100%] bg-[#FFF] pb-[90px] relative sm:(flex flex-col justify-center items-center pb-0)">
      <div className="w-[100%] bg-[#FFF] shadow-sm pt-4 pb-8 px-12 fixed z-9 sm:(hidden)">
        <div
          className="bg-[#2A49480D] rounded-[10px] px-6 mb-4 h-10 flex flex-col justify-center text-xs"
          onClick={() => {
            setPickerVisible(true)
          }}
        >
          <Picker
            columns={[employeeList]}
            value={[selectEmployeeId]}
            visible={pickerVisible}
            onConfirm={(val) => {
              setCount(1)
              setSelectEmployeeId(val[0])
              setEmployeeScheduleList([])
            }}
            onClose={() => {
              setPickerVisible(false)
            }}
          >
            {(items) => <PickerContent val={items} textType="normal" />}
          </Picker>
        </div>
        <div
          className="bg-[#2A49480D] rounded-[10px] px-6 h-10 flex items-center justify-between text-xs"
          onClick={() => {
            setCalendarVisible(true)
          }}
        >
          <SvgIcon name="verify-right" className="w-[6px] h-[12px] transform rotate-z-180" />
          <span className="text-xs">
            {date[0]}-{date[1]}
          </span>
          <SvgIcon name="verify-right" className="w-[6px] h-[12px]" />
        </div>
      </div>
      {/* PC */}
      <div className="sm:(mt-124px)">
        <div className="sm:(py-2 flex justify-end)">
          <div className="flex items-center bg-[#fff] shadow-sm rounded-md px-2">
            <LeftOutline
              onClick={() => {
                const lastWeekDate = [
                  dayjs(date[0]).add(-6, 'day').format('YYYY/MM/DD'),
                  dayjs(date[0]).format('YYYY/MM/DD'),
                ]
                setCount(1)
                setDate(lastWeekDate)
              }}
              className="cursor-pointer"
            />
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              value={[dayjs(date[0]), dayjs(date[1])]}
              onChange={(time) => {
                if (time) {
                  setCount(1)
                  setDate([dayjs(time[0]).format('YYYY/MM/DD'), dayjs(time[1]).format('YYYY/MM/DD')])
                }
              }}
              bordered={false}
              size="large"
            />
            <RightOutline
              onClick={() => {
                const nextWeekDate = [
                  dayjs(date[1]).format('YYYY/MM/DD'),
                  dayjs(date[1]).add(6, 'day').format('YYYY/MM/DD'),
                ]
                setCount(1)
                setDate(nextWeekDate)
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="min-w-[100%] pt-[144px] max-h-[85vh] overflow-scroll sm:(min-w-0 pt-0 overflow-x-scroll max-w-1000px relative)">
          <div className="flex text-xs font-600 sticky top-0 bg-[#fff]">{renderHeader()}</div>
          {employeeList && employeeList.length ? (
            <div className="flex flex-col text-xs">
              {employeeScheduleList.map((item: any, index) => renderItem(item, index))}
              <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
            </div>
          ) : null}
        </div>
      </div>
      <Popup visible={calendarVisible} onMaskClick={() => setCalendarVisible(false)} bodyStyle={{ height: 'auto' }}>
        <Calendar
          value={date as [Date, Date]}
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
            setCount(1)
            setDate([moment(val[0]).format('YYYY/MM/DD'), moment(val[1]).format('YYYY/MM/DD')])
          }}
        />
      </Popup>
      <HiilpModal
        visible={modalVisible}
        showCloseButton={true}
        onClose={() => {
          setModalVisible(false)
        }}
        title={modalTitle}
        content={modalContent}
        actions={modalActions}
      />
    </div>
  )
}

export default PlanCalendar
