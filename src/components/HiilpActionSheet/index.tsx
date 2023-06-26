import React from 'react'
import { ActionSheet } from 'antd-mobile'
import styles from './index.module.scss'
import { Action } from 'antd-mobile/es/components/action-sheet'

interface Props {
  visible: boolean
  actions: Action[]
  setVisible: (val: boolean) => void
  show?: (val: any) => void
}
const HiilpActionSheet = (props: Props) => {
  const { setVisible } = props

  return (
    <div className={styles.hiilActionSheet}>
      <ActionSheet
        popupClassName={styles.hiilActionSheet}
        cancelText="关闭"
        onClose={() => setVisible(false)}
        {...props}
      />
    </div>
  )
}

export default HiilpActionSheet
