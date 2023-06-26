import React from 'react'
import moment from 'moment'
import SvgIcon from '@/components/SvgIcon'

interface PickerContentProps {
  val: any[] | Date
  innerHeight?: string
  iconName?: string
  iconWidth?: string
  iconHeight?: string
  textType: 'normal' | 'time' | 'date'
  noIcon?: boolean
  style?: any
}

function PickerContent(props: PickerContentProps) {
  const {
    val,
    innerHeight = '21px',
    noIcon = false,
    iconName = 'caret-down',
    iconWidth = '10px',
    iconHeight = '6px',
    style = {},
    textType,
  } = props

  const textContent =
    textType === 'normal'
      ? (val as any[]).every((item) => item === null)
        ? ''
        : (val as any[]).map((item) => item?.label ?? '')[0]
      : textType === 'time'
      ? (val as any[]).every((item) => item === null)
        ? ''
        : `${(val as any[])[0]?.label}:${(val as any[])[1]?.label}`
      : textType === 'date' && moment(val as Date).isValid()
      ? moment(val as Date).format('dddd YYYY/MM/DD')
      : ''

  return iconName ? (
    <div className={`flex items-center justify-between`} style={{ height: innerHeight, ...style }}>
      <span>{textContent}</span>
      {!noIcon && <SvgIcon name={iconName} className={`w-[${iconWidth}] h-[${iconHeight}] ml-2 fill-[#2A4948]`} />}
    </div>
  ) : (
    <span>{textContent}</span>
  )
}

export default PickerContent
