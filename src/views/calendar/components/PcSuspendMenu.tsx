import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import moment from 'moment'
import { Button, DatePicker, DatePickerProps, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import dayjs from 'dayjs'
import { getWeek } from '@/utils/util'
import { LeftOutline, RightOutline } from 'antd-mobile-icons'

interface CalendarSuspendMenuProps {
  onLocateClick: () => void
  dateString?: string
  setDateString?: any
  setShowTime: (val: boolean) => void
  showTime?: boolean
  setOpen: any
}

function SuspendMenu(props: CalendarSuspendMenuProps) {
  const { onLocateClick, dateString, setDateString, showTime, setShowTime, setOpen } = props
  const navigate = useNavigate()

  useEffect(() => {
    if (showTime) {
      setTimeout(() => {
        setShowTime(false)
      }, 1000)
    }
  }, [showTime])

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1') {
      navigate('/calendar/add/order', {
        state: {
          dateString,
        },
      })
    }
    if (e.key === '2') {
      setOpen(true)
    }
  }

  const items: MenuProps['items'] = [
    {
      label: '添加新预约',
      key: '1',
    },
    {
      label: '添加新休息时间',
      key: '2',
    },
  ]

  const menuProps = {
    items,
    onClick: handleMenuClick,
  }

  const dateFormat = 'YYYY/MM/DD'
  const customFormat: DatePickerProps['format'] = (value) => {
    return `${getWeek(value.unix() * 1000)} ${value.format(dateFormat)}`
  }

  return (
    <div className="hidden items-center sm:(flex) bg-[#ecefef] fixed top-60px w-full z-99 py-4 justify-between">
      <div className="flex flex-col pl-8">
        <div className="flex items-center">
          <div
            onClick={() => {
              setShowTime(true)
              onLocateClick()
            }}
            className="flex cursor-pointer shadow-sm justify-center w-[40px] h-[40px] rounded-xl bg-[#FFF] items-center"
          >
            <SvgIcon name="locate-now" className="w-[20px] h-[20px]" />
          </div>
        </div>
      </div>
      {/* 日期选择框 */}
      <div className="flex bg-[#fff] items-center rounded-md px-2">
        <LeftOutline
          onClick={() => {
            const lastDate = dayjs(dateString).add(-1, 'day')
            setDateString(lastDate.format('YYYY/MM/DD'))
          }}
          className="cursor-pointer"
        />
        <DatePicker
          onChange={(val) => {
            setDateString(dayjs(val).format('YYYY/MM/DD'))
          }}
          value={dayjs(dateString, dateFormat)}
          style={{ width: 180 }}
          placeholder="请选择时间"
          allowClear={false}
          format={(val) => customFormat(val)}
          className="!bg-[#fff] !rounded-md"
          bordered={false}
        />
        <RightOutline
          onClick={() => {
            const lastDate = dayjs(dateString).add(1, 'day')
            setDateString(lastDate.format('YYYY/MM/DD'))
          }}
          className="cursor-pointer"
        />
      </div>
      <div className={`flex shadow-sm cursor-pointer mr-92px`}>
        <Dropdown menu={menuProps} placement="bottom">
          <Button type="primary">
            <Space>
              添加
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default SuspendMenu
