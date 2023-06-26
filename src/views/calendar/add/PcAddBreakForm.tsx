import React, { RefObject } from 'react'
import moment from 'moment'
import HeaderNav from '@/components/HeaderNav'
import { Button, Checkbox } from 'antd-mobile'
import { useRequest } from 'ahooks'
import CalendarApi from '@/http/api/calendar'
import ManageApi from '@/http/api/manage'
import { store } from '@/redux'
import styles from './index.module.scss'
import Ellipseing from '@/components/Ellipseing'
import { Skeleton, DatePicker, Form, Select, Input, TimePicker } from 'antd'
import dayjs from 'dayjs'

const { TextArea } = Input
function AddBreakForm(props: any) {
  const { dateString = '', setOpen, employeeId, initSubscribeData } = props

  const navigate = useNavigate()
  const location: any = useLocation()
  const userInfo = store.getState().global.userInfo
  const [formInstance] = Form.useForm()

  const { runAsync: getEmployeeAsync } = useRequest(ManageApi.getStaffSelect, {
    manual: true,
  })
  const { run, loading: loadingRest } = useRequest((params) => CalendarApi.getRest(params), {
    manual: true,
    onSuccess(result) {
      formInstance.setFieldsValue({
        date: moment(result?.data?.start_time * 1000).toDate(),
        employee: [`${result?.data?.staff_id}`],
        startTime: dayjs(result?.data?.start_time * 1000, 'HH:mm'),
        endTime: dayjs(result?.data?.end_time * 1000, 'HH:mm'),
        remark: result?.data?.remark,
        is_subscribe: [`${result?.data?.is_subscribe}`],
      })
    },
  })

  const restId = location?.state?.restId || ''

  const [employeeList, setEmployeeList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 存在休息ID改为编辑
  useEffect(() => {
    if (restId) {
      run({ id: restId })
    }
  }, [restId])

  // 存在时间
  useEffect(() => {
    if (dateString) {
      // formInstance.setFieldValue('date', dayjs(dateString).format('YYYY-MM-DD'))
      formInstance.setFieldValue('date', dayjs(dateString))
    }
  }, [dateString])

  // 不存在时间（非编辑设置默认开始时间
  useEffect(() => {
    if (!restId && formInstance) {
      // 获取当前时间的H mm
      let now_h: any = moment().format('H')
      let now_m: any = moment().format('mm')
      if (now_m * 1 === 0) {
        now_m = `00`
      }
      if (now_m * 1 > 0 && now_m * 1 <= 15) {
        now_m = 15
      }
      if (now_m * 1 > 15 && now_m * 1 <= 30) {
        now_m = 30
      }
      if (now_m * 1 > 30 && now_m * 1 <= 45) {
        now_m = 45
      }
      if (now_m * 1 > 45) {
        now_m = `00`
        if (now_h * 1 === 23) {
          now_h = `0`
        } else {
          now_h = now_h * 1 + 1
        }
      }
      // 开始时间
      const start_date = moment(dateString).format('YYYY-MM-DD')
      const start_time = moment(`${start_date} ${now_h}:${now_m}`).unix()
      // 结束时间默认为开始时间后15min
      const end_time_h = moment(start_time * 1000)
        .add(15, 'minutes')
        .format('H')
      const end_time_m = moment(start_time * 1000)
        .add(15, 'minutes')
        .format('mm')
      formInstance.setFieldsValue({
        startTime: dayjs(`${now_h}:${now_m}`, 'HH:mm'),
        endTime: dayjs(`${end_time_h}:${end_time_m}`, 'HH:mm'),
      })
    }
  }, [formInstance])

  // 存在员工id
  useEffect(() => {
    if (employeeId) {
      formInstance.setFieldsValue({
        employee: employeeId,
      })
    }
  }, [employeeId])

  // 初始化
  useEffect(() => {
    const initEmployeeData = async () => {
      if (userInfo && userInfo.user_type === 2) {
        const { data: employeeData } = await getEmployeeAsync({})
        if (employeeData && employeeData.length) {
          setEmployeeList(
            employeeData.map((item: any) => ({
              label: item.nickname,
              value: String(item.id),
            }))
          )
        }
      }
    }
    initEmployeeData()
  }, [])

  // 提交休息时间
  const onFinish = async (values: any) => {
    if (loading) return false
    setLoading(true)

    const dateString = moment(values.date).format('YYYY-MM-DD')
    const startTime = dayjs(values.startTime).format('H:mm')
    const endTime = dayjs(values.endTime).format('H:mm')
    const restParams = {
      start_time: moment(`${dateString} ${startTime}`, 'YYYY-MM-DD H:mm').unix(),
      end_time: moment(`${dateString} ${endTime}`, 'YYYY-MM-DD H:mm').unix(),
      is_subscribe: values.is_subscribe && values.is_subscribe ? 1 : 0,
      remark: values.remark || '',
    }

    let result
    if (restId) {
      // 更新休息时间
      result = await CalendarApi.editRest(
        userInfo && userInfo.user_type === 2
          ? { id: restId, staff_id: Number(values.employee), ...restParams }
          : { id: restId, ...restParams }
      )
    } else {
      // 添加休息时间
      result = await CalendarApi.restSave(
        userInfo && userInfo.user_type === 2
          ? {
              ...restParams,
              staff_id: Number(values.employee),
            }
          : restParams
      )
    }
    if (result.status === 200) {
      setOpen(false)
      initSubscribeData()
      formInstance.resetFields()
    }
    setLoading(false)
  }

  if (loadingRest) return <Skeleton />

  return (
    <div className={`${styles.AddBreakForm} max-w-[100%] !min-h-3`}>
      <div className="flex flex-col">
        <p className="text-xl pb-5 font-600">{restId ? '编辑新休息时间' : '添加新休息时间'}</p>
        <Form layout="vertical" onFinish={onFinish} form={formInstance}>
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <DatePicker placeholder="请选择日期" className="w-full" />
          </Form.Item>
          {userInfo && userInfo.user_type === 2 ? (
            <Form.Item name="employee" label="员工" rules={[{ required: true, message: '此项是必填项' }]}>
              {/* <Picker columns={[employeeList]}>{(items) => <PickerContent val={items} textType="normal" />}</Picker> */}
              <Select
                options={employeeList}
                placeholder="请选择"
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                showSearch
              />
            </Form.Item>
          ) : null}
          <div>
            <Form.Item name="startTime" label="开始时间" className={styles.halfFormItem} rules={[{ required: true }]}>
              <TimePicker showNow={false} minuteStep={15} format={'HH:mm'} placeholder="开始时间" />
            </Form.Item>
            <Form.Item name="endTime" label="结束时间" className={styles.halfFormItem} rules={[{ required: true }]}>
              <TimePicker showNow={false} minuteStep={15} format={'HH:mm'} placeholder="结束时间" />
            </Form.Item>
          </div>
          <Form.Item name="is_subscribe" className={`${styles.noLabelFormItem} ${styles.noBgFormItem}`}>
            <Checkbox.Group>
              <Checkbox value="1">休息时间允许线上预约</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="remark" label="备注" className={styles.area}>
            <TextArea placeholder="输入" />
          </Form.Item>
          <div className="flex w-full justify-center">
            <Button
              className="rounded-3xl"
              type="submit"
              color="primary"
              block
              loadingIcon={<Ellipseing />}
              loading="auto"
            >
              保存
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddBreakForm
