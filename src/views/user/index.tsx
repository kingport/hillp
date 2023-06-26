import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import { Button } from 'antd-mobile'
import styles from './index.module.scss'
import { useMount } from 'ahooks'
import { store } from '@/redux'
import { setToken, setUserId, setUserInfo, updataEmployeeForm } from '@/redux/modules/global/action'

function Login() {
  const navigate = useNavigate()

  // 获取url上的参数
  const getQueryString = (name: string) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return decodeURIComponent(r[2])
    }
    return null
  }
  // 缓存邀请码
  let invita_code = getQueryString('invita_code')
  if (invita_code) {
    sessionStorage.setItem('invita_code', invita_code)
  }

  const merchantLogin = () => {
    navigate('/user/login', { state: { account: 'merchant' } })
  }
  const personalLogin = () => {
    navigate('/user/login', { state: { account: 'personal' } })
  }

  useMount(() => {
    store.dispatch(setToken(''))
    store.dispatch(setUserId(''))
    store.dispatch(setUserInfo(''))
    store.dispatch(updataEmployeeForm(''))
  })

  return (
    <div className={`${styles.user}`}>
      <p className="text-2xl pt-20 text-center text-color-[#2A4948] font-600">登录/注册</p>

      <div className="sm:(flex justify-between items-center min-h-[80vh] ) pb-20">
        <div className="pt-8 px-12">
          <div className={`shadow-sm bg-[#fff] flex flex-col items-center rounded-md py-8 px-10`}>
            <SvgIcon name="merchant-account" className="w-17.5 h-17.5" />
            <p className="text-center text-color-[#2A4948] text-xl font-600 pt-4 pb-2">商家账号</p>
            <span className="text-center text-xs text-color-[#808080] pb-8">适用于以公司/团体名义运营的商家</span>
            <Button
              onClick={merchantLogin}
              className="bg-[#2A4948] px-6 py-2 text-sm text-color-[#fff] rounded-[100px]"
            >
              我是商家
            </Button>
          </div>
        </div>
        <div className="pt-8 px-12">
          <div className={`shadow-sm bg-[#fff] flex flex-col items-center rounded-md py-8 px-10`}>
            <SvgIcon name="personal-account" className="w-73px h-72px" />
            <p className="text-center text-color-[#2A4948] text-xl font-600 pt-4 pb-2">个人账号</p>
            <span className="text-center text-xs text-color-[#808080] pb-8">适用于个人管理的兼职/非企业用户</span>
            <Button
              onClick={personalLogin}
              className="bg-[#2A4948] px-6 py-2 text-sm text-color-[#fff] rounded-[100px]"
            >
              我是员工
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <SvgIcon name="logo" className="w-[52px] h-[12px]" />
        <div className="flex items-center pt-2">
          <div className="flex items-center">
            <SvgIcon name="lang-cn" className="w-[12px] h-[9px]" />
            <span className="pl-2 text-xs text-color-[#2A4948] text-sm">中文</span>
          </div>
          <div className="w-[4px] h-[4px] bg-[#2A4948] mx-4 rounded-1/2"></div>
          <div className="flex items-center">
            <SvgIcon name="help" className="w-[12px] h-[12px]" />
            <span className="pl-2 text-xs text-color-[#2A4948] underline">帮助</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
