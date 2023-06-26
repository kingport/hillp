import React from 'react'
import { Rate, Button } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import moment from 'moment'

function CalendarResult() {
  const navigate = useNavigate()

  return (
    <div className={`${styles.CalendarResult} flex flex-col items-center justify-center pb-[90px]`}>
      <div className="flex items-center justify-center rounded-full bg-[#2A49480D] w-[50px] h-[50px] mb-4">
        <SvgIcon name="checked" className="w-[24px]" />
      </div>
      <span className="text-2xl font-600 text-color-[#2A4948] mb-2">已结付</span>
      <span className="text-sm text-color-[#BCBCBC] mb-28">{moment().format('YYYY年MM月DD日 HH:mm')}</span>
      <div className="<sm:(fixed-b-btn)">
        <Button
          onClick={() => {
            navigate('/calendar')
          }}
          className="w-[65%] h-[2.75rem] rounded-3xl sm:(w-500px)"
          block
          type="submit"
          color="primary"
          loadingIcon={<></>}
        >
          返回至历史列表
        </Button>
      </div>
    </div>
  )
}

export default CalendarResult
