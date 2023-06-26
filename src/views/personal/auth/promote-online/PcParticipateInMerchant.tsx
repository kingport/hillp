import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import PersonalApi from '@/http/api/personal'
import { useRequest } from 'ahooks'
import moment from 'moment'
import React from 'react'
import { NoticeBar } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

const ParticipateIn = () => {
  const navigate = useNavigate()

  const { data: onlineUserInfo } = useRequest(() => PersonalApi.onlineMerchant({}))

  return (
    <div className="flex flex-col pt-[48px] items-center pb-[110px]">
      {/* 是否修改资料 - 添加提示 */}
      {onlineUserInfo?.data?.is_update === 1 && (
        <div className="absolute top-[60px] w-[100%]">
          <NoticeBar
            content={'线上资料正在审核中，审核通过后才会更新资料数据'}
            color="info"
            style={{ fontSize: '12px' }}
          />
        </div>
      )}
      <div className="flex flex-col w-[80%] pt-10 items-center">
        {/*  */}
        <div className="flex flex-col text-color-[#000] px-8 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
          <div className="flex items-center justify-center -mt-18">
            <HiilpAvatar
              name={onlineUserInfo?.data?.online_name}
              headurl={onlineUserInfo?.data?.online_head}
              className="shadow-sm"
            />
          </div>
          <div className="flex flex-col items-center pb-5 pt-2">
            <p className="text-sm">{onlineUserInfo?.data?.online_name}</p>
            <p className="text-xs text-color-[#98a3a3]">商家</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">简介</p>
            <p className="text-sm">{onlineUserInfo?.data?.remark}</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">邮箱</p>
            <p className="text-sm">{onlineUserInfo?.data?.online_email}</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">手机号</p>
            <p className="text-sm">
              {onlineUserInfo?.data?.online_area}&nbsp;
              {onlineUserInfo?.data?.online_phone}
            </p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">地址</p>
            <p className="text-sm">{onlineUserInfo?.data?.online_address}</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">套餐</p>
            <p className="text-sm">
              {onlineUserInfo?.data?.setmeal || '--'}｜有效期至
              {moment(onlineUserInfo?.data?.promotion_endtime * 1000).format('YYYY-MM-DD')}
            </p>
          </div>
          <div
            className="flex cursor-pointer items-center pt-10"
            onClick={() => {
              navigate('/personal/auth/promote/online/edit')
            }}
          >
            <SvgIcon name="edit" className="w-[18px] h-[18px]" />
            <p className="ml-2 text-xs text-color-[#777]">编辑资料</p>
          </div>
          <div onClick={() => navigate(-1)} className="fixed top-120px right-40px">
            <CloseOutline fontSize={24} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipateIn
