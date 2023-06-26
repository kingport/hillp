import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import moment from 'moment'

interface CalendarSuspendMenuProps {
  onLocateClick: () => void
  dateString?: string
  showTime?: boolean
  setShowTime: (val: boolean) => void
}

function SuspendMenu(props: CalendarSuspendMenuProps) {
  const { onLocateClick, dateString, showTime, setShowTime } = props

  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const navigate = useNavigate()

  const createOpt = () => {
    setMenuVisible(() => !menuVisible)
  }

  useEffect(() => {
    if (showTime) {
      setTimeout(() => {
        setShowTime(false)
      }, 1000)
    }
  }, [showTime])

  return (
    <div className="flex flex-col items-end fixed z-9 bottom-26 right-5 sm:(hidden)">
      <div className={`flex flex-col items-end ${menuVisible ? '' : 'hidden'}`}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]">
              添加休息时间
            </p>
            <div
              onClick={() =>
                navigate('/calendar/add/break', {
                  state: { dateString },
                })
              }
              className="flex shadow-sm cursor-pointer justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center"
            >
              <SvgIcon name="add-break" className="w-[25px] h-[30px]" style={{ color: '#FFF' }} />
            </div>
          </div>
        </div>
        <div className="flex mt-4 flex-col">
          <div className="flex items-center">
            <p className="opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]">添加新预约</p>
            <div
              onClick={() =>
                navigate('/calendar/add/order', {
                  state: {
                    dateString,
                  },
                })
              }
              className="flex cursor-pointer shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center"
            >
              <SvgIcon name="add-order" className="w-[25px] h-[30px]" style={{ color: '#FFF' }} />
            </div>
          </div>
        </div>
      </div>
      <div className={`flex flex-col relative items-end ${menuVisible ? 'hidden' : ''}`}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              onClick={() => {
                setShowTime(true)
                onLocateClick()
              }}
              className="flex cursor-pointer shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#FFF] items-center"
            >
              <SvgIcon name="locate-now" className="w-[30px] h-[30px]" />
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={createOpt}
        className={`flex mt-4 shadow-sm cursor-pointer ${
          menuVisible ? 'bg-[#ffffff]' : 'bg-[#9ECED2]'
        }  w-[64px] h-[64px] rounded-2xl items-center justify-center`}
      >
        <SvgIcon
          name={`${menuVisible ? 'nav-cancel' : 'add'}`}
          className="w-[23px] h-[23px]"
          style={{ color: menuVisible ? '#000' : '#FFF' }}
        />
      </div>
    </div>
  )
}

export default SuspendMenu
