import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { Dialog, Toast } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

function channel() {
  const navigator = useNavigate()

  // 邮箱邀请权限
  const { data, loading } = useRequest(() => ManageApi.checkPromotion({ type: 2 }))
  // 剩余发布
  const { data: emailIntive, loading: emailLoading } = useRequest(() => ManageApi.checkPromotion({ type: 1 }))

  return (
    <div
      className={`${styles.channel} flex flex-col items-center justify-center pt-[48px] bg-[#fff] sm:(!min-h-[calc(100vh-60px)] !w-500px)`}
    >
      <HeaderNav title={'添加新渠道'} renderRight={false} border onBack={() => navigator('/manage')} />
      <div
        onClick={() => navigator('/manage/add/channel/information')}
        className="flex w-[80%] justify-between items-center px-4 py-4 rounded-xl bg-[#f8f8f8]"
      >
        <div className="flex flex-col">
          <p className="text-sm font-600 text-color-[#2A4948]">手动添加</p>
          <p className="text-xs text-color-[#2A4948]">填写新渠道资料</p>
        </div>
        <SvgIcon name="employee-edit" className="w-[24px] h-[24px]" />
      </div>
      <div
        onClick={() => {
          if (emailLoading) return false
          if (emailIntive?.data?.charge * 1 + emailIntive?.data?.free * 1 > 0) {
            navigator('/manage/employee/intive')
          } else {
            Toast.show('没有额度了')
          }
        }}
        className="flex w-[80%] mt-4 justify-between items-center px-4 py-4 rounded-xl bg-[#f8f8f8]"
      >
        <div className="flex flex-col">
          <p className="text-sm font-600 text-color-[#2A4948]">邮件邀请</p>
          <p className="text-xs text-color-[#2A4948]">通过邮箱邀请渠道创建帐户</p>
        </div>
        <SvgIcon name="employee-sms" className="w-[24px] h-[24px]" />
      </div>
      <div
        onClick={() => {
          if (loading) return false
          let actions = []
          if (data?.data?.free * 1 + data?.data?.charge * 1 === 0) {
            actions = [
              {
                key: 'cancel',
                text: '立即购买',
                className: 'dialog-cancel',
                onClick() {
                  navigator('/personal/auth/sign')
                },
              },
            ]
          } else {
            actions = [
              {
                key: 'cancel',
                text: '立即购买',
                className: 'dialog-cancel',
                onClick() {
                  navigator('/personal/auth/sign')
                },
              },
              {
                key: 'confirm',
                text: '现在发布',
                className: 'dialog-confirm',
                onClick() {
                  navigator('/manage/add/promote')
                },
              },
            ]
          }
          Dialog.show({
            content: (
              <div className="font-600 text-center pb-2 text-xs text-color-[#000]">
                <p>本周免费发布数额仅剩余{data?.data?.free * 1 + data?.data?.charge * 1}条，</p>
                <p>如需发布更多推广信息，</p>
                <p>请点击【立即购买】获取更多发布数额。</p>
              </div>
            ),
            closeOnMaskClick: true,
            closeOnAction: true,
            actions: [actions],
          })
        }}
        className="flex w-[80%] mt-4 justify-between items-center px-4 py-4 rounded-xl bg-[#f8f8f8]"
      >
        <div className="flex flex-col">
          <p className="text-sm font-600 text-color-[#2A4948]">推广至更多渠道</p>
          <p className="text-xs text-color-[#2A4948]">发送推广信息，签约更多渠道</p>
        </div>
        <SvgIcon name="employee-list" className="w-[24px] h-[24px]" />
      </div>
    </div>
  )
}

export default channel
