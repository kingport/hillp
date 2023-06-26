import React, { FC } from 'react'
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'
import SvgIcon from '../SvgIcon'

interface HeaderNavProps {
  onBack?: () => void
  onTitleClick?: (() => void) | null
  title?: any
  renderRight?: any
  renderLeft?: any
  border?: any
  bg?: string
  children?: any
  leftIconColor?: string
  rightIconColor?: string
}
const HeaderNav = (props: HeaderNavProps) => {
  const {
    onBack,
    onTitleClick,
    title,
    bg = '#fff',
    border = false,
    leftIconColor = '#2A4948',
    rightIconColor = '#2A4948',
    renderRight = (
      <SvgIcon onClick={() => back()} className="w-[20px]" style={{ color: rightIconColor }} name="nav-cancel" />
    ),
    renderLeft = (
      <SvgIcon onClick={() => back()} style={{ color: leftIconColor, width: '20px', height: '48px' }} name="nav-left" />
    ),
  } = props
  const navigator = useNavigate()

  const back = () => {
    if (onBack) return onBack()
    navigator(-1)
  }

  const dropdownIcon = () => {
    return onTitleClick ? <SvgIcon name="dropdown" className="inline w-[18px] h-[18px]" /> : null
  }

  return (
    <div style={{ background: bg }} className={`${styles.HeaderNav} sm:(hidden)`}>
      <NavBar
        style={{
          '--height': '48px',
          fontSize: '12px',
        }}
        left={renderLeft}
        right={renderRight}
        onBack={back}
        backArrow={<></>}
        className={`${border ? styles.border : ''}`}
      >
        <span
          className={`flex items-center justify-center`}
          onClick={() => {
            onTitleClick && onTitleClick()
          }}
        >
          {title || ''}
          {dropdownIcon()}
        </span>
      </NavBar>
    </div>
  )
}
export default HeaderNav
