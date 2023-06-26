import React from 'react'
import { Button, ResultPage } from 'antd-mobile'
import { HOME_URL } from '@/config/config'

const NotFound = () => {
  const navigate = useNavigate()
  const goHome = () => {
    navigate(HOME_URL)
  }
  return <ResultPage status="error" title="404" description="页面出现错误了" />
}

export default NotFound
