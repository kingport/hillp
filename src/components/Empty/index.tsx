import React from 'react'
import SvgIcon from '@/components/SvgIcon'

interface Props {
  img: string
  text: string | React.ReactNode
}

const Empty = (props: Props) => {
  const { img, text } = props

  return (
    <div className="flex justify-center items-center">
      <div>
        <SvgIcon name={img} className="w-[169px] h-[169px]" />
        <div className="text-sm font-600 text-[#9B9B9B] text-center">{text}</div>
      </div>
    </div>
  )
}

export default Empty
