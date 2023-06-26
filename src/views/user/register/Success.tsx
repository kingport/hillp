import SvgIcon from '@/components/SvgIcon'
import UserApi from '@/http/api/user'
import { store } from '@/redux'
import { setAreaRegion, setToken, setUserId, setUserInfo } from '@/redux/modules/global/action'
import { useRequest, useTimeout } from 'ahooks'
import React from 'react'
import styles from './index.module.scss'

function success() {
  const location: any = useLocation()
  const navigate = useNavigate()

  useTimeout(() => {
    if (location?.state?.type === 'google') {
      navigate('/user')
    } else {
      run({
        user_type: location?.state?.user_type,
        email: location?.state?.email,
        password: location?.state?.formData?.password,
      })
    }
  }, 1000)

  // 登录
  const { run } = useRequest((params) => UserApi.login(params), {
    manual: true,
    async onSuccess(res) {
      //
      if (res.status === 200) {
        store.dispatch(setUserId(res.data.user_id))
        store.dispatch(setToken(res.data.token))
        const result = await UserApi.getUserInfo({ user_id: res.data.user_id })
        store.dispatch(setUserInfo(result.data))
        const resultArea = await UserApi.getRegionAndArea()
        if (resultArea.status === 200) {
          resultArea?.data?.region?.map((r: any) => {
            r.label = r.name
            r.value = r.id
          })
          resultArea?.data?.area?.map((a: any) => {
            a.label = a.name
            a.value = a.id
          })
          store.dispatch(setAreaRegion(resultArea.data))
        }
        if (result.status === 200) {
          navigate('/calendar')
        }
      }
    },
  })

  return (
    <div className={`${styles.success} flex flex-col justify-center items-center`}>
      <SvgIcon name="success" className="w-12.5 h-12.5" />
      <p className="text-color-[#000000] text-2xl font-600">注册成功</p>
    </div>
  )
}

export default success
