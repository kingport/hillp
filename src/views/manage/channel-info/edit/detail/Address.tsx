import SvgIcon from '@/components/SvgIcon'
import { Button, CheckList, DatePickerRef, Form, Input, Picker, Popup, TextArea } from 'antd-mobile'
import React, { RefObject } from 'react'
import styles from './index.module.scss'

interface Props {
  onFinish?: (val: any) => void
}

const AddressForm = (props: Props) => {
  const { onFinish } = props
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="flex h-full flex-col px-15 py-12">
      <p className="text-lg pb-8 font-500">地址信息</p>
      <Form requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null}>
        <Form.Item name="pwd" label="街道*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="街道" />
          </div>
        </Form.Item>
        <Form.Item name="name" label="门牌号*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="门牌号" />
          </div>
        </Form.Item>
        <Form.Item name="name1" label="按铃方式*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="按铃方式" />
          </div>
        </Form.Item>
        <Form.Item name="be" label="备注">
          <TextArea placeholder="请输入备注" autoSize={{ minRows: 5, maxRows: 7 }} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddressForm
