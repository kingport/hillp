import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import styles from './index.module.scss'
import stylesPrice from '../../../add/employee/index.module.scss'

import { Button, Form, Input, Picker, Avatar } from 'antd-mobile'

function Price(props: any) {
  const { swipeNext } = props

  const onFinish = (values: any) => {
    // TODO
  }
  return (
    <div className={`bg-[#fff]`}>
      <div className="flex flex-col px-10">
        <Form requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null}>
          <p className="pt-12 pb-4">可提供服务</p>
          <Form.Item name="procejt">
            <div className={`${styles.input} flex items-center`}>
              <Input placeholder="全部项目" readOnly />
              <Button
                onClick={() => swipeNext()}
                size="mini"
                fill="none"
                className="text-xs pr-4 underline min-w-[4rem]"
              >
                编辑
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Price
