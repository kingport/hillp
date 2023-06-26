import React from 'react'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import { Skeleton, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Dialog } from 'antd-mobile'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { h5Copy } from '@/utils/util'
import { CloseOutline } from 'antd-mobile-icons'

const PcEmployeeInfo = (props: any) => {
  const { clienInfo, refresh } = props
  const navigate = useNavigate()

  // 删除客户
  const { runAsync: deleteClient } = useRequest(() => ManageApi.deleteClient({ id: clienInfo?.data?.id }), {
    manual: true,
    onSuccess() {
      navigate('/manage/customer/list')
    },
  })

  const delectCustomer = () => {
    Dialog.show({
      content: <div className="font-600 text-center pb-2 text-xl">确定要删除客户</div>,
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
            className: 'dialog-cancel',
          },
          {
            key: 'confirm',
            text: '确认',
            className: 'dialog-confirm',
            async onClick() {
              deleteClient()
            },
          },
        ],
      ],
    })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span onClick={() => navigate('/manage/add/customer', { state: { type: 'edit', formData: clienInfo?.data } })}>
          编辑资料
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={() =>
            navigate('/calendar/add/order', {
              state: {
                customerId: clienInfo?.data?.id,
              },
            })
          }
        >
          添加预约
        </span>
      ),
    },
    {
      key: '3',
      label: <span onClick={delectCustomer}>删除客户</span>,
    },
  ]

  return (
    <div className="flex flex-col w-550px h-full justify-center <sm:(hidden)">
      <Skeleton loading={!clienInfo} active>
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="border border-solid flex justify-center items-center border-color-[#cee2ee] border-width-1px w-120px h-120px rounded-full">
              <HiilpAvatar
                name={clienInfo?.data?.nickname}
                headurl={clienInfo?.data?.head}
                sx={{ width: 106, height: 106 }}
              />
            </div>
            <div className="flex flex-col pl-8">
              <p className="font-600 text-lg">{clienInfo?.data?.nickname}</p>
              <span className="text-color-[#ACACAC] pt-1 pb-1 text-xs">完成预约数：{clienInfo?.data?.order_num}</span>
              <a
                onClick={() => navigate('/calendar')}
                className="bg-[#e6f0ef] rounded-md text-xs p-1 text-color-[#2A4948]"
              >
                查看预约日历
              </a>
            </div>
          </div>
          <Dropdown menu={{ items }} placement="bottom">
            <SvgIcon name="point" className="w-[18px] h-[10px] cursor-pointer" />
          </Dropdown>
        </div>
        <div className="flex justify-between pt-12">
          <div className="flex flex-col w-[48%]">
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7">
              <div className="flex text-xs items-center">
                <span className="font-600 text-color-[#3F3F3F]">客户邮箱：</span>
                <span className="underline cursor-pointer text-color-[#3F3F3F]">{clienInfo?.data?.email}</span>
              </div>
              <div className="flex text-xs items-center pt-1">
                <span className="font-600 text-color-[#3F3F3F]">客户手机：</span>
                <span className="text-color-[#3F3F3F]">{clienInfo?.data?.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex w-[48%] relative flex-col rounded-2xl bg-[#f6f8f8] text-color-[#3F3F3F] text-xs">
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7">
              <div className="flex text-xs">
                <span className="font-600 text-color-[#3F3F3F] min-w-10">地址：</span>
                <span className="underline cursor-pointer text-color-[#3F3F3F]">{clienInfo?.data?.address}</span>
              </div>
              <div className="flex text-xs pt-1">
                <span className="font-600 text-color-[#3F3F3F] min-w-10">备注：</span>
                <span className="text-color-[#3F3F3F]">{clienInfo?.data?.remark}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex absolute bottom-6 right-20">
          <div
            onClick={delectCustomer}
            className=" bg-[#F3F3F3] rounded-3xl text-xs font-500 cursor-pointer hover:(opacity-70) px-2 py-1"
          >
            删除客户
          </div>
          <div
            onClick={() => {
              navigate('/calendar/add/order', {
                state: {
                  customerId: clienInfo?.data?.id,
                },
              })
            }}
            className="ml-3 bg-[#2A4948] text-color-[#fff] rounded-3xl text-xs font-500 cursor-pointer hover:(opacity-70) px-2 py-1"
          >
            添加预约
          </div>
        </div>
      </Skeleton>
      <div onClick={() => navigate(-1)} className="fixed top-80px right-40px">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default PcEmployeeInfo
