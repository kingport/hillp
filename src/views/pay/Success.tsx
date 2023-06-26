import SvgIcon from '@/components/SvgIcon'
import { getUrlParam } from '@/utils/util'
import { Button } from 'antd-mobile'
import React from 'react'

export default function Success() {
  const navigate = useNavigate()
  const url = getUrlParam('url')
  return (
    <div className="flex flex-col justify-center items-center <sm:(min-h-[100vh])">
      <SvgIcon name="success" className="w-50px h-50px" />
      <p className="font-600 text-2xl pt-5">支付成功</p>
      <div className="fixed bottom-10 w-[70%] sm:(relative w-200px mt-2 bottom-0)">
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
