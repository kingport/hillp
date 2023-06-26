import SvgIcon from '@/components/SvgIcon'
import { Button, CheckList, DatePickerRef, Form, Input, Picker, Popup } from 'antd-mobile'
import React, { RefObject } from 'react'
import styles from './index.module.scss'

interface Props {
  onFinish?: (val: any) => void
}

const Base = (props: Props) => {
  const { onFinish } = props
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="flex flex-col px-15 py-12">
      <Form requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null}>
        <Form.Item name="pwd" label="年龄*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="昵称" />
            <p className="text-xs pr-4">岁</p>
          </div>
        </Form.Item>
        <Form.Item name="name" label="体重*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="邮箱" />
            <p className="text-xs pr-4">kg</p>
          </div>
        </Form.Item>
        <Form.Item name="name1" label="身高*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="邮箱" />
            <p className="text-xs pr-4">cm</p>
          </div>
        </Form.Item>
        <Form.Item name="name" label="胸围*" rules={[{ required: true }]}>
          <div className={`${styles.input} flex items-center`}>
            <Input placeholder="邮箱" />
          </div>
        </Form.Item>
        <Form.Item
          name="birthday"
          label="人种*"
          onClick={(e, PickerRef: RefObject<DatePickerRef>) => {
            PickerRef.current?.open() // ⬅️
          }}
          rules={[{ required: true }]}
        >
          <Picker
            columns={[
              [
                { label: '美国', value: '1' },
                { label: '加拿大', value: '2' },
              ],
            ]}
          >
            {(value: any) => <span className="text-xs pl-4 flex items-center">{value[0]?.label || ''}</span>}
          </Picker>
        </Form.Item>
        <Form.Item name="birth2day" label="语言*" rules={[{ required: true }]}>
          <div onClick={() => setVisible(true)} className={`${styles.input} flex items-center`}>
            <Input value={`${selected.join(',')}`} placeholder="" readOnly />
            <SvgIcon name="phone-bottom" className="w-[10px] h-[6px] mr-4" />
          </div>
        </Form.Item>
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false)
          }}
          destroyOnClose
        >
          <div className={styles.checkListContainer}>
            <CheckList
              multiple
              className={styles.myCheckList}
              defaultValue={selected}
              onChange={(val) => {
                setSelected(val)
              }}
            >
              <CheckList.Item value="英语">英语</CheckList.Item>
              <CheckList.Item value="西班牙语">西班牙语</CheckList.Item>
              <CheckList.Item value="韩语">韩语</CheckList.Item>
            </CheckList>
          </div>
        </Popup>
      </Form>
    </div>
  )
}

export default Base
