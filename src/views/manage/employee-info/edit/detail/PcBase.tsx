import SvgIcon from '@/components/SvgIcon'
import InformationApi from '@/http/api/information'
import { store } from '@/redux'
import { useMount, useRequest } from 'ahooks'
import { Col, Row, Select } from 'antd'
import { Form, Input, Picker, Popup } from 'antd-mobile'
import _ from 'lodash'
import React, { RefObject } from 'react'
import styles from './index.module.scss'
import PcPrice from './PcPrice'

function Base(props: any) {
  const { langList } = props

  const [form] = Form.useForm()

  const { data: raceList, loading } = useRequest(() => InformationApi.getInformationList({ type: 1 }))

  if (loading) return <></>

  return (
    <div className="flex flex-col px-8 pt-20">
      {/* <Form form={form} requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null}> */}
      <p className="font-600 py-5 text-2xl">编辑详细资料</p>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="年龄*">
            <div className={`${styles.input} flex items-center`}>
              <Form.Item
                noStyle
                name="age"
                rules={[
                  {
                    required: true,
                    message: '请输入合法年龄',
                    validator: (_, value, callback) => {
                      if (value < 18) {
                        return new Promise((resolve,reject) => {
                          reject('请输入合法年龄')
                        })
                      } else {
                        return Promise.resolve()
                      }
                    },
                  },
                ]}
              >
                <Input placeholder="年龄" />
              </Form.Item>
              <p className="text-xs pr-4 min-w-34px">岁</p>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="体重*">
            <div className={`${styles.input} flex items-center`}>
              <Form.Item noStyle name="weight" rules={[{ required: true }]}>
                <Input placeholder="体重" />
              </Form.Item>
              <p className="text-xs pr-4 min-w-34px">kg</p>
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="身高*">
            <div className={`${styles.input} flex items-center`}>
              <Form.Item noStyle name="height" rules={[{ required: true }]}>
                <Input placeholder="身高" />
              </Form.Item>
              <p className="text-xs pr-4 min-w-34px">cm</p>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="胸围*">
            <div className={`${styles.input} flex items-center`}>
              <Form.Item noStyle name="chest" rules={[{ required: true }]}>
                <Input placeholder="胸围" />
              </Form.Item>
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="race"
            label="人种*"
            rules={[{ required: true, message: '请选择人种' }]}
            className={styles.raceContainer}
          >
            <Select
              style={{ width: '100%' }}
              onChange={(val) => {
                if (val) {
                  form.setFieldsValue({
                    race: [val],
                  })
                }
              }}
              className="!rounded-sm <sm:(hidden)"
              options={raceList?.data}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lang_ids"
            label="语言*"
            rules={[{ required: true, message: '请选择语言' }]}
            className={styles.raceContainer}
          >
            <Select
              style={{ width: '100%' }}
              onChange={(val) => {
                if (val) {
                  form.setFieldsValue({
                    lang_ids: val,
                  })
                }
              }}
              maxTagCount="responsive"
              mode="multiple"
              className="!rounded-sm <sm:(hidden)"
              options={langList?.data}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}

export default Base
