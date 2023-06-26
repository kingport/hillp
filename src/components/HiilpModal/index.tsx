import { Modal, ModalProps } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

const HiilpModal = (props: ModalProps) => {
  return (
    <div className={styles.HiilpModal}>
      <Modal {...props} />
    </div>
  )
}

export default HiilpModal
