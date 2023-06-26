import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import CalendarApi from '@/http/api/calendar'
import { getWeek } from '@/utils/util'
import { useRequest } from 'ahooks'
import { Skeleton } from 'antd'
import { Avatar, Divider } from 'antd-mobile'
import moment from 'moment'
import React from 'react'

const OrderDetail = () => {
  const location: any = useLocation()
  const navigate = useNavigate()

  const { data: res, loading } = useRequest(() =>
    CalendarApi.getSubscribeDetail({
      id: location?.state?.id,
    })
  )

  if (loading) return <Skeleton />

  return (
    <div className="flex flex-col pt-[48px]">
      <HeaderNav title="" renderLeft={false} />
      <div className="flex flex-col px-10 pt-10">
        <p className="text-2xl font-600">{moment(res?.data?.start_time * 1000).format('YYYY年MM月DD日')}</p>
        <p className="text-color-[#9A9A9A]">
          {getWeek(res?.data?.start_time * 1000)} {moment(res?.data?.start_time * 1000).format('HH:mm')}
        </p>
        <p className="pt-7 text-sm font-600 text-color-[#777]">{res?.data?.client_name}</p>
        <p className="text-xs text-color-[#848484]">
          {res?.data?.server_type === 2 && '外卖'}
          {res?.data?.server_type === 1 && '堂食'}，与 {res?.data?.staff_name} {res?.data?.duration / 60}小时的预约
        </p>
        <Divider />
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center">
            <p className="text-xs font-600 text-color-[#777]">基础服务：</p>
            <p className="text-xs text-color-[#777]">{res?.data?.basics_server}</p>
          </div>
          <p className="text-xs text-color-[#777]">${res?.data?.basics_price}</p>
        </div>
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center">
            <p className="text-xs font-600 text-color-[#777]">额外服务：</p>
            <p className="text-xs text-color-[#777]">{res?.data?.extra_server}</p>
          </div>
          <p className="text-xs text-color-[#777]">${res?.data?.extra_price} </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-xs font-600 text-color-[#777]">定金</p>
          </div>
          <p className="text-xs text-color-[#777]">${res?.data?.earnest}</p>
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <p className="font-600 text-sm">{res?.data?.duration / 60}hr</p>
          <p className="font-600 text-sm">${res?.data?.basics_price}</p>
        </div>
        <p className="text-xs text-color-[#B7B7B7] pt-4">{`订单号# ${res?.data?.order_no} ${moment(
          res?.data?.start_time * 1000
        ).format('YYYY年MM月DD日')} 
        ${getWeek(res?.data?.start_time * 1000)} ${moment(res?.data?.start_time * 1000).format('HH:mm')}`}</p>
        <div className="flex text-xs items-center pt-4">
          <p className="font-600">地址：</p>
          <p className="text-color-[#858585]">{res?.data?.address}</p>
        </div>
        <div className="flex text-xs items-center pt-1 pb-4">
          <p className="font-600">备注：</p>
          <p className="text-color-[#858585]">{res?.data?.remark}</p>
        </div>
        <Divider />
        <div
          onClick={() => {
            //
            navigate('/manage/customer/info', {
              state: { id: res?.data?.client_id, from: 'calendarView', source: res?.data?.source },
            })
          }}
          className="flex justify-between items-center py-2"
        >
          <div className="flex items-center">
            <Avatar src="" style={{ '--size': '40px', '--border-radius': '50%' }} />
            <div className="flex pl-3 flex-col text-xs">
              <p className="text-color-[#333333] font-600">{res?.data?.client_name}</p>
              <p className="text-color-[#999999]">{res?.data?.client_email}</p>
            </div>
          </div>
          <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
        </div>
        <Divider />
        {res?.data?.status === 5 && (
          <>
            {res?.data?.payment.pay_list.map((item: any, index: any) => {
              return (
                <div key={index} className="flex items-center justify-between text-xs text-color-[#777]">
                  <p>{item?.title}</p>
                  <p>{item?.type}</p>
                  <p>${item?.amount}</p>
                </div>
              )
            })}
            <Divider style={{ margin: '4px 0' }} />
            <div className="flex justify-between items-center text-xs">
              <p>总价</p>
              <p>${res?.data?.payment?.total_amount}</p>
            </div>
            <div className="flex justify-between items-center text-xs pt-4 text-color-[#777]">
              <p>介绍人（{res?.data?.payment?.introducer_ratio}）</p>
              <p>{res?.data?.payment?.introducer_amount}</p>
            </div>
            <div className="flex justify-between items-center text-xs text-color-[#777]">
              <p>员工（{res?.data?.payment?.staff_ratio}）</p>
              <p>${res?.data?.payment?.staff_cost}</p>
            </div>
            <Divider />
            <div className="flex justify-between items-center text-sm font-500">
              <p>净收入</p>
              <p>{res?.data?.payment?.retained_amount}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
