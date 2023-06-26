import HeaderNav from '@/components/HeaderNav'
import React, { RefObject } from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, Picker, DotLoading, DatePickerRef, Toast } from 'antd-mobile'
import SelectUnit from '@/components/SelectUnit'
import TimePriceItem from '../../components/TimePriceItem'
import Ellipseing from '@/components/Ellipseing'
import { useRequest, useSize } from 'ahooks'
import { store } from '@/redux'
import { pickBy, identity, differenceWith, isEqual } from 'lodash'
import InformationApi from '@/http/api/information'
import ManageApi from '@/http/api/manage'
import { CloseOutline } from 'antd-mobile-icons'
import { Select } from 'antd'

function Promote() {
  const [form] = Form.useForm()
  const navigator = useNavigate()
  const { region } = store.getState().global.areaRegion
  const location: any = useLocation()
  const size = useSize(document.querySelector('body'))

  const [costUnit, setCostUnit] = useState<string>('')

  const [eatInlist, setEatInlist] = useState()
  const [takeOutlist, setTakeOutlist] = useState()
  const [timePicker, setTimePicker] = useState([])

  const { data, loading } = useRequest(() => InformationApi.getInformationList({ type: 9 }), {
    onSuccess(res) {
      setTimePicker(res?.data)
    },
  })
  const { loading: detailLoading } = useRequest(() => ManageApi.getOnlineDetail({}), {
    onSuccess: (res) => {
      // 区号
      res.data.region = [res.data.region]
      // 最小时长
      res.data.min_duration = [`${res.data.min_duration}`]
      // 设置成本
      if (res.data.cost_type === 1) {
        setCostUnit('%')
      }
      if (res.data.cost_type === 2) {
        setCostUnit('$')
        setEatInlist(res.data.cost.eat_in)
        setTakeOutlist(res.data.cost.take_out)
      }
      form.setFieldsValue({ ...res.data })
    },
  })

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      values.region = values.region[0]
      values.min_duration = values.min_duration[0]
      // 堂食
      const eatInArr: any = []
      if (eatInlist && costUnit === '$') {
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
      if (takeOutlist && costUnit === '$') {
        let takeOutObj = {}
        Object.keys(takeOutlist).map((key) => {
          takeOutObj = {
            price: values.take_out[`price_${key}`],
            time: values.take_out[`time_${key}`][0],
          }
          takeOutArr.push(takeOutObj)
        })
      }

      if (costUnit === '$') {
        values.cost = {
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

        if (!values.cost.eat_in.length && !values.cost.take_out.length) {
          return Toast.show('请至少选择一个')
        }

        if (values.cost.eat_in.length) {
          values.cost.eat_in.map((item: any) => {
            if (!item.price || !item.time) {
              throw Toast.show('请完善或清空')
            }
          })
        }

        if (values.cost.take_out.length) {
          values.cost.take_out.map((item: any) => {
            if (!item.price || !item.time) {
              throw Toast.show('请完善或清空')
            }
          })
        }
      }

      if (costUnit === '$') {
        values.cost_type = 2
        if (values.cost.take_out.length === 0) {
          delete values.cost.take_out
        }
        if (values.cost.eat_in.length === 0) {
          delete values.cost.eat_in
        }
        values.cost = JSON.stringify(values.cost)

        delete values.eat_in
        delete values.take_out
      } else {
        values.cost_type = 1
      }

      values = pickBy(values, identity)
      const res = await ManageApi.nowPromotion({ ...values })
      if (res.status === 200) {
        navigator('/manage/add/channel')
      }
    })
  }

  if (loading || detailLoading) return <DotLoading color="primary" />

  return (
    <div
      className={`${styles.AddpromoteForm} pt-[48px] pb-[90px] bg-[#fff] sm:(!min-h-[calc(100vh-60px)] p-0 flex justify-center items-center)`}
    >
      <HeaderNav renderRight={false} title={'填写推广资料'} border />
      <div className="flex flex-col px-8 py-12 sm:(w-400px)">
        <p className="font-600 text-2xl pb-4">编辑成本</p>
        <Form form={form} requiredMarkStyle="none" layout="horizontal" footer={null}>
          <Form.Item label="成本">
            <div className="flex items-center">
              <div className={`${styles.cost} flex items-center mr-2`}>
                <span className="text-xs pl-3 w-6 flex items-center justify-center">{costUnit}</span>
                {costUnit === '$' && (
                  <Form.Item noStyle rules={[{ required: false }]}>
                    <Input disabled placeholder="0.00" className={`${styles.input}`} />
                  </Form.Item>
                )}
                {costUnit !== '$' && (
                  <Form.Item noStyle name="cost" rules={[{ required: true }]}>
                    <Input placeholder="0.00" className={`${styles.input}`} />
                  </Form.Item>
                )}
              </div>
              <SelectUnit
                valueUnit={costUnit}
                changeConfirm={(val) => {
                  setCostUnit(val)
                  form.setFieldsValue({ cost: '' })
                }}
                leftUnit="%"
                rightUnit="$"
              />
            </div>
          </Form.Item>
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
                  form={form}
                  timePicker={timePicker}
                  list={takeOutlist}
                  setList={setTakeOutlist}
                  keyTitle="take_out"
                />
              </Form.Item>
            </>
          )}
          <Form.Item name="min_price" label="每单最低价" rules={[{ required: true }]}>
            <Input placeholder="每单最低价" />
          </Form.Item>
          <Form.Item
            name="min_duration"
            label="最低时长"
            trigger="onConfirm"
            onClick={(e, PickerRef: RefObject<DatePickerRef>) => {
              if (size?.width && size?.width > 640) return false
              PickerRef.current?.open() // ⬅️
            }}
            rules={[{ required: true }]}
          >
            {size?.width && size?.width > 640 ? (
              <Select
                style={{ width: '100%' }}
                onChange={(val) => {
                  form.setFieldsValue({
                    min_duration: [val],
                  })
                }}
                options={timePicker}
              />
            ) : (
              <Picker columns={[timePicker]}>
                {(value: any) => (
                  <span className="text-xs rounded-3xl bg-[#f7f7f7] min-h-8 pl-3 flex items-center">
                    {value[0]?.label || <span className="text-color-[#ccc]">请选择最低时长</span>}
                  </span>
                )}
              </Picker>
            )}
          </Form.Item>
          <Form.Item
            name="region"
            label="地区"
            trigger="onConfirm"
            onClick={(e, PickerRef: RefObject<DatePickerRef>) => {
              if (size?.width && size?.width > 640) return false
              PickerRef.current?.open() // ⬅️
            }}
            rules={[{ required: true }]}
          >
            {size?.width && size?.width > 640 ? (
              <Select
                style={{ width: '100%' }}
                onChange={(val) => {
                  form.setFieldsValue({
                    region: [val],
                  })
                }}
                options={region}
              />
            ) : (
              <Picker columns={[region]}>
                {(value: any) => (
                  <span className="text-xs rounded-3xl bg-[#f7f7f7] min-h-8 pl-3 flex items-center">
                    {value[0]?.label || <span className="text-color-[#ccc]">请选择地区</span>}
                  </span>
                )}
              </Picker>
            )}
          </Form.Item>
          <div className="<sm:(fixed-b-btn) flex sm:(mt-5)">
            <Button
              onClick={onFinish}
              className="w-[70%] h-[2.75rem] sm:(w-120px)"
              block
              shape="rounded"
              type="submit"
              color="primary"
              loading="auto"
              loadingIcon={<Ellipseing />}
            >
              立即推广
            </Button>
          </div>
        </Form>
      </div>
      {
        size?.width && size?.width >= 640 ? 
        <div onClick={() => navigator(-1)} className="fixed top-80px right-40px">
          <CloseOutline fontSize={24} className="cursor-pointer" />
        </div> :
        null
      }
    </div>
  )
}

export default Promote
