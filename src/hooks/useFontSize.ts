import { useSize } from 'ahooks'
import React from 'react'

const useFontSize = () => {
  const size = useSize(document.querySelector('body'))

  return {
    width: size?.width,
    height: size?.height,
  }
}

export default useFontSize
