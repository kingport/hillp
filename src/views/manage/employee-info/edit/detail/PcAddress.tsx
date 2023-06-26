import Ellipseing from '@/components/Ellipseing'
import { store } from '@/redux'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { Button, Form, Input, TextArea } from 'antd-mobile'
import Autocomplete from 'react-google-autocomplete'
import Geocode from 'react-geocode'
import { pickBy, identity } from 'lodash'
import React, { RefObject } from 'react'
import styles from './index.module.scss'
import { GOOGLE_MAP_KEY } from '@/constant'
import { InitAutocomplete } from '@/components/SearchBox/init'
import { Col, Row } from 'antd'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

const AddressForm = (props: any) => {
  return (
    <div className="flex h-full flex-col px-8 pt-20">
      <p className="text-lg pb-8 font-500">地址信息</p>
      <Form.Item label="街道*">
        <div className="flex items-center justify-between">
          <Form.Item noStyle name="street" rules={[{ required: true, message: '请输入正确地址' }]}>
            <InitAutocomplete />
          </Form.Item>
        </div>
      </Form.Item>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="门牌号">
            <div className={`${styles.input} flex items-center`}>
              <Form.Item noStyle name="house_num">
                <Input placeholder="门牌号" />
              </Form.Item>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="按铃方式">
            <div className={`${styles.input} flex items-center`}>
              <Form.Item noStyle name="bell">
                <Input placeholder="按铃方式" />
              </Form.Item>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}

export default AddressForm
