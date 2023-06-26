import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, Picker, Avatar, Toast, DotLoading, Dialog } from 'antd-mobile'
import SelectUnit from '@/components/SelectUnit'
import TimePriceItem from '../../components/TimePriceItem'
import Ellipseing from '@/components/Ellipseing'
import UploadApi from '@/http/api/upload'
import { useRequest, useSize } from 'ahooks'
import { store } from '@/redux'
import { pickBy, identity } from 'lodash'
import InformationApi from '@/http/api/information'
import ManageApi from '@/http/api/manage'
import { Dropdown, MenuProps } from 'antd'

function AddChannelForm() {
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

  const { loading } = useRequest(() => InformationApi.getInformationList({ type: 9 }), {
    onSuccess(res) {
      timeList(res?.data)
    },
  })
  const { data: detail, run } = useRequest(() => ManageApi.getChannelDetail({ id: location?.state?.id }), {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ ...res.data })
      // 设置手机区号
      setPhoneCode([area.find((a: any) => a.label === res?.data?.channel_area)?.name])
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

  const timeList = (list: any = []) => {
    list.map((x: any) => {
      x.value = x.remark
      x.label = x.name
    })
    setTimePicker(list)
  }

  useEffect(() => {
    if (location?.state?.id) {
      run()
    }
  }, [location?.state?.id])

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (phoneCode) {
        values.channel_area = area.find((a: any) => a.name === phoneCode[0])?.label
      }
      if (avatarInfo?.file_path) {
        values.channel_head = avatarInfo?.file_path
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

      values = pickBy(values, identity)

      // 修改成本二次确认
      if (detail?.data?.cost !== values?.cost && detail?.data?.type === 3) {
        Dialog.show({
          content: (
            <div className="font-600 text-center pb-2 text-xl">
              <p>签约渠道更改成本需对方同意</p>
              <p>是否确认更改</p>
            </div>
          ),
          closeOnAction: true,
          actions: [
            [
              {
                key: 'cancel',
                text: '取消',
                className: 'dialog-cancel',
                onClick() {
                  //
                  return
                },
              },
              {
                key: 'confirm',
                text: '确认',
                className: 'dialog-confirm',
                async onClick() {
                  let res
                  if (isEdit) {
                    values.type = detail?.data?.type
                    values.id = location.state?.id
                    res = await ManageApi.editChannel({ ...values })
                  } else {
                    res = await ManageApi.addChannel({ ...values })
                  }
                  if (res.status === 200) {
                    navigator('/manage/channel/list')
                  }
                },
              },
            ],
          ],
        })
      } else {
        let res
        if (isEdit) {
          values.type = detail?.data?.type
          values.id = location.state?.id
          res = await ManageApi.editChannel({ ...values })
        } else {
          res = await ManageApi.addChannel({ ...values })
        }
        if (res.status === 200) {
          navigator('/manage/channel/list')
        }
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
      className={`${styles.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff] sm:(p-0 flex justify-center !min-h-[calc(100vh-60px)])`}
    >
      <HeaderNav renderRight={false} title={'填写渠道资料'} border />
      <div className="flex flex-col px-10 py-12 sm:(w-500px)">
        <Form form={form} requiredMarkStyle="none" layout="horizontal" footer={null}>
          <div className="flex items-center">
            <Avatar
              style={{
                '--border-radius': '50%',
                '--size': '80px',
              }}
              className="mr-5"
              src={avatarInfo?.file_url}
            />
            <Button
              loading="auto"
              onClick={async () => {
                await fileInputEl.current.click()
              }}
              className="bg-[#f3f3f3] border-0"
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
                <p className="min-w-30px sm:(hidden)">{phoneCode}</p>
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
          <div className="border-b my-8"></div>
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
                  isEdit={isEdit}
                  timePicker={timePicker}
                  list={eatInlist}
                  setList={setEatInlist}
                  keyTitle="eat_in"
                  form={form}
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
          <div className="border-b my-8"></div>
          <Form.Item layout="vertical" name="address" label="地址（选填）">
            <Input placeholder="工作地点" />
          </Form.Item>
          <div className="<sm:(fixed-b-btn) flex sm:(mt-5)">
            <Button
              onClick={onFinish}
              className="w-[70%] h-[2.75rem] rounded-xl sm:(w-120px rounded-3xl)"
              block
              type="submit"
              color="primary"
              loading="auto"
              loadingIcon={<Ellipseing />}
            >
              {isEdit ? '更新' : ' 添加'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddChannelForm
