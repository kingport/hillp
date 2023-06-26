import SvgIcon from '@/components/SvgIcon'
import { Button, Image } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'
import LineIcon from '@/assets/line-back.png'

function changeSuccess() {
  const navigator = useNavigate()

  const goLogin = () => {
    navigator('/user')
  }

  return (
    <div className={'flex flex-col justify-center items-center min-h-[90vh]'}>
      <SvgIcon name="success" className="w-[50px] h-[50px]" />
      <p className="text-color-[#000000] text-xl font-600 pt-4">修改成功</p>
      <div className="fixed-b-btn sm:(hidden)">
        <Button
          onClick={goLogin}
          shape="rounded"
          className="w-[80%] h-[42px]"
          block
          type="submit"
          color="primary"
          loadingIcon={<></>}
        >
          前往登录
        </Button>
      </div>
      <div
        onClick={() => navigator('/personal/security')}
        className="flex items-center cursor-pointer items-center <sm:(hidden) font-600 fixed bottom-10 right-10"
      >
        返回账号安全
        <Image src={LineIcon} className="ml-4 w-60px" />
      </div>
    </div>
  )
}

export default changeSuccess
