import PayApi from '@/http/api/pay'
import PersonalApi from '@/http/api/personal'
import { useRequest } from 'ahooks'
import { Dialog } from 'antd-mobile'
import { Skeleton } from 'antd'
import moment from 'moment'
import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import { CloseOutline } from 'antd-mobile-icons'

const AccountDetails = () => {
  const navigate = useNavigate()

  const { data: res, loading, refresh } = useRequest(() => PersonalApi.assetList({}))

  const renderItem = (item: any) => {
    return (
      <div
        key={item?.id}
        className="flex gap-2 py-2 border-t justify-between text-xs text-color-[#666] sm:(py-4) cursor-pointer"
      >
        <p style={{ wordBreak: 'break-word' }} className="w-[40%]">
          {item?.order_no}
        </p>
        <p className="w-[20%] text-center">{moment(item?.create_time * 1000).format('YYYY/MM/DD')}</p>
        <p className="w-[20%] text-center">{item?.type}</p>
        <p className="w-[20%] text-right">{item?.amount}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:(w-600px) justify-center">
      <Skeleton loading={loading}>
        <p className="flex items-center px-5 py-4 justify-between rounded-md bg-[#f4f6f6] text-xs font-500 text-color-[#000]">
          <span>账户状态</span>
          <span
            onClick={() => {
              if (res.data.status === 2 || res?.data?.is_renewal === 0) {
                navigate('/personal/auth/online', {
                  state: {
                    type: 'wallet',
                  },
                })
              }
              if (res.data.status === 1 && res?.data?.is_renewal === 1) {
                const actions = [
                  {
                    key: 'cancel',
                    text: '取消',
                    className: 'dialog-cancel',
                  },
                  {
                    key: 'confirm',
                    text: '确定',
                    className: 'dialog-confirm',
                    async onClick() {
                      const resCancel = await PayApi.cancel({ type: 1 })
                      if (resCancel.status === 200) {
                        setTimeout(() => {
                          refresh()
                        }, 1000)
                        await Dialog.show({
                          content: (
                            <div className="flex flex-col justify-center items-center pb-6">
                              <div className="bg-[#eaeded] rounded-full w-42px h-42px flex justify-center items-center">
                                <SvgIcon name="cancel" className="w-25px h-25px" />
                              </div>
                              <p className="font-600 py-4">套餐已取消</p>
                              <p className="text-color-[#B1B1B1] text-xs">
                                您的套餐将在{moment(res?.data?.promotion_endtime * 1000).format('YYYY-MM-DD')}到期
                              </p>
                            </div>
                          ),
                          actions: [],
                          closeOnMaskClick: true,
                        })
                      }
                    },
                  },
                ]

                Dialog.show({
                  content: (
                    <div className="font-600 text-center pb-2 text-xs text-color-[#000]">
                      <p className="text-lg font-600">确认取消套餐</p>
                      <p className="text-color-[#999]">
                        取消后套餐将于{moment(res?.data?.promotion_endtime * 1000).format('YYYY-MM-DD')}到期
                      </p>
                    </div>
                  ),
                  closeOnMaskClick: true,
                  closeOnAction: true,
                  actions: [actions],
                })
              }
            }}
            className="text-color-[#2A4948] underline cursor-pointer"
          >
            {(res?.data?.status === 2 || res?.data?.is_renewal === 0) && '升级账户'}
            {res?.data?.status === 1 && res?.data?.is_renewal === 1 && '取消套餐'}
          </span>
        </p>
        {/* 暂无 */}
        <div className="flex items-center pt-6">
          <div className="flex pr-8 flex-col text-xs text-color-[#000] border-r">
            <p>套餐</p>
            <p className="text-color-[#666]">{res?.data?.setmeal || '无'}</p>
          </div>
          <div className="flex px-8 flex-col text-xs text-color-[#000] border-r">
            <p>有效期至</p>
            <p className="text-color-[#666]">
              {res?.data?.promotion_endtime ? moment(res?.data?.promotion_endtime * 1000).format('YYYY-MM-DD') : '无'}
            </p>
          </div>
          <div className="flex px-8 flex-col text-xs text-color-[#000]">
            <p>状态</p>
            <p className="text-color-[#666]">
              {res?.data?.status === 1 && '有效'}
              {res?.data?.status === 2 && '无效'}
            </p>
          </div>
        </div>
        <p className="flex mt-20 items-center px-5 py-4 justify-between rounded-md bg-[#f4f6f6] text-xs font-500 text-color-[#000]">
          <span>流水明细</span>
          <span className="text-color-[#2A4948]">余额 ${res?.data?.balance}</span>
        </p>
        <div className="flex flex-col mt-6">
          <div className="flex pb-4 items-center text-color-[#000] text-xs justify-between">
            <p className="w-[40%]">订单号</p>
            <p className="w-[20%] text-center">日期</p>
            <p className="w-[20%] text-center">详情</p>
            <p className="w-[20%] text-right">金额</p>
          </div>
          <div className="flex flex-col">{res?.data?.data?.map((item: any) => renderItem(item))}</div>
        </div>
      </Skeleton>
      {/* <div onClick={() => navigate('/personal')} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div> */}
    </div>
  )
}

export default AccountDetails
