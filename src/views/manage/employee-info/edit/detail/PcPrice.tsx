import React from 'react'
import styles from './index.module.scss'

import { Button, Form, Toast } from 'antd-mobile'
import TimePriceItem from '../../../components/TimePriceItem'
import { store } from '@/redux'
import { map, differenceWith, isEqual } from 'lodash'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { Select } from 'antd'

function Price(props: any) {
  const {
    eatInlist,
    setEatInlist,
    takeOutlist,
    setTakeOutlist,
    costUnit,
    setCostUnit,
    timePicker,
    extendData,
    swiperIndex,
    serviceList,
    value,
  } = props

  const [form] = Form.useForm()
  const employeeForm = store.getState().global.employeeForm

  // const [eatInlist, setEatInlist] = useState<any>()
  // const [takeOutlist, setTakeOutlist] = useState<any>()
  // const [costUnit, setCostUnit] = useState<string>('%')

  useEffect(() => {
    if (extendData?.data) {
      let formData :any = extendData?.data
      setCostUnit('$')
      // 用户编辑时的缓存数据
      if (employeeForm.sales_cost && employeeForm.server_ids) {
        formData = employeeForm
      }

      if (formData.sales_cost) {
        // 堂食
        if (formData.sales_cost.eat_in?.length > 0) {
          setEatInlist(formData.sales_cost.eat_in)
        } else {
          setEatInlist([{}])
        }

        // 外卖
        if (formData.sales_cost.take_out?.length > 0) {
          setTakeOutlist(formData.sales_cost.take_out)
        } else {
          setTakeOutlist([{}])
        }
      }

      // 个人账号返回详情字段不一样
      if (formData.cost) {
        // 堂食
        if (formData.cost.eat_in?.length > 0) {
          setEatInlist(formData.cost.eat_in)
        } else {
          setEatInlist([{}])
        }

        // 外卖
        if (formData.cost.take_out?.length > 0) {
          setTakeOutlist(formData.cost.take_out)
        } else {
          setTakeOutlist([{}])
        }
      }
    }
  }, [swiperIndex, extendData])

  const onFinish = () => {
    form.validateFields().then((values) => {
      // 堂食
      const eatInArr: any = []
      if (eatInlist) {
        let eatInObj = {}
        Object.keys(eatInlist).map((key) => {
          eatInObj = {
            price: values.eat_in[`price_${key}`],
            time: values.eat_in[`time_${key}`][0],
          }
          eatInArr.push(eatInObj)
        })
      }
      // 外卖
      const takeOutArr: any = []
      if (takeOutlist) {
        let takeOutObj = {}
        Object.keys(takeOutlist).map((key) => {
          takeOutObj = {
            price: values.take_out[`price_${key}`],
            time: values.take_out[`time_${key}`][0],
          }
          takeOutArr.push(takeOutObj)
        })
      }

      values.sales_cost = {
        eat_in: differenceWith(
          eatInArr,
          [
            { time: undefined, price: undefined },
            { time: '', price: '' },
          ],
          isEqual
        ),
        take_out: differenceWith(
          takeOutArr,
          [
            { time: undefined, price: undefined },
            { time: '', price: '' },
          ],
          isEqual
        ),
      }

      if (!values.sales_cost.eat_in.length && !values.sales_cost.take_out.length) {
        return Toast.show('外卖/堂食请至少选择一个')
      }

      if (values.sales_cost.eat_in.length) {
        values.sales_cost.eat_in.map((item: any) => {
          if (!item.price || !item.time) {
            throw Toast.show('请完善或清空')
          }
        })
      }

      if (values.sales_cost.take_out.length) {
        values.sales_cost.take_out.map((item: any) => {
          if (!item.price || !item.time) {
            throw Toast.show('请完善或清空')
          }
        })
      }

      values.server_ids = value
      delete values.take_out
      delete values.eat_in
      store.dispatch(updataEmployeeForm({ ...values, ...employeeForm }))
      // next()
    })
  }

  return (
    <div className={`bg-[#fff] flex flex-col relative pt-10`}>
      <div className="flex flex-col px-4">
        <p className="pb-4 py-12">收费标准</p>
        {costUnit === '$' && (
          <>
            <Form.Item className={`${styles.dineIn} mt-4`} name="eat_in" label="堂食">
              <TimePriceItem
                form={form}
                timePicker={timePicker}
                list={eatInlist}
                setList={setEatInlist}
                keyTitle="eat_in"
              />
            </Form.Item>
            <Form.Item className={`${styles.takeOut}`} name="take_out" label="外卖">
              <TimePriceItem
                timePicker={timePicker}
                list={takeOutlist}
                setList={setTakeOutlist}
                keyTitle="take_out"
                form={form}
              />
            </Form.Item>
            <Form.Item
              name="base_ids"
              label="基础服务"
              rules={[{ required: true, message: '请选择' }]}
              className={`${styles.raceContainer} pt-10`}
            >
              <Select
                style={{ width: '100%' }}
                className="!rounded-sm <sm:(hidden)"
                maxTagCount="responsive"
                mode="multiple"
                onChange={(val) => {
                  form.setFieldsValue({
                    base_ids: val,
                  })
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                options={serviceList?.data?.basis}
              >
              </Select>
            </Form.Item>
            <Form.Item name="extra_ids" label="额外服务" className={`${styles.raceContainer}`}>
              <Select
                style={{ width: '100%' }}
                onChange={(val) => {
                  if (val) {
                    form.setFieldsValue({
                      extra_ids: val,
                    })
                  }
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                maxTagCount="responsive"
                mode="multiple"
                className="!rounded-sm <sm:(hidden)"
                options={serviceList?.data?.extra}
              ></Select>
            </Form.Item>
          </>
        )}
      </div>
    </div>
  )
}

export default Price
