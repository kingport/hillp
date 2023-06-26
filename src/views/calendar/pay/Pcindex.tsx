import React, { RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, Form, Toast, Button } from 'antd-mobile'
import { getRandomString } from '@/utils/util'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import InformationApi from '@/http/api/information'
import { map, sum, last } from 'lodash'
import { Select, Input, Divider } from 'antd'
import LineIconLeft from '@/assets/line-left.png'

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

  const onFinish = () => {
    const arr: any = []
    form.validateFields().then((values) => {
      formItemList.map((item) => {
        arr.push({
          information_id: values[`method_${item}`],
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
    })
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
    <div className={`${styles.CalendarPay} flex justify-center items-center h-[100vh]`}>
      <div className="text-xl flex z-99 items-center justify-between fixed top-0 bg-[#fff] font-600 py-10 border-b-width-1px text-center border-solid border-color-[#e7eaea] w-full">
        <p></p>
        <p>支付方式</p>
        <SvgIcon
          name="nav-cancel"
          onClick={() => navigate('/calendar')}
          className="w-[20px] h-[20px] mr-4 cursor-pointer"
        />
      </div>
      <div className="flex w-full h-full pt-20">
        <div className="flex-1 relative bg-[#fcfcfd]">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer items-center <sm:(hidden) font-600 fixed top-30 left-20"
          >
            <Image src={LineIconLeft} className="mr-4 w-30px" />
            返回
          </div>
          <div className="ml-30 py-50 w-500px">
            <div className="flex mb-4 mr-16 text-center">
              <div className={`${styles.LeftItem} text-xs font-600`}>价格</div>
              <div className={`${styles.RightItem} text-xs font-600`}>支付方式</div>
            </div>
            <Form requiredMarkStyle="none" layout="horizontal" form={form} footer={null}>
              {formItemList.map((item, index) => (
                <div className={`${styles.FormItemWrapper} flex items-center`} key={index}>
                  <div className="flex flex-grow mr-2">
                    <Form.Item noStyle name={`price_${item}`} rules={[{ required: true }]}>
                      <Input addonBefore="$" size="large" className="mr-2" />
                    </Form.Item>
                    <Form.Item
                      className={`${styles.RightItem} flex-shrink-0 ml-1`}
                      name={`method_${item}`}
                      rules={[{ required: true, message: '此项是必填项' }]}
                      noStyle
                    >
                      <Select style={{ width: '100%' }} options={methodList} size="large" />
                    </Form.Item>
                  </div>
                  <div
                    onClick={() => onMinusClick(index)}
                    className={`flex cursor-pointer flex-shrink-0 ml-2 shadow-sm w-[1.5rem] h-[1.5rem] justify-center items-center bg-[#fff] rounded-full ${
                      formItemList.length === 1 ? 'invisible' : ''
                    }`}
                  >
                    <SvgIcon name="delect" className="w-[10px] h-[1px]" />
                  </div>
                  {data?.data?.length > formItemList.length && (
                    <div
                      onClick={() => onAddClick()}
                      className="flex cursor-pointer flex-shrink-0 ml-2 justify-center items-center w-[1.5rem] h-[1.5rem] rounded-full bg-[#2A4948]"
                    >
                      <SvgIcon name="add" style={{ color: '#fff' }} className="w-[10px] h-[10px]" />
                    </div>
                  )}
                </div>
              ))}
            </Form>
          </div>
        </div>
        <div className="w-300px flex flex-col justify-between items-center border border-color-[#e3e4e4] border-solid border-r-0 border-t-0 border-b-0 pt-20 px-5">
          <div className="w-full">
            <div className="flex justify-center items-center">
              <SvgIcon name="incall" className="w-22px h-22px mr-4" />
              {state?.payInfo?.server_type === 1 ? '堂食INCALL' : '外卖TAKEOUT'}
            </div>
            <div className="flex justify-between items-center pt-12 w-full">
              <div className="text-xs flex flex-col">
                <span className="font-600 text-sm text-color-[#777]">基础服务</span>
                <span className="text-xs text-color-[#b4b4b4]">{state?.payInfo?.basics_server || '--'}</span>
              </div>
              <span className="text-xs text-color-[#777]">${state?.payInfo?.basics_price || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center pt-3 w-full">
              <div className="text-xs flex flex-col">
                <span className="font-600 text-sm text-color-[#777]">额外服务</span>
                <span className="text-xs text-color-[#b4b4b4]">{state?.payInfo?.extra_server || '--'}</span>
              </div>
              <span className="text-xs text-color-[#777]">${state?.payInfo?.extra_price || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center pt-3 w-full">
              <div className="text-xs flex flex-col">
                <span className="font-600 text-sm text-color-[#777]">定金</span>
              </div>
              <span className="text-xs text-color-[#777]">${state?.payInfo?.earnest || '0.00'}</span>
            </div>
          </div>
          <div className="flex flex-col w-[90%]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-500">应收款</span>
              <span>${state?.payInfo?.pay_amount * 1}</span>
            </div>
            {formItemList?.map((item: any, index: number) => {
              const values = form.getFieldsValue()
              const method = methodList?.find(
                (field: any, index: number) => field?.id === values[`method_${item}`]
              )?.label
              return (
                <div key={index} className="flex pt-2 items-center justify-between text-xs">
                  <span className="font-500 text-color-[#777]">{method || '---'}</span>
                  <span className="text-color-[#777]">${values[`price_${item}`]}</span>
                </div>
              )
            })}
            <Divider />
            <div className="flex items-center justify-between">
              <span className="fon-600">总计</span>
              <span>${state?.payInfo?.pay_amount * 1}</span>
            </div>
            <Divider />
            <Button onClick={onFinish} color="primary" className="mb-4 w-[80%] m-auto">
              继续
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPay
