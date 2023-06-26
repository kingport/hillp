import React from 'react'
import { Button } from 'antd-mobile'

import SvgIcon from '@/components/SvgIcon'
import HeaderNav from '@/components/HeaderNav'
import RateModal from '../components/RateModal'

import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import CalendarApi from '@/http/api/calendar'
import moment from 'moment'
import Ellipseing from '@/components/Ellipseing'
import HiilpAvatar from '@/components/HiilpAvatat'

const ViewBooking = () => {
  const locaction: any = useLocation()
  const navigate = useNavigate()

  const { data: res, loading } = useRequest(() => CalendarApi.getSubscribeDetail({ id: locaction?.state?.id }))

  // 拒绝接单
  const { runAsync: refuseRunAsync } = useRequest(() => CalendarApi.editOrder({ source: 1, id: res?.data?.id }), {
    manual: true,
    onSuccess() {
      navigate('/calendar')
    },
  })
  // 接受接单
  const { runAsync: receiveRunAsync } = useRequest(() => CalendarApi.editOrder({ source: 7, id: res?.data?.id }), {
    manual: true,
  })

  if (loading) return <></>

  return (
    <div className={`${styles.viewBooking} bg-[#fff] pt-[48px]`}>
      <HeaderNav renderLeft={false} />
      <div className="px-[46px] pt-[48px] pb-[100px]">
        <div className="h-24">
          <p className="font-600 text-[#2A4948] text-2xl ">
            {moment(res?.data?.start_time * 1000).format('YYYY年MM月DD日')}
          </p>
          <p className="text-[#9A9A9A]">{moment(res?.data?.start_time * 1000).format('HH:mm')}</p>
        </div>

        <div className="text-xs">
          <p className="text-[#777777] font-600 h24">{res?.data?.client_name}</p>
          <p className="text-[#848484]">
            {res?.data?.server_type === 1 && '堂食'}
            {res?.data?.server_type === 2 && '外卖'}，与{res?.data?.staff_name} {res?.data?.duration / 60}小时的预约
          </p>
        </div>

        <div className="border-b my-4"></div>

        <div className="text-xs text-[#777777]">
          <div className="flex justify-between h24">
            <div>
              <span className="font-600">基础服务：</span>
              <span>{res?.data?.basics_server}</span>
            </div>
            <div>${res?.data?.basics_price}</div>
          </div>

          <div className="flex justify-between h24">
            <div>
              <span className="font-600">额外服务：</span>
              <span>{res?.data?.extra_server}</span>
            </div>
            <div>${res?.data?.extra_price}</div>
          </div>

          <div className="flex justify-between h24">
            <div>
              <span className="font-600">定金</span>
            </div>
            <div>${res?.data?.earnest}</div>
          </div>
        </div>

        <div className="border-b my-4"></div>

        <div className="font-600 flex justify-between h24">
          <p>{res?.data?.duration / 60}hr</p>
          <p>${res?.data?.pay_amount}</p>
        </div>

        <div className="text-xs mb-2 text-[#B7B7B7]">
          订单号#{res?.data?.order_no} {moment(res?.data?.start_time * 1000).format('YYYY/MM/DD hh:mm:ss')}
        </div>

        <div className="text-xs mt-4 text-[#464646]">
          <div className="h24">
            <span className="font-600">地址：</span>
            <span className="text-[#77777]">{res?.data?.address}</span>
          </div>

          <div className="h24">
            <span className="font-600">备注：</span>
            <span className="text-[#77777]">{res?.data?.remark}</span>
          </div>
        </div>

        <div className="border-b my-6"></div>

        <div
          onClick={() => {
            navigate('/manage/customer/info', {
              state: { id: res?.data?.client_id, type: 'onlineCustomer', source: res?.data?.source },
            })
          }}
          className="text-xs flex justify-between items-center"
        >
          <div className="flex justify-between items-center">
            <div className="border border-solid  rounded-[50%] p-px mr-4">
              <HiilpAvatar
                name={res?.data?.client_name}
                sx={{ width: 40, height: 40 }}
                headurl={res?.data?.client_head}
              />
            </div>
            <div>
              <p>{res?.data?.client_name}</p>
              <p>{res?.data?.client_email}</p>
            </div>
          </div>

          <SvgIcon name="verify-right" className="w-1.5 h-[10px]" />
        </div>
      </div>

      {res?.data?.status === 5 && (
        <div className="fixed-b-btn flex justify-around">
          <RateModal name={res?.data?.staff_name} id={res?.data?.staff_id} />
          <Button
            className="w-[35%]"
            shape="rounded"
            block
            type="submit"
            size="large"
            color="primary"
            loadingIcon={<></>}
            onClick={() => {
              navigate('/calendar/pay', {
                state: {
                  pay_amount: res?.data?.pay_amount,
                },
              })
            }}
          >
            结付
          </Button>
        </div>
      )}

      {res?.data?.status === 1 && (
        <div className="fixed-b-btn flex justify-around">
          <Button
            loading="auto"
            loadingIcon={<Ellipseing />}
            className="w-[35%] border-0 text-[#2A4948] bg-[#F3F3F3]"
            shape="rounded"
            block
            size="large"
            onClick={async () => {
              await refuseRunAsync()
            }}
          >
            拒绝接单
          </Button>
          <Button
            onClick={async () => {
              await receiveRunAsync()
            }}
            className="w-[35%]"
            shape="rounded"
            block
            type="submit"
            size="large"
            color="primary"
            loading="auto"
            loadingIcon={<Ellipseing />}
          >
            接受订单
          </Button>
        </div>
      )}
    </div>
  )
}

export default ViewBooking
