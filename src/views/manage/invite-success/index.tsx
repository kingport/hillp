import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Button } from 'antd-mobile'
import React from 'react'

const InviteSuccess = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col justify-center items-center bg-[#fff] min-h-[100vh] pt-[48px] pb-[90px] sm:(p-0 min-h-[calc(100vh-60px)] flex justify-center items-center)">
      <HeaderNav renderLeft={false} />
      <SvgIcon name="success" className="w-[44px] h-[44px]" />
      <p className="text-xl mt-8 font-600 text-color-[#000]">邀请发送成功</p>
      <p className="pt-2 text-xs text-color-[#7C7C7C]">邀请信息已发送至邮箱， </p>
      <p className="text-xs text-color-[#7C7C7C]">请尽快通知被邀请人并按照邮件提示前往验证。</p>
      <div className="<sm:(fixed-b-btn) flex sm:(mt-5 w-300px)">
        <Button
          onClick={() => {
            navigate(-1)
          }}
          className="w-[70%] h-[2.75rem] sm:(w-full)"
          block
          type="submit"
          color="primary"
          shape="rounded"
          loadingIcon={<></>}
        >
          继续邀请
        </Button>
      </div>
    </div>
  )
}

export default InviteSuccess
