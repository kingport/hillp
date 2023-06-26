import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'

import styles from './index.module.scss'

export default function ViewNotice() {
  return (
    <div className={`${styles.notice} pt-[48px]`}>
      <HeaderNav renderRight={false} />

      <div className="p-8">
        <p className="text-xs text-[#AAAAAA]">2-14</p>
        <p className="text-lg text-[#2A4948] font-600">情人节特惠活动</p>

        <div>html内容渲染...</div>
      </div>
    </div>
  )
}
