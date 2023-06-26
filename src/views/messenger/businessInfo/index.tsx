import React from 'react'
import { Button, Avatar } from 'antd-mobile'

import HeaderNav from '@/components/HeaderNav'

import styles from './index.module.scss'

const BusinessInfo = () => {
  return (
    <div className={`${styles.BusinessInfo} bg-[#fff] pt-[48px] pb-[90px]`}>
      <HeaderNav renderRight={false} title="商家详情" />

      <div className="w-[70%] shadow-sm h-xs mt-24 flex flex-col items-center rounded-xl text-[#292929]">
        <Avatar className="z-10 mt-[-32px]" src="" style={{ '--border-radius': '50%', '--size': '73px' }} />

        <span className="text-xs mt-2">LunaGirls</span>
        <span className="text-xs">商家</span>

        <div className="w-[100%] px-8 py-4">
          <p className="text-xs">简介</p>
          <p className="text-xs">
            以”价格=女生素质+服务态度“的合理运营法则，实现”价格合理“，”真诚经营“，”良性竞争“的澳洲理想小环境
          </p>

          <div className="w-[70%] flex mt-1.5rem mb-4 text-xs">
            <div className="flex-1">
              <p>员工数</p>
              <p>32</p>
            </div>
            <div className="flex-1">
              <p>接单数</p>
              <p>255</p>
            </div>
          </div>

          <div className="text-xs">
            <p>评分</p>
            <p>4.5分（32人评分）</p>
          </div>
        </div>
      </div>

      <div className="fixed-b-btn flex justify-around">
        <Button className="w-[35%] border-0 text-[#2A4948] bg-[#F3F3F3]" shape="rounded" block size="large">
          忽略信息
        </Button>
        <Button
          className="w-[35%]"
          shape="rounded"
          block
          type="submit"
          size="large"
          color="primary"
          loadingIcon={<></>}
        >
          立即签约
        </Button>
      </div>
    </div>
  )
}

export default BusinessInfo
