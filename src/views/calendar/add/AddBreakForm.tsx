import React, { RefObject } from 'react'
import moment from 'moment'
import HeaderNav from '@/components/HeaderNav'
import PickerContent from '../components/PickerContent'
import { Button, Form, Checkbox, TextArea, Picker, DatePicker, PickerRef } from 'antd-mobile'
import { useRequest } from 'ahooks'
import CalendarApi from '@/http/api/calendar'
import ManageApi from '@/http/api/manage'
import { store } from '@/redux'
import styles from './index.module.scss'
import Ellipseing from '@/components/Ellipseing'
import { Skeleton } from 'antd'

function AddBreakForm() {
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
        startTime: [
          moment(result?.data?.start_time * 1000).format('H'),
          moment(result?.data?.start_time * 1000).format('mm'),
        ],
        endTime: [
          moment(result?.data?.end_time * 1000).format('H'),
          moment(result?.data?.end_time * 1000).format('mm'),
        ],
        remark: result?.data?.remark,
        is_subscribe: [`${result?.data?.is_subscribe}`],
      })
    },
  })

  const dateString = location?.state?.dateString || ''
  const employeeId = location?.state?.employeeId || ''
  const restId = location?.state?.restId || ''

  const [timeColumns] = useState(() => {
    const hourColumn = []
    const minuteColumn = []

    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        const hourValue = String(i)
        hourColumn.push({ label: hourValue, value: hourValue })
      }
    }
    minuteColumn.push(
      { label: '00', value: '00' },
      { label: '15', value: '15' },
      { label: '30', value: '30' },
      { label: '45', value: '45' }
    )
    return [hourColumn, minuteColumn]
  })

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
      formInstance.setFieldValue('date', moment(dateString).toDate())
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
        startTime: [`${now_h}`, `${now_m}`],
        endTime: [`${end_time_h}`, `${end_time_m}`],
      })
    }
  }, [formInstance])

  // 存在员工id
  useEffect(() => {
    if (employeeId) {
      formInstance.setFieldsValue({
        employee: [employeeId],
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
    const restParams = {
      start_time: moment(`${dateString} ${values.startTime[0]}:${values.startTime[1]}`, 'YYYY-MM-DD H:mm').unix(),
      end_time: moment(`${dateString} ${values.endTime[0]}:${values.endTime[1]}`, 'YYYY-MM-DD H:mm').unix(),
      is_subscribe: values.is_subscribe && values.is_subscribe[0] ? 1 : 0,
      remark: values.remark || '',
    }

    let result
    if (restId) {
      // 更新休息时间
      result = await CalendarApi.editRest(
        userInfo && userInfo.user_type === 2
          ? { id: restId, staff_id: Number(values.employee[0]), ...restParams }
          : { id: restId, ...restParams }
      )
    } else {
      // 添加休息时间
      result = await CalendarApi.restSave(
        userInfo && userInfo.user_type === 2
          ? {
              ...restParams,
              staff_id: Number(values.employee[0]),
            }
          : restParams
      )
    }

    if (result.status === 200) {
      navigate('/calendar', { replace: true })
    }
    setLoading(false)
  }

  const onPickerClick = (_e: any, ref: RefObject<PickerRef>) => {
    ref.current && ref.current.open()
  }

  if (loadingRest) return <Skeleton />

  return (
    <div className={`${styles.AddBreakForm} pt-[48px] pb-[90px]`}>
      <HeaderNav renderLeft={false} />
      <div className="flex flex-col px-10 py-12">
        <p className="text-2xl font-600 pb-10">{restId ? '编辑新休息时间' : '添加新休息时间'}</p>
        <Form requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null} form={formInstance}>
          <Form.Item name="date" label="日期" rules={[{ required: true }]} trigger="onConfirm" onClick={onPickerClick}>
            <DatePicker>{(val) => <PickerContent val={val as Date} textType="date" />}</DatePicker>
          </Form.Item>
          {userInfo && userInfo.user_type === 2 ? (
            <Form.Item
              name="employee"
              label="员工"
              rules={[{ required: true }]}
              trigger="onConfirm"
              onClick={onPickerClick}
            >
              <Picker columns={[employeeList]}>{(items) => <PickerContent val={items} textType="normal" />}</Picker>
            </Form.Item>
          ) : null}
          <div>
            <Form.Item
              name="startTime"
              label="开始时间"
              className={styles.halfFormItem}
              rules={[{ required: true }]}
              trigger="onConfirm"
              onClick={onPickerClick}
            >
              <Picker columns={timeColumns}>
                {(items) => {
                  return <PickerContent val={items} textType="time" />
                }}
              </Picker>
            </Form.Item>
            <Form.Item
              name="endTime"
              label="结束时间"
              className={styles.halfFormItem}
              rules={[{ required: true }]}
              trigger="onConfirm"
              onClick={onPickerClick}
            >
              <Picker columns={timeColumns}>{(items) => <PickerContent val={items} textType="time" />}</Picker>
            </Form.Item>
          </div>
          <Form.Item name="is_subscribe" className={`${styles.noLabelFormItem} ${styles.noBgFormItem}`}>
            <Checkbox.Group>
              <Checkbox value="1">休息时间允许线上预约</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea placeholder="输入" />
          </Form.Item>
          <div className="fixed-b-btn flex">
            <Button
              className="w-[65%] h-[2.75rem] rounded-3xl"
              block
              type="submit"
              color="primary"
              loadingIcon={<Ellipseing />}
              loading={loading}
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
