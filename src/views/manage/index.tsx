import React from 'react'
import HeaderNav from '@/components/HeaderNav'
// import user from '@/store/user'  因为加入了unplugin-auto-import 所以不用在手动导入
import styles from './index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import SuspendMenu from './components/SuspendMenu'
import { store } from '@/redux'

function manage() {
  const navigate = useNavigate()
  const userInfo = store.getState().global.userInfo
  //  1商家 2个人
  const [accountType] = useState<number>(2)
  const accountName = userInfo?.user_type === 1 ? '渠道' : '员工'

  const navigateEmployeeList = () => {
    if (userInfo?.user_type === 1) {
      navigate('/manage/channel/list', { state: { account: accountType } })
    }
    if (userInfo?.user_type === 2) {
      navigate('/manage/employee/list', { state: { account: accountType } })
    }
  }

  const navlList = () => {
    return (
      <div className="flex flex-col">
        <div
          onClick={navigateEmployeeList}
          className="active:bg-[#f9f9fa] flex items-center justify-between py-9 px-11"
        >
          <div className="flex flex-col">
            <p className="text-sm text-color-[#2A4948]">{accountName}列表</p>
            <p className="text-xs text-color-[#646464]">浏览{accountName}信息及状态</p>
          </div>
          <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
        </div>
        <div className="border-b"></div>
        <div
          onClick={() => navigate('/manage/service/list')}
          className="active:bg-[#f9f9fa] flex items-center justify-between py-9 px-11"
        >
          <div className="flex flex-col">
            <p className="text-sm text-color-[#2A4948]">服务列表</p>
            <p className="text-xs text-color-[#646464]">添加或删除服务</p>
          </div>
          <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
        </div>
        <div className="border-b"></div>
        <div
          onClick={() => navigate('/manage/customer/list')}
          className="active:bg-[#f9f9fa] flex items-center justify-between py-9 px-11"
        >
          <div className="flex flex-col">
            <p className="text-sm text-color-[#2A4948]">客户列表</p>
            <p className="text-xs text-color-[#646464]">查看和编辑客户资料</p>
          </div>
          <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.manage} pt-[48px]`}>
      <HeaderNav title={'管理'} border renderLeft={false} renderRight={false} />
      {navlList()}
      <SuspendMenu accountType={userInfo?.user_type} />
    </div>
  )
}

export default manage
