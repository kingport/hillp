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

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

const AddressForm = (props: any) => {
  const { next, extendData, swiperIndex } = props
  const [form] = Form.useForm()
  const employeeForm = store.getState().global.employeeForm

  const onFinish = async () => {
    await form.validateFields().then((values) => {
      values = pickBy(values, identity)
      store.dispatch(updataEmployeeForm({ ...employeeForm, ...values }))
      next()
    })
  }

  useEffect(() => {
    if (extendData?.data) {
      let formData = extendData?.data
      // 用户编辑时的缓存数据
      if (employeeForm.street) {
        formData = employeeForm
      }
      form.setFieldsValue({
        street: formData.street || formData.address || '',
        house_num: formData.house_num,
        bell: formData.bell,
        remark: formData.remark,
      })
    }
  }, [swiperIndex, extendData])

  return (
    <div className="flex h-full flex-col px-8 py-20">
      <p className="text-lg pb-8 font-500">地址信息</p>
      <Form requiredMarkStyle="none" layout="horizontal" form={form} footer={null}>
        <Form.Item label="街道*">
          <div className="flex items-center justify-between">
            <Form.Item noStyle name="street" rules={[{ required: true }]}>
              <InitAutocomplete />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item label="门牌号">
          <div className={`${styles.input} flex items-center`}>
            <Form.Item noStyle name="house_num">
              <Input placeholder="门牌号" />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item label="按铃方式">
          <div className={`${styles.input} flex items-center`}>
            <Form.Item noStyle name="bell">
              <Input placeholder="按铃方式" />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea placeholder="请输入备注" autoSize={{ minRows: 5, maxRows: 7 }} />
        </Form.Item>
        <div className="flex justify-center mt-10">
          <Button
            onClick={onFinish}
            className="w-[100%] h-[2.75rem]"
            block
            type="submit"
            color="primary"
            shape="rounded"
            loading="auto"
            loadingIcon={<Ellipseing />}
          >
            下一步
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AddressForm
