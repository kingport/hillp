import PayApi from '@/http/api/pay'
import { store } from '@/redux'
import { setPayOrderInfo } from '@/redux/modules/global/action'
import { useRequest } from 'ahooks'
import { Button, Toast, CapsuleTabs } from 'antd-mobile'
import { Skeleton } from 'antd'
import React from 'react'

export default function ParticipateNot() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<any>(null)

  const { data, loading } = useRequest(() => PayApi.getStripeInfo({ type: 1 }))

  const renderItem = (item: any) => {
    let setmeal_level_tip = ''
    if (item?.setmeal_level === 1) {
      setmeal_level_tip = '季度'
    }
    if (item?.setmeal_level === 2) {
      setmeal_level_tip = '年'
    }
    if (item?.setmeal_level === 3) {
      setmeal_level_tip = '月'
    }
    return (
      <div
        onClick={() => setSelected(item)}
        key={item?.setmeal_id}
        className={`flex flex-col shadow-sm mt-4 border p-6 rounded-lg bg-[#fff] cursor-pointer ${
          selected?.setmeal_id === item?.setmeal_id
            ? 'border-solid border-color-[#6c8383] '
            : 'border-solid border-color-[transparent]'
        }`}
      >
        <p className="text-sm font-600">{item?.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs text-color-[#999]">{item?.remark}</p>
            <p className="text-xs text-color-[#999] underline">适用条款及条件</p>
          </div>
          <div className="flex items-center">
            <p className="text-lg font-600">${item?.amount}</p>
            <p className="text-xs pl-2">/{setmeal_level_tip}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-8 pt-2">
      <Skeleton loading={loading}>
        <div className="hidden sm:(flex flex-col items-center)">
          <p className="text-lg font-500">线上推广</p>
          <p className="text-color-[#A5A5A5] text-sm pt-1">选择套餐</p>
        </div>
        <CapsuleTabs>
          <CapsuleTabs.Tab title="订阅" key="subscribe">
            <div className="flex flex-col">{data?.data?.list?.subscribe?.map((item: any) => renderItem(item))}</div>
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title="非订阅" key="nosubscribe">
            <div className="flex flex-col">{data?.data?.list?.not_subscribe?.map((item: any) => renderItem(item))}</div>
          </CapsuleTabs.Tab>
        </CapsuleTabs>

        <div className="<sm:(fixed-b-btn) flex sm:(justify-center mt-5)">
          <Button
            onClick={() => {
              if (!selected) return Toast.show('请选择套餐')
              store.dispatch(
                setPayOrderInfo({
                  stripeInfo: selected,
                  type: 1,
                })
              )
              navigate('/personal/auth/association/confirm')
            }}
            className="h-[2.68rem] w-[70%] rounded-3xl"
            type="submit"
            color="primary"
            block
            loadingIcon={<></>}
          >
            确认
          </Button>
        </div>
      </Skeleton>
    </div>
  )
}
