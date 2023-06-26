import HeaderNav from '@/components/HeaderNav'
import { Button, Form, Input } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

const AddMode = () => {
  const navigator = useNavigate()

  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center bg-[#f9f9f9]">
      <HeaderNav title="添加支付方式" renderRight={false} />
      <div className="flex flex-col w-full px-10">
        <p className="font-500">输入银行卡信息</p>
        <p className="text-xs text-color-[#aaa]">确认后将自动添加到您的支付方式</p>
        <div className={styles.modeForm}>
          <Form
            onFinish={() => {
              //
            }}
          >
            <Form.Item name="a">
              <Input placeholder="银行卡预留名" />
            </Form.Item>
            <Form.Item name="b">
              <Input placeholder="请输入卡号" />
            </Form.Item>
            <Form.Item name="c">
              <div className="flex items-center h-full justify-between">
                <div className="text-xs pl-2 flex items-center mr-2 rounded-lg flex-1 bg-[#fff] h-full text-color-[#cecece]">
                  有效期MM / 有效期YY
                </div>
                <Input style={{ width: '5rem' }} placeholder="安全码" />
              </div>
            </Form.Item>
            <div className="fixed-b-btn flex">
              <Button
                className="w-[70%] h-[2.75rem]"
                block
                type="submit"
                color="primary"
                shape="rounded"
                loadingIcon={<></>}
              >
                使用此支付方式
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AddMode
