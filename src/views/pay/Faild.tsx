import SvgIcon from '@/components/SvgIcon'
import { getUrlParam } from '@/utils/util'
import { Button } from 'antd-mobile'
import React from 'react'

export default function Faild() {
  const navigate = useNavigate()
  const url = getUrlParam('url')

  return (
    <div className="flex min-h-[100vh] flex-col justify-center items-center">
      <SvgIcon name="faild" className="w-50px h-50px" style={{ color: '#a24743' }} />
      <p className="font-600 text-2xl pt-5 text-color-[#000]">支付失败</p>
      <p className="text-color-[#acacac] text-xs pt-5">发生错误，请检查您的支付信息是否正确</p>
      <div className="fixed bottom-10 w-[70%] sm:(w-400px)">
        <Button
          onClick={() => {
            if (url) {
              navigate(url)
            } else {
              navigate(-1)
            }
          }}
          color="primary"
          block
          shape="rounded"
        >
          返回
        </Button>
      </div>
    </div>
  )
}
