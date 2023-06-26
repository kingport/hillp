import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Image } from 'antd-mobile'
import styles from './index.module.scss'
import CalendarApi from '@/http/api/calendar'
import { useRequest } from 'ahooks'
import InformationApi from '@/http/api/information'
import SvgIcon from '@/components/SvgIcon'
import LineIconLeft from '@/assets/line-left.png'
import { Divider } from 'antd'

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
      navigate('/calendar')
    },
  })

  const { data: res } = useRequest(() => InformationApi.getInformationList({ type: 3 }))

  return (
    <div className={`flex flex-col items-center justify-center px-10 h-[calc(100vh-60px)]`}>
      <div className="text-xl flex z-99 items-center justify-between fixed top-0 bg-[#fff] font-600 py-10 border-b-width-1px text-center border-solid border-color-[#e7eaea] w-full">
        <p></p>
        <p>确认订单</p>
        <SvgIcon
          name="nav-cancel"
          onClick={() => navigate('/calendar')}
          className="w-[20px] h-[20px] mr-4 cursor-pointer"
        />
      </div>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer items-center <sm:(hidden) font-600 fixed top-30 left-20"
      >
        <Image src={LineIconLeft} className="mr-4 w-30px" />
        返回
      </div>
      <div className="border border-solid border-color-[#b3b3b3] rounded-md p-5">
        <div className="text-2xl font-600 pb-10 text-center">总结</div>
        <div className="w-[280px]">
          <div className={`${styles.BorderedViewItem}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-base text-color-[#606060]">基础服务</span>
                <span className="text-xs text-color-[#B4B4B4]">{state?.payInfo?.basics_server || '--'}</span>
              </div>
              <span className="text-sm text-color-[#606060]">${state?.payInfo?.basics_price || '0.00'}</span>
            </div>
            <div className="flex items-start justify-between mb-4">
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
            <Divider />
          </div>
          <div className={`${styles.BorderedViewItem}`}>
            <div className="flex items-start justify-between mb-6">
              <span className="text-base font-600">应收款</span>
              <span className="text-base font-600">${state?.payInfo?.pay_amount || '0.00'}</span>
            </div>
            {state?.params?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-1 text-xs text-color-[#777777]">
                <p>{res?.data?.find((i: any) => i.id === item?.information_id)?.label}</p>
                <p>${item?.amount}</p>
              </div>
            ))}
            <Divider />
          </div>
          <div className={`${styles.BorderedViewItem}`}>
            <div className="flex items-start justify-between mb-6">
              <span className="text-base font-600">总计</span>
              <span className="text-base font-600">${state?.payInfo?.pay_amount || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-250px mt-10">
        <Button className="h-[2.75rem]" block color="primary" onClick={onConfirmClick}>
          确认
        </Button>
      </div>
    </div>
  )
}

export default CalendarPayConfirm
