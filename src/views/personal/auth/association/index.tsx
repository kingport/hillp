import HeaderNav from '@/components/HeaderNav'
import PayApi from '@/http/api/pay'
import { store } from '@/redux'
import { setPayOrderInfo } from '@/redux/modules/global/action'
import { useRequest } from 'ahooks'
import { Button, Toast, CapsuleTabs } from 'antd-mobile'
import React from 'react'
import { CloseOutline } from 'antd-mobile-icons'

const Association = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<any>(null)

  const { data } = useRequest(() => PayApi.getStripeInfo({ type: 2 }))

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
        className={`flex flex-col mx-7.5 mt-4 p-6 rounded-lg border bg-[#fff] sm:(mx-0) ${
          selected?.setmeal_id === item?.setmeal_id
            ? 'border-solid border-color-[#6c8383] '
            : 'border-solid border-color-[transparent]'
        }`}
      >
        <p className="text-sm font-600">{item?.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs text-color-[#999]">{item?.remark}</p>
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
    <div className="flex w-full flex-col min-h-[100vh] bg-[#f9fafa] pt-[48px] pb-[90px] sm:(pt-0 pb-0 min-h-none min-h-[calc(100vh-60px)] justify-center items-center flex)">
      <HeaderNav title={'关联账号'} renderRight={false} onBack={() => navigate('/personal/auth')} />
      <div className="sm:(w-500px)">
        <div className="flex flex-col px-7.5 pt-8 sm:(py-0 px-0)">
          <div className="flex px-6 py-3 rounded-md bg-gradient-to-r from-[#3a5050]  to-[#768586]  items-center justify-between">
            <p className="text-color-[#fff] text-xs">可关联账号余额</p>
            <p className="text-color-[#fff]">{data?.data?.num}</p>
          </div>
        </div>
        <CapsuleTabs className='px-5'>
          <CapsuleTabs.Tab title="订阅" key="subscribe">
            <div className="flex flex-col">{data?.data?.list?.subscribe?.map((item: any) => renderItem(item))}</div>
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title="非订阅" key="nosubscribe">
            <div className="flex flex-col">{data?.data?.list?.not_subscribe?.map((item: any) => renderItem(item))}</div>
          </CapsuleTabs.Tab>
        </CapsuleTabs>
        <div className="<sm:(fixed-b-btn) flex sm:(justify-center w-full)">
          <Button
            onClick={() => {
              if (selected) {
                store.dispatch(
                  setPayOrderInfo({
                    stripeInfo: selected,
                    type: 2,
                  })
                )
                navigate('/personal/auth/association/confirm')
              } else {
                Toast.show('请选择')
              }
            }}
            className="h-[2.68rem] w-[70%] rounded-3xl sm:(w-full mt-5)"
            type="submit"
            color="primary"
            loadingIcon={<></>}
          >
            确认
          </Button>
        </div>
      </div>
      <div onClick={() => navigate('/personal/auth')} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default Association
