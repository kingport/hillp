import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import { Button, Stepper } from 'antd-mobile'
import styles from '../../index.module.scss'
import ParticipateNot from './ParticipateNot'
import ParticipateInPersonal from './ParticipateInPersonal'
import ParticipateInMerchant from './ParticipateInMerchant'
import { store } from '@/redux'
import { useRequest } from 'ahooks'
import PersonalApi from '@/http/api/personal'
import PcParticipateInMerchant from './PcParticipateInMerchant'
import PcParticipateInPersonal from './PcParticipateInPersonal'

const PromoteOnline = () => {
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()
  const location: any = useLocation()

  const { data, loading } = useRequest(() => PersonalApi.getPromotion({}))

  if (loading) return <></>

  return (
    <div className="flex flex-col pt-[48px] <sm:(min-h-[100vh]) bg-[#f9fafa] sm:(pt-0 bg-[#fff] justify-center w-400px)">
      <HeaderNav renderRight={false} title="线上推广" border onBack={() => navigate('/personal/auth')} />
      {/* 未参与 */}
      {(data?.data?.is_promotion === 0 || location?.state?.type === 'wallet') && <ParticipateNot />}
      {/* 已参与 个人账号*/}
      {userInfo?.user_type === 1 && data?.data?.is_promotion !== 0 && location?.state?.type !== 'wallet' && (
        <>
          <ParticipateInPersonal />
        </>
      )}
      {/* 已参与 商家账号*/}
      {userInfo?.user_type === 2 && data?.data?.is_promotion !== 0 && location?.state?.type !== 'wallet' && (
        <>
          <div className="<sm:(hidden)">
            <PcParticipateInMerchant />
          </div>
          <div className="sm:(hidden)">
            <ParticipateInMerchant />
          </div>
        </>
      )}
    </div>
  )
}

export default PromoteOnline
