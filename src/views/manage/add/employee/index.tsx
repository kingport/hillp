import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import ManageApi from '@/http/api/manage'
import { Toast } from 'antd-mobile'

function employee() {
  const navigator = useNavigate()

  const { data } = useRequest(() => ManageApi.checkPromotion({ type: 1 }), {})
  return (
    <div className={`min-h-[90vh] flex flex-col items-center justify-center pt-[48px] bg-[#fff] sm:(w-600px)`}>
      <HeaderNav title={'添加新员工'} renderRight={false} border />
      <div
        onClick={() => navigator('/manage/add/employee/information')}
        className="flex w-[80%] justify-between items-center px-4 py-4 rounded-xl bg-[#f8f8f8] cursor-pointer hover:opacity-80"
      >
        <div className="flex flex-col">
          <p className="text-sm font-600 text-color-[#2A4948]">手动添加</p>
          <p className="text-xs text-color-[#2A4948]">填写新员工资料</p>
        </div>
        <SvgIcon name="employee-edit" className="w-[24px] h-[24px]" />
      </div>
      <div
        onClick={() => {
          if (data?.data?.free * 1 + data?.data?.charge * 1 > 0) {
            navigator('/manage/employee/intive')
          } else {
            Toast.show('次数不够')
          }
        }}
        className="flex w-[80%] mt-4 justify-between items-center px-4 py-4 rounded-xl bg-[#f8f8f8] cursor-pointer hover:opacity-80"
      >
        <div className="flex flex-col">
          <p className="text-sm font-600 text-color-[#2A4948]">邮件邀请</p>
          <p className="text-xs text-color-[#2A4948]">通过邮箱邀请成员创建帐户</p>
        </div>
        <SvgIcon name="employee-sms" className="w-[24px] h-[24px]" />
      </div>
      <div
        onClick={() => navigator('/manage/employee/information/mall')}
        className="flex w-[80%] mt-4 justify-between items-center px-4 py-4 rounded-xl bg-[#f8f8f8] cursor-pointer hover:opacity-80"
      >
        <div className="flex flex-col">
          <p className="text-sm font-600 text-color-[#2A4948]">签约更多员工</p>
          <p className="text-xs text-color-[#2A4948]">进入信息广场与更多员工联系并签约</p>
        </div>
        <SvgIcon name="employee-list" className="w-[24px] h-[24px]" />
      </div>
    </div>
  )
}

export default employee
