import React from 'react'
import styles from './index.module.scss'

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[100vh] w-full">
      <div className={styles.ldsFacebook}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
