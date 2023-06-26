import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd-mobile'
import styles from './index.module.scss'
import moment from 'moment'
import CalendarApi from '@/http/api/calendar'
import { useRequest } from 'ahooks'
import HeaderNav from '@/components/HeaderNav'
import InformationApi from '@/http/api/information'
import PcPayConfirm from './PcPayConfirm'

function CalendarPayConfirm() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const { state } = location

  const onConfirmClick = () => {
    //6-支付订单
    run({
      source: 6,
      params: JSON.stringify(state?.params),
      id: state?.payInfo?.id,
    })
  }

  const { run } = useRequest((params) => CalendarApi.editOrder(params), {
    manual: true,
    onSuccess(res) {
      navigate('/calendar/result')
    },
  })

  const { data: res } = useRequest(() => InformationApi.getInformationList({ type: 3 }))

  return (
    <>
      <div className={`${styles.CalendarPayConfirm} flex flex-col items-center py-[90px] px-10 sm:(hidden)`}>
        <HeaderNav renderLeft={false} />
        <span className="text-2xl font-600 mb-1">订单总结</span>
        <span className="text-xs text-color-[#BCBCBC] mb-16">
          {moment(state?.payInfo?.start_time * 1000).format('YYYY年MM月DD日 HH:mm')}
        </span>
        <div className="w-[100%]">
          <div className={`${styles.BorderedViewItem}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-base text-color-[#606060]">基础服务</span>
                <span className="text-xs text-color-[#B4B4B4]">{state?.payInfo?.basics_server || '--'}</span>
              </div>
              <span className="text-sm text-color-[#606060]">${state?.payInfo?.basics_price || '0.00'}</span>
            </div>
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-base text-color-[#606060]">额外服务</span>
                <span className="text-xs text-color-[#B4B4B4]">{state?.payInfo?.extra_server || '--'}</span>
              </div>
              <span className="text-sm text-color-[#606060]">${state?.payInfo?.extra_price || '0.00'}</span>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-base text-color-[#606060]">定金</span>
              </div>
              <span className="text-sm text-color-[#606060]">${state?.payInfo?.earnest || '0.00'}</span>
            </div>
          </div>
          <div className={`${styles.BorderedViewItem}`}>
            <div className="flex items-start justify-between mb-6">
              <span className="text-base font-600">应收款</span>
              <span className="text-base font-600">${state?.payInfo?.pay_amount || '0.00'}</span>
            </div>
            {state?.params?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-1">
                <p>{res?.data?.find((i: any) => i.id === item?.information_id)?.label}</p>
                <p>${item?.amount}</p>
              </div>
            ))}
          </div>
          <div className={`${styles.BorderedViewItem}`}>
            <div className="flex items-start justify-between mb-6">
              <span className="text-base font-600">总计</span>
              <span className="text-base font-600">${state?.payInfo?.pay_amount || '0.00'}</span>
            </div>
          </div>
        </div>
        <div className="fixed-b-btn">
          <Button className="w-[65%] h-[2.75rem] rounded-3xl" block color="primary" onClick={onConfirmClick}>
            确认
          </Button>
        </div>
      </div>
      <div className="<sm:(hidden)">
        <PcPayConfirm />
      </div>
    </>
  )
}

export default CalendarPayConfirm
