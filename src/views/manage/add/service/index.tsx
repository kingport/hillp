import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Button, TextArea, Form, Input, Picker, Toast } from 'antd-mobile'
import styles from './index.module.scss'
import ManageApi from '@/http/api/manage'
import Ellipseing from '@/components/Ellipseing'
import { identity, pickBy } from 'lodash'
import { useMount, useRequest } from 'ahooks'

function Service() {
  const location: any = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [areaPickVisible, setAreaPickVisible] = useState<boolean>(false)
  const [areaCode, setAreaCode] = useState<(string | null)[]>([])

  const isEdit = location?.state?.type === 'edit'
  const id = location?.state?.id

  const onFinish = async () => {
    await form.validateFields().then(async (values) => {
      if (!areaCode.length) Toast.show('请选择分类')

      if (areaCode.length) {
        values.type = areaCode[0]
      }
      values = pickBy(values, identity)

      if (isEdit) {
        values.id = location?.state?.id
      }

      let res
      if (isEdit) {
        res = await ManageApi.editServe({ ...values })
      } else {
        res = await ManageApi.addServer({ ...values })
      }

      if (res.status === 200) {
        navigate(-1)
        // if (location?.state?.type) {
        //   // navigate('/manage/service/list', {
        //   //   state: {
        //   //     type: 'service',
        //   //   },
        //   // })
        //   // navigate(-1)
        //   navigate('/manage/employee/info/edit/detail', {
        //     state: {
        //       id: location?.state?.id,
        //       type: location?.state?.type,
        //       onlineUser: location?.state?.id ? '' : 'onlineUser',
        //     },
        //   })
        // } else {
        //   navigate('/manage/service/list')
        // }
      }
    })
  }

  const { run } = useRequest(() => ManageApi.getServerDetail({ id }), {
    onSuccess: (result) => {
      form.setFieldsValue({ ...result?.data })
      setAreaCode([result?.data?.type])
    },
    manual: true,
  })

  useMount(() => {
    if (isEdit) {
      run()
    }
  })

  useEffect(() => {
    if (`${areaCode[0]}` === '1') {
      form.setFieldsValue({
        price: '0',
      })
    }
  }, [areaCode])

  return (
    <div className={`${styles.service} pt-[48px]`}>
      <HeaderNav renderLeft={false} />
      <div className="flex flex-col px-10 py-12">
        <p className="text-2xl font-600 pb-10">
          {location?.state?.type === 'edit' && '编辑服务'}
          {location?.state?.type !== 'edit' && '添加新服务'}
        </p>
        <Form form={form} layout="horizontal" requiredMarkStyle="none" footer={null}>
          <div className={styles.password}>
            <Form.Item name="name" label="项目" rules={[{ required: true }]}>
              <Input placeholder="请输入项目名称" />
            </Form.Item>
          </div>
          <div className={`${styles.password}`}>
            <Form.Item name="price" label="定价" rules={[{ required: true }]}>
              <Input placeholder="请输入定价" disabled={`${areaCode[0]}` === '1'} />
            </Form.Item>
          </div>
          <Form.Item>
            <div onClick={() => setAreaPickVisible(true)} className={`flex justify-between items-center`}>
              <p className="text-sm">分类</p>
              <div className="flex rounded-2xl items-center ml-3 h-[38px] flex-1 justify-end bg-[#f7f7f7]">
                <p className="text-sm pl-3 w-full text-left">
                  {`${areaCode[0]}` === '1' && '基础项目'}
                  {`${areaCode[0]}` === '2' && '额外项目'}
                </p>
                <SvgIcon name="phone-bottom" className="w-[8px] h-[4px] mr-4" />
              </div>
              <Form.Item arrow={<></>}>
                <Picker
                  columns={[
                    [
                      { label: '基础项目', value: '1' },
                      { label: '额外项目', value: '2' },
                    ],
                  ]}
                  visible={areaPickVisible}
                  onClose={() => {
                    setAreaPickVisible(false)
                  }}
                  onConfirm={(v: (string | null)[]) => {
                    setAreaCode(v)
                  }}
                />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea placeholder="请输入备注" autoSize={{ minRows: 7, maxRows: 7 }} />
          </Form.Item>
          {location?.state?.type === 'edit' && (
            <div className="fixed-b-btn flex justify-around">
              <Button
                onClick={async () => {
                  const res = await ManageApi.deleteServe({ id })
                  if (res.status === 200) {
                    navigate('/manage/service/list')
                  }
                }}
                loading="auto"
                loadingIcon={<Ellipseing />}
                className="w-[30%] border-0 text-color-[red] bg-[#F3F3F3]"
                shape="rounded"
                block
                size="large"
              >
                删除
              </Button>
              <Button
                onClick={onFinish}
                className="w-[30%]"
                shape="rounded"
                block
                type="submit"
                size="large"
                color="primary"
                loading="auto"
                loadingIcon={<Ellipseing />}
              >
                保存
              </Button>
            </div>
          )}
          {location?.state?.type !== 'edit' && (
            <div className="fixed-b-btn w-full">
              <Button
                onClick={onFinish}
                className="w-[70%]"
                shape="rounded"
                block
                type="submit"
                size="large"
                color="primary"
                loading="auto"
                loadingIcon={<Ellipseing />}
              >
                确认
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  )
}

export default Service
