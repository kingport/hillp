import React from 'react'
import SvgIcon from '../SvgIcon'
import styles from './index.module.scss'

function Ellipseing(props: any) {
  const { bgColor = '#fff' } = props

  const style = {
    background: bgColor,
  }
  return (
    <SvgIcon name="ellipsis" className="h-[30px]" />
    // <div className={styles.ldsEllipsis}>
    //   <div style={style}></div>
    //   <div style={style}></div>
    //   <div style={style}></div>
    //   <div style={style}></div>
    // </div>
  )
}

export default Ellipseing
