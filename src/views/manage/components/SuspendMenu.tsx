import React from 'react'
import SvgIcon from '@/components/SvgIcon'

interface SuspendMenuProps {
  accountType: number
}
function SuspendMenu(props: SuspendMenuProps) {
  const { accountType } = props
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const navigate = useNavigate()
  const createOpt = () => {
    //
    setMenuVisible(() => !menuVisible)
  }

  return (
    <div className="flex flex-col items-end fixed bottom-26 right-5">
      <div className={`flex flex-col ${menuVisible ? '' : 'hidden'}`}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]">添加新服务</p>
            <div
              onClick={() => navigate('/manage/add/service')}
              className="flex shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center"
            >
              <SvgIcon name="add-serve" className="w-[25px] h-[30px]" style={{ color: '#FFF' }} />
            </div>
          </div>
        </div>
        <div className="flex mt-4 flex-col">
          <div className="flex items-center">
            <p className="opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]">添加新客户</p>
            <div
              onClick={() => navigate('/manage/add/customer')}
              className="flex shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center"
            >
              <SvgIcon name="add-customer" className="w-[25px] h-[30px]" style={{ color: '#FFF' }} />
            </div>
          </div>
        </div>
        <div className="flex mt-4 flex-col">
          <div className="flex items-center">
            <p className="opacity-80 px-2 py-1 rounded-lg mr-4 text-sm text-color-[#ffffff] bg-[#2A4948]">
              {accountType === 2 && '添加新员工'}
              {accountType === 1 && '添加新渠道'}
            </p>
            <div
              onClick={() => {
                if (accountType === 2) {
                  navigate('/manage/add/employee')
                }
                if (accountType === 1) {
                  navigate('/manage/add/channel')
                }
              }}
              className="flex shadow-sm justify-center w-[64px] h-[64px] rounded-2xl bg-[#2A4948] items-center"
            >
              <SvgIcon
                name={accountType === 1 ? 'add-chanel' : 'add-employee'}
                className="w-[25px] h-[30px]"
                style={{ color: '#FFF' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={createOpt}
        className={`flex mt-4 shadow-sm ${
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
