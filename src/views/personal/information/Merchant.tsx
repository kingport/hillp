import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, Picker, Toast, DotLoading } from 'antd-mobile'
import SelectUnit from '@/components/SelectUnit'
import Ellipseing from '@/components/Ellipseing'
import UploadApi from '@/http/api/upload'
import { useRequest, useSize } from 'ahooks'
import { store } from '@/redux'
import { pickBy, identity } from 'lodash'
import InformationApi from '@/http/api/information'
import TimePriceItem from '@/views/manage/components/TimePriceItem'
import HiilpAvatar from '@/components/HiilpAvatat'
import PersonalApi from '@/http/api/personal'
import { Dropdown, MenuProps } from 'antd'
import { CloseOutline } from 'antd-mobile-icons'

function Merchant() {
  const fileInputEl = useRef<any>(null)
  const [form] = Form.useForm()
  const navigator = useNavigate()
  const { area } = store.getState().global.areaRegion
  const location: any = useLocation()
  const isEdit = location?.state?.id
  const size = useSize(document.querySelector('body'))

  const [phonePickVisible, setPhonePickVisible] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<(string | null)[]>([area[0].label])
  const [costUnit, setCostUnit] = useState<string>('$')
  const [avatarInfo, setAvatarInfo] = useState<any>({
    file_path: '',
    file_url: '',
  })
  const [eatInlist, setEatInlist] = useState()
  const [takeOutlist, setTakeOutlist] = useState()
  const [timePicker, setTimePicker] = useState([])

  const { data, loading } = useRequest(() => InformationApi.getInformationList({ type: 9 }), {
    onSuccess(res) {
      setTimePicker(res?.data)
    },
  })

  const { data: detail, run } = useRequest(() => PersonalApi.getChannelInfo({}), {
    onSuccess: (res) => {
      form.setFieldsValue({ ...res.data })
      // 设置手机区号
      if (res?.data?.channel_area) {
        setPhoneCode([area.find((a: any) => a.label === res?.data?.channel_area)?.label])
      }
      // 设置成本
      if (res.data.cost_type === 1) {
        setCostUnit('%')
      }
      if (res.data.cost_type === 2) {
        setEatInlist(res.data.cost.eat_in)
        setTakeOutlist(res.data.cost.take_out)
      }
      // 设置头像
      setAvatarInfo({
        file_url: res?.data?.channel_head,
        file_path: '',
      })
    },
  })

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.channel_area = area.find((a: any) => a.name === phoneCode[0])?.label
      }
      if (avatarInfo?.file_path || detail?.data?.channel_head) {
        values.channel_head = avatarInfo?.file_path || detail?.data?.channel_head
      }
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
        values.cost_type = 2
        values.cost = JSON.stringify({
          eat_in: eatInArr,
          take_out: takeOutArr,
        })
        delete values.eat_in
        delete values.take_out
      } else {
        values.cost_type = 1
      }

      // values = _.pickBy(values, _.identity)
      values = pickBy(values, identity)

      const res = await PersonalApi.updateChannel({ ...values })
      if (res.status === 200) {
        navigator(-1)
      }
    })
  }

  const handlePhoto = async (event: any) => {
    const files = [...event.target.files]
    if (files.length) {
      const res = await UploadApi.uploadFile(files)
      if (res?.status === 200) {
        Toast.show(res.data.msg)
        setAvatarInfo(res.data.data)
      }
    }
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e?.key) {
      setPhoneCode([area.find((a: any) => Number(a.value) === Number(e?.key)).label])
    }
  }

  if (loading) return <DotLoading color="primary" />

  return (
    <div
      className={`${styles.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff] sm:(p-0 !min-h-[calc(100vh-60px)] flex justify-center items-center)`}
    >
      <HeaderNav renderRight={false} title={'编辑渠道详细资料'} border />
      <div className="flex flex-col px-5 py-12 sm:(w-500px)">
        <Form form={form} requiredMarkStyle="none" layout="horizontal" footer={null}>
          <div className="flex items-center">
            <HiilpAvatar name={detail?.data?.name} headurl={avatarInfo?.file_url} />
            <Button
              loading="auto"
              onClick={async () => {
                await fileInputEl.current.click()
              }}
              className="bg-[#f3f3f3] border-0 ml-4"
              shape="rounded"
              loadingIcon={<Ellipseing />}
            >
              上传头像
            </Button>
            <input
              id="file"
              type="file"
              ref={fileInputEl} //挂载ref
              accept=".jpg,.jpeg,.png" //限制文件类型
              hidden //隐藏input
              onChange={(event) => handlePhoto(event)}
            />
          </div>
          <p className="pt-12 pb-4">基本资料</p>
          <Form.Item name="channel_name" label="渠道名称" rules={[{ required: true }]}>
            <Input placeholder="渠道名称" />
          </Form.Item>
          <Form.Item name="channel_email" label="渠道邮箱" rules={[{ required: true }]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item label="渠道手机">
            <div className={styles.phone}>
              <div
                onClick={() => {
                  if (size?.width && size?.width <= 640) {
                    setPhonePickVisible(true)
                  }
                }}
                className={`${styles.phoneCode} text-xs h-full pl-3 pr-2 flex items-center justify-center`}
              >
                <p className="min-w-30px text-center sm:(hidden)">{phoneCode}</p>
                <Dropdown
                  menu={{ items: area, onClick: handleMenuClick }}
                  className="<sm:(hidden) min-w-40px text-center"
                >
                  <a onClick={(e) => e.preventDefault()}>{phoneCode}</a>
                </Dropdown>
                <SvgIcon name="phone-bottom" className="w-[5px] h-[3px]" />
              </div>
              <Picker
                columns={[area]}
                visible={phonePickVisible}
                onClose={() => {
                  setPhonePickVisible(false)
                }}
                value={phoneCode}
                onConfirm={(v: (string | null)[]) => {
                  setPhoneCode([area.find((a: any) => a.value === v[0]).label])
                }}
              />
              <Form.Item noStyle name="channel_phone" rules={[{ required: true }]}>
                <Input placeholder="请输入手机号码" className={styles.input} />
              </Form.Item>
            </div>
          </Form.Item>
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
                  isEdit={isEdit}
                  timePicker={timePicker}
                  list={eatInlist}
                  setList={setEatInlist}
                  keyTitle="eat_in"
                />
              </Form.Item>
              <Form.Item className={`${styles.takeOut}`} name="take_out" label="外卖">
                <TimePriceItem
                  isEdit={isEdit}
                  timePicker={timePicker}
                  list={takeOutlist}
                  setList={setTakeOutlist}
                  keyTitle="take_out"
                  form={form}
                />
              </Form.Item>
            </>
          )}
          <Form.Item layout="vertical" name="address" label="地址（选填）">
            <Input placeholder="工作地点" />
          </Form.Item>
          <div className="<sm:(fixed-b-btn) flex sm:(mt-4)">
            <Button
              onClick={onFinish}
              className="w-[70%] h-[2.75rem] rounded-xl sm:(w-full)"
              block
              type="submit"
              color="primary"
              loading="auto"
              loadingIcon={<Ellipseing />}
            >
              保存
            </Button>
          </div>
        </Form>
      </div>
      <div onClick={() => navigator(-1)} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default Merchant
