import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import { Button, Stepper } from 'antd-mobile'
import styles from '../../index.module.scss'
import { useRequest } from 'ahooks'
import PayApi from '@/http/api/pay'
import { store } from '@/redux'
import { setPayOrderInfo } from '@/redux/modules/global/action'
import { CloseOutline } from 'antd-mobile-icons'

const PromoteSign = () => {
  const [visible, setVisible] = useState(false)
  const [num, setNum] = useState(1)

  const navigate = useNavigate()

  // 获取套餐信息
  const { data } = useRequest(() => PayApi.getStripeInfo({ type: 3 }))

  return (
    <div className="flex flex-col pt-[48px] min-h-[100vh] bg-[#f9fafa] sm:(w-full !min-h-[calc(100vh-60px)] relative flex justify-center items-center)">
      <HeaderNav renderRight={false} title="推广签约" border onBack={() => navigate('/personal/auth')} />
      <div className="flex flex-col px-8 pt-8 sm:(w-500px)">
        <div className="flex bg-gradient-to-r from-[#3a5050] to-[#768586] shadow-sm justify-between items-center py-5 px-7 rounded-lg text-color-[#fff]">
          <p className="text-xs">本周可发布信息余额</p>
          <p className="text-lg font-600">{data?.data?.num}</p>
        </div>
        <div className="flex items-center px-6 py-6 mt-3 justify-between shaadow-sm rounded-lg bg-[#fff]">
          <div className="flex flex-col">
            <p className="font-600 text-color-[#000] text-sm">可发布信息余额充值</p>
            <p className="text-sm text-color-[#2A4948]">${data?.data?.amount}/条</p>
          </div>
          {!visible && (
            <p
              onClick={() => setVisible(true)}
              className="border-solid border border-gray-400 px-0.5 rounded-md text-xs text-color-[#3D3D3D]"
            >
              x1
            </p>
          )}
          {visible && (
            <div className={styles.stepper}>
              <Stepper
                style={{
                  '--border': '1px solid #e0e5e5',
                  '--border-inner': 'none',
                  '--height': '1.375rem',
                  '--input-width': '28px',
                  '--input-background-color': '#fff',
                  '--active-border': '1px solid #3a5050',
                  '--button-background-color': '#fff !important',
                  '--button-font-size': '12px',
                }}
                defaultValue={1}
                min={1}
                onChange={(value) => {
                  setNum(value)
                }}
              />
            </div>
          )}
        </div>
        <div className="<sm:(fixed-b-btn) flex sm:(absolute bottom-5 border border-solid border-l-0 border-r-0 border-b-0 w-full left-0 border-color-[#f3f3f3] pt-5)">
          <div className="flex items-center w-full px-6 justify-between sm:(justify-end)">
            <div className="flex items-center">
              <p className="text-xs text-color-[#3d3d3d]">合计：</p>
              <p className="font-500s">${data?.data?.amount * num}</p>
            </div>
            <Button
              onClick={() => {
                store.dispatch(
                  setPayOrderInfo({
                    stripeInfo: { num, amount: data?.data?.amount },
                    type: 3,
                  })
                )
                navigate('/pay')
              }}
              className="h-[2.68rem] w-[40%] rounded-3xl sm:(w-100px ml-5)"
              type="submit"
              color="primary"
              loadingIcon={<></>}
            >
              结算
            </Button>
          </div>
        </div>
      </div>
      <div onClick={() => navigate('/personal/auth')} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default PromoteSign
