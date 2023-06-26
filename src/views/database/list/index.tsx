import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import styles from '../index.module.scss'
import Order from '../order/Order'
import Employee from '../employee/Employee'
import Finance from '../finance/Finance'
import { Picker } from 'antd-mobile'
import { EMPLOYEE_COLUMNS, FINANCE_COLUMNS, ORDER_COLUMS } from './constant'
import { store } from '@/redux'

function database() {
  const navigator = useNavigate()
  const [tabKey, setTabKey] = useState('order')
  const [orderType, setOrderType] = useState<any>('0')
  const userInfo = store.getState().global.userInfo

  const tabs = [
    {
      id: 1,
      title: '订单',
      key: 'order',
    },
    {
      id: 2,
      title: userInfo?.user_type === 2 ? '员工' : '渠道',
      key: 'employee',
    },
    {
      id: 3,
      title: '财务',
      key: 'finance',
    },
  ]

  const NavRightKanban = () => {
    return (
      <div onClick={() => navigator('/database')} className="flex items-center ">
        <SvgIcon name="kanban" className="w-[15px] h-[15px] mr-1" />
        <p className="text-xs">看板</p>
      </div>
    )
  }

  const NavLeftKanban = () => {
    return (
      <div onClick={selectFilter} className="flex items-center ">
        <SvgIcon name="filter" className="w-[15px] h-[15px] mr-1" />
      </div>
    )
  }
  const NavContentList = () => {
    return (
      <div className={`${styles.tabs} flex items-center`}>
        {tabs.map((tab) => (
          <p
            onClick={() => setTabKey(tab.key)}
            className={`text-xs ml-6 text-color-[#000] ${tabKey === tab?.key && styles.active}`}
            key={tab?.id}
          >
            {tab.title}
          </p>
        ))}
      </div>
    )
  }

  const employeeColumns: any = EMPLOYEE_COLUMNS
  const orderColumns: any = ORDER_COLUMS
  const financeColumns: any = FINANCE_COLUMNS

  const selectFilter = async () => {
    // order
    if (tabKey === 'order') {
      const value: any = await Picker.prompt({
        columns: orderColumns,
        defaultValue: [orderType],
      })
      if (value) {
        setOrderType(value[0])
      }
    }
    // employee
    if (tabKey === 'employee') {
      const value = await Picker.prompt({
        columns: employeeColumns,
        defaultValue: [orderType],
      })
      if (value) {
        setOrderType(value[0])
      }
    }
    // finance
    if (tabKey === 'finance') {
      const value = await Picker.prompt({
        columns: financeColumns,
        defaultValue: [orderType],
      })
      if (value) {
        setOrderType(value[0])
      }
    }
  }

  return (
    <div className="flex flex-col items-center pt-[48px] pb-[90px]">
      <HeaderNav title={<NavContentList />} renderRight={<NavRightKanban />} renderLeft={<NavLeftKanban />} />
      <Order orderType={orderType} tabKey={tabKey} />
      <Employee orderType={orderType} tabKey={tabKey} />
      <Finance orderType={orderType} tabKey={tabKey} />
    </div>
  )
}

export default database
