import React from 'react'
import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import PayApi from '@/http/api/pay'
import { store } from '@/redux'
import { useMount, useRequest } from 'ahooks'
import { Button, Toast, Image } from 'antd-mobile'
import LineIconLeft from '@/assets/line-left.png'

const Pay = () => {
  const navigate = useNavigate()
  const payInfo = store.getState().global.payInfo
  const { type, stripeInfo } = payInfo

  // 获取套餐信息
  const { data: res, run } = useRequest(() => PayApi.getStripeInfo({ type: 4 }), {
    manual: true,
  })

  useMount(() => {
    if (type === 4) {
      run()
    }
  })

  // 支付类型 1-推广套餐、2-关联套餐、3-推广发布、4-付款签约用户
  let setmeal_level_tip = ''
  if (stripeInfo?.setmeal_level === 1) {
    setmeal_level_tip = '季度'
  }
  if (stripeInfo?.setmeal_level === 2) {
    setmeal_level_tip = '年'
  }
  if (stripeInfo?.setmeal_level === 3) {
    setmeal_level_tip = '月'
  }
  let payParams = {}

  // 推广套餐
  if (type === 1) {
    payParams = {
      type,
      setmeal_id: stripeInfo?.setmeal_id,
      success_url: window.location.origin + '/pay/success?url=/personal/auth/online',
      cancel_url: window.location.origin + '/pay/faild?url=/personal/auth/online',
    }
  }

  // 关联套餐
  if (type === 2) {
    payParams = {
      type,
      setmeal_id: stripeInfo?.setmeal_id,
      success_url: window.location.origin + '/pay/success?url=/personal/auth/association',
      cancel_url: window.location.origin + '/pay/faild?url=/personal/auth/association',
    }
  }

  // 推广发布
  if (type === 3) {
    payParams = {
      type,
      num: stripeInfo?.num,
      success_url: window.location.origin + '/pay/success?url=/personal/auth/sign',
      cancel_url: window.location.origin + '/pay/faild?url=/personal/auth/sign',
    }
  }

  // 签约支付
  if (type === 4) {
    payParams = {
      type: type,
      staff_id: stripeInfo?.staff_id,
      success_url: window.location.origin + '/pay/success?url=/calendar',
      cancel_url: window.location.origin + '/pay/faild?url=/calendar',
    }
  }

  const { runAsync: checkPay } = useRequest(() => PayApi.payCheck(payParams), {
    manual: true,
    onSuccess(res) {
      if (res.status === 200 || res.status === 201) {
        getPay()
      }
    },
  })

  const { run: getPay } = useRequest(() => PayApi.pay(payParams), {
    manual: true,
    onSuccess(res) {
      if (res?.data?.is_pay === 2) {
        Toast.show({
          content: '无需支付，延迟5秒刷新数据',
          afterClose() {
            navigate('/personal/wallet')
          },
        })
      } else {
        window.location.href = res?.data?.url
      }
    },
  })

  const confirmPay = async () => {
    await checkPay()
  }

  return (
    <div className="flex flex-col justify-center items-center <sm:(min-h-[100vh]) sm:(w-400px)">
      <HeaderNav title="确认信息" renderRight={false} />
      <div className="flex w-[80%] flex-col bg-[#f8f8f8] rounded-xl sm:(w-full)">
        {type === 3 && (
          <div className="flex items-center justify-between px-5.5 py-8.5">
            <p className="text-sm font-600">可发布信息余额充值</p>
            <p className="text-sm">
              ${stripeInfo?.amount}x{stripeInfo?.num}
            </p>
          </div>
        )}
        {(type === 2 || type === 1) && (
          <div className="flex items-center justify-between px-5.5 py-8.5">
            <div className="flex flex-col">
              <p className="text-sm font-600">{stripeInfo.name}</p>
              <p className="text-xs text-color-[#666]">{stripeInfo.remark}</p>
            </div>
            <p className="text-sm">
              ${stripeInfo?.amount}/{setmeal_level_tip}
            </p>
          </div>
        )}
        {type === 4 && (
          <div className="flex items-center justify-between px-5.5 py-8.5">
            <p className="text-sm font-600">平台佣金</p>
            <p className="text-sm">${res?.data?.amount}</p>
          </div>
        )}
      </div>
      <Button
        onClick={confirmPay}
        className="mt-4 w-[70%] sm:(w-full)"
        color="primary"
        block
        loading="auto"
        loadingIcon={<Ellipseing />}
      >
        确认支付
      </Button>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer items-center <sm:(hidden) font-600 fixed top-30 left-40"
      >
        <Image src={LineIconLeft} className="mr-4 w-30px" />
        返回
      </div>
    </div>
  )
}

export default Pay
