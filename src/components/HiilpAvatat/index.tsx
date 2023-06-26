import React from 'react'
import Avatar from '@mui/material/Avatar'
import { stringAvatar } from '@/utils/util'
import SvgIcon from '../SvgIcon'

interface Props {
  headurl?: string
  name: string
  sx?: any
  className?: string
}
const HiilpAvatar = (props: Props) => {
  const { headurl, name, sx = { width: 70, height: 70 }, className } = props
  const renderAvatar = () => {
    if (!headurl && !name) {
      return (
        <div
          style={{ width: sx.width, height: sx.height }}
          className="flex justify-center items-center border border-solid border-color-[#c9cecd] rounded-full"
        >
          <div
            style={{ width: sx.width - 9, height: sx.height - 9 }}
            className="flex justify-center items-center bg-[#f4f6f6] rounded-full"
          >
            <SvgIcon name="avatar" className="w-[26px] h-[22px]" />
          </div>
        </div>
      )
    }

    if (name && !headurl) {
      return <Avatar sx={sx} {...stringAvatar(name)} {...props} />
    }

    if (headurl) {
      return <Avatar sx={sx} {...props} alt={name} src={headurl} />
    }
  }
  return <>{renderAvatar()}</>
}

export default HiilpAvatar
