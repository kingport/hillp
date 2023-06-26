import Ellipseing from '@/components/Ellipseing'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { useRequest, useClickAway } from 'ahooks'
import { Input, Form, Skeleton, InputNumber } from 'antd'
import { Button, Dialog } from 'antd-mobile'
import React from 'react'
const { Search } = Input

const PcServerList = (props: any) => {
  const { serverList, refresh, run } = props
  const [form] = Form.useForm()
  const [active, setActive] = useState('basis')
  const [visible, setVisible] = useState(false)
  const [keyword, setKeyword] = useState('')
  const ref = useRef<any>(null)

  useClickAway(() => {
    setVisible(false)
  }, ref)

  const { runAsync } = useRequest((id) => ManageApi.deleteServe({ id }), {
    manual: true,
    onSuccess() {
      refresh()
    },
  })

  const { runAsync: addServer, loading: addLoading } = useRequest((values) => ManageApi.addServer({ ...values }), {
    manual: true,
    onSuccess() {
      refresh()
      form.resetFields()
      setVisible(false)
    },
  })

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      values.type = active === 'basis' ? 1 : 2
      if (values.price === undefined) {
        values.price = 0 
      }
      await addServer(values)
    })
  }

  useEffect(() => {
    run({
      keyword,
    })
  }, [active, keyword])

  return (
    <div ref={ref} className="flex flex-col w-556px <sm:(hidden)">
      <Skeleton loading={false}>
        <div className="flex justify-between">
          <p className="text-2xl font-600">管理服务</p>
        </div>

        <div className="flex items-center px-6 py-4 justify-between mt-5 bg-[#f4f6f6] rounded-md">
          <div>
            <Search
              placeholder="请输入"
              onSearch={(value: string) => {
                setKeyword(value)
              }}
              prefix={<SvgIcon name="pc-search" className="w-20px h-20px" style={{ color: '#2A4948' }} />}
            />
          </div>
          <div className="flex border border-color-[#eee] border-solid bg-[#fff] rounded-3xl cursor-pointer">
            <div
              onClick={() => setActive('basis')}
              className={`${active === 'basis' && 'bg-[#2A4948] text-color-[#fff] rounded-3xl'} px-3 py-2`}
            >
              基础
            </div>
            <div
              onClick={() => setActive('extra')}
              className={`${active === 'extra' && 'bg-[#2A4948] text-color-[#fff] rounded-3xl'} px-3 py-2`}
            >
              额外
            </div>
          </div>
        </div>
        {serverList?.data[active]?.map((item: any) => {
          return (
            <div
              className="flex mt-3 justify-between p-4 border border-solid border-color-[#eee] rounded-md"
              key={item?.id}
            >
              <div className="flex text-xs items-center text-color-[#4F4F4F]">
                <SvgIcon
                  onClick={() => {
                    Dialog.show({
                      content: <div className="font-600 text-center pb-2 text-xl">确定删除此项目</div>,
                      closeOnAction: true,
                      actions: [
                        [
                          {
                            key: 'cancel',
                            text: '取消',
                            className: 'dialog-cancel',
                          },
                          {
                            key: 'confirm',
                            text: '确认',
                            className: 'dialog-confirm',
                            async onClick() {
                              runAsync(item?.id)
                            },
                          },
                        ],
                      ],
                    })
                  }}
                  name="pc-delect"
                  className="w-8px h-10px cursor-pointer"
                />
                <p className="pl-3">{item?.name}</p>
              </div>
              <div className="flex text-xs text-color-[#4F4F4F]">A${item?.price}</div>
            </div>
          )
        })}
        {visible && (
          <div className="transition-all flex justify-between items-center mt-3 justify-between p-4 border border-solid border-color-[#eee] rounded-md">
            <div className="flex justify-between flex-1 w-full">
              <Form form={form} layout="inline" className="flex justify-between w-full">
                <Form.Item name="name" rules={[{ required: true, message: '请添加服务项目' }]}>
                  <Input className="rounded-3xl bg-[#f7f7f7] w-160px" placeholder="添加服务项目" />
                </Form.Item>
                <Form.Item name="price" rules={[{ required: active === 'extra', message: '请输入价格' }]}>
                  { 
                    active === 'basis' ?
                    'A$0.00' :
                    <InputNumber controls={false} className="rounded-3xl bg-[#f7f7f7] w-80px" placeholder="A$ 0.00" />
                  }
                </Form.Item>
              </Form>
            </div>
            <Button
              onClick={onFinish}
              className="rounded-3xl w-90px"
              color="primary"
              loading={addLoading}
              loadingIcon={<Ellipseing />}
            >
              确认
            </Button>
          </div>
        )}
        <div
          onClick={() => setVisible(true)}
          className="flex mt-3 justify-center cursor-pointer bg-[#f4f6f6] p-4 border border-solid border-color-[#eee] rounded-md"
        >
          <SvgIcon name="add" className="w-[10px] h-[10px]" style={{ color: '#929f9f' }} />
        </div>
      </Skeleton>
    </div>
  )
}

export default PcServerList
