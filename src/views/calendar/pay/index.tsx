import React, { RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Toast, Input, Picker, PickerRef } from 'antd-mobile'
import { getRandomString } from '@/utils/util'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import PickerContent from '../components/PickerContent'
import styles from './index.module.scss'
import moment from 'moment'
import { useRequest } from 'ahooks'
import InformationApi from '@/http/api/information'
import { map, sum, add, last } from 'lodash'
import Pcindex from './Pcindex'

function CalendarPay() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const { state } = location
  const [form] = Form.useForm()

  const { data } = useRequest(() => InformationApi.getInformationList({ type: 3 }), {
    onSuccess(res) {
      setMethodList(res?.data)
    },
  })

  const [methodList, setMethodList] = useState<any>([])
  const [formItemList, setFormItemList] = useState([getRandomString()])
  const [diffMoney, setDiffMoney] = useState(state?.payInfo?.pay_amount * 1)

  const onFinish = (values: any) => {
    const arr: any = []
    formItemList.map((item) => {
      arr.push({
        information_id: values[`method_${item}`][0],
        amount: values[`price_${item}`] * 1,
      })
    })

    if (sum(map(arr, 'amount')) === state?.payInfo?.pay_amount * 1) {
      navigate('/calendar/pay/confirm', {
        state: {
          payInfo: state?.payInfo,
          params: arr,
        },
      })
    } else {
      Toast.show('金额相加不等于支付金额')
    }
  }

  const onPickerClick = (_e: any, ref: RefObject<PickerRef>) => {
    ref.current && ref.current.open()
  }

  const onAddClick = () => {
    // 获取所有价格
    const amountArr: any = []
    formItemList.map((item) => {
      amountArr.push(form.getFieldValue(`price_${item}`) * 1)
    })
    const totalAmount = sum(amountArr)
    // 剩余价格
    const diffAmount = state?.payInfo?.pay_amount * 1 - totalAmount
    if (diffAmount <= 0) return Toast.show('请合理分配金额')
    setDiffMoney(diffAmount)

    setFormItemList([...formItemList, getRandomString()])
  }

  useEffect(() => {
    const lastItem = last(formItemList)
    form.setFieldsValue({
      [`price_${lastItem}`]: diffMoney,
    })
  }, [formItemList.length])

  const onMinusClick = (i: number) => {
    setFormItemList([...formItemList.slice(0, i), ...formItemList.slice(i + 1)])
  }

  return (
    <>
      <div className={`${styles.CalendarPay} pt-[48px] pb-[90px] sm:(hidden)`}>
        <HeaderNav title="支付方式" renderLeft={false} />
        <div className="flex flex-col">
          <div className={`${styles.PayCard} px-10 pt-12 pb-16 bg-[#FFF]`}>
            <div className={styles.BorderedViewItem}>
              <span className="text-xl font-600">
                {moment(state?.payInfo?.start_time * 1000).format('YYYY年MM月DD日 HH:mm')}
              </span>
            </div>
            <div className={`${styles.BorderedViewItem} flex flex-col`}>
              <div className="flex justify-between">
                <div className="text-xs">
                  <span className="font-600">基础服务：</span>
                  <span>{state?.payInfo?.basics_server || '--'}</span>
                </div>
                <span>${state?.payInfo?.basics_price || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <div className="text-xs">
                  <span className="font-600">额外服务：</span>
                  <span>{state?.payInfo?.extra_server || '--'}</span>
                </div>
                <span>${state?.payInfo?.extra_price || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <div className="text-xs">
                  <span className="font-600">定金</span>
                </div>
                <span>${state?.payInfo?.earnest || '0.00'}</span>
              </div>
            </div>
            <div className={`${styles.BorderedViewItem} flex flex-col pb-3`}>
              <div className="flex justify-between text-lg text-color-[#2A4948] font-600 mb-1">
                <span>{state?.payInfo?.duration / 60}hr</span>
                <span>${state?.payInfo?.total_amount || '0.00'}</span>
              </div>
            </div>
          </div>
          <div className="px-10 py-12">
            <div className="flex mb-4 mr-16 text-center">
              <div className={`${styles.LeftItem} text-xs font-600`}>价格</div>
              <div className={`${styles.RightItem} text-xs font-600`}>支付方式</div>
            </div>
            <Form requiredMarkStyle="none" layout="horizontal" form={form} onFinish={onFinish} footer={null}>
              {formItemList.map((item, index) => (
                <div className={`${styles.FormItemWrapper} flex items-center`} key={index}>
                  <div className="flex flex-grow mr-2">
                    <div className={`${styles.FormItemWithPrefix} ${styles.LeftItem} flex flex-shrink-0 mr-1`}>
                      <span className="text-xs">$</span>
                      <Form.Item name={`price_${item}`} rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </div>
                    <Form.Item
                      className={`${styles.RightItem} flex-shrink-0 ml-1`}
                      name={`method_${item}`}
                      trigger="onConfirm"
                      rules={[{ required: true }]}
                      onClick={onPickerClick}
                    >
                      <Picker columns={[methodList]}>
                        {(items) => <PickerContent val={items} textType="normal" innerHeight="18px" />}
                      </Picker>
                    </Form.Item>
                  </div>
                  <div
                    onClick={() => onMinusClick(index)}
                    className={`flex flex-shrink-0 ml-2 shadow-sm w-[1.5rem] h-[1.5rem] justify-center items-center bg-[#fff] rounded-full ${
                      formItemList.length === 1 ? 'invisible' : ''
                    }`}
                  >
                    <SvgIcon name="delect" className="w-[10px] h-[1px]" />
                  </div>
                  {data?.data?.length > formItemList.length && (
                    <div
                      onClick={() => onAddClick()}
                      className="flex flex-shrink-0 ml-2 justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#2A4948]"
                    >
                      <SvgIcon name="add" style={{ color: '#fff' }} className="w-[10px] h-[10px]" />
                    </div>
                  )}
                </div>
              ))}
              <div className="fixed-b-btn">
                <Button className="w-[65%] h-[2.75rem] rounded-3xl" block type="submit" color="primary">
                  继续
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div className="<sm:(hidden)">
        <Pcindex />
      </div>
    </>
  )
}

export default CalendarPay
