import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, Picker, Avatar, Dialog } from 'antd-mobile'
import SelectUnit from '@/components/SelectUnit'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import { useSize } from 'ahooks'

function Edit() {
  const [phonePickVisible, setPhonePickVisible] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<(string | null)[]>(['+81'])
  const [costUnit, setCostUnit] = useState<string>('$')
  const [feeUnit, setFeeUnit] = useState<string>('%')
  const [visible, setVisible] = useState<boolean>(false)
  const navigator = useNavigate()
  const size = useSize(document.querySelector('body'))

  const onFinish = (values: any) => {
    // TODO
  }

  return (
    <div className={`${styles.AddEmployeeForm} pt-[48px] pb-[90px] bg-[#fff]`}>
      <HeaderNav renderRight={false} title={'个人信息'} border />
      <div className="flex flex-col px-10 py-12">
        <Form requiredMarkStyle="none" onFinish={onFinish} footer={null}>
          <div className="flex items-center">
            <Avatar
              style={{
                '--border-radius': '50%',
                '--size': '80px',
              }}
              className="mr-5"
              src={''}
            />
            <Button className="bg-[#f3f3f3] border-0" shape="rounded">
              上传头像
            </Button>
          </div>
          <p className="pt-12 pb-4">基本资料</p>
          <Form.Item name="pwd" label="个人昵称*" rules={[{ required: true }]}>
            <Input placeholder="昵称" />
          </Form.Item>
          <Form.Item name="name" label="邮箱*" rules={[{ required: true }]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机*" rules={[{ required: true }]}>
            <div className={styles.phone}>
              <div
                onClick={() => setPhonePickVisible(true)}
                className={`${styles.phoneCode} text-xs h-full pl-3 pr-2 flex items-center justify-center`}
              >
                <span className="w-25px">{phoneCode}</span>
                <SvgIcon name="phone-bottom" className="w-[5px] h-[3px] ml-2" />
              </div>
              <Picker
                columns={[
                  [
                    { label: '+86', value: '1' },
                    { label: '+91', value: '2' },
                  ],
                ]}
                visible={phonePickVisible}
                onClose={() => {
                  setPhonePickVisible(false)
                }}
                value={phoneCode}
                onConfirm={(v: (string | null)[]) => {
                  setPhoneCode(v)
                }}
              />
              <Input placeholder="请输入手机号码" className={styles.input} />
            </div>
          </Form.Item>
          <Form.Item name="name1" label="员工成本*" rules={[{ required: true }]}>
            <div className="flex items-center">
              <div className={`${styles.cost} flex min-w-[70%] items-center mr-2`}>
                <span className="text-xs pl-3 w-6 flex items-center justify-center">{costUnit}</span>
                <Input placeholder="0.00" className={`${styles.input}`} />
              </div>
              <SelectUnit valueUnit={costUnit} changeConfirm={(val) => setCostUnit(val)} leftUnit="%" rightUnit="$" />
            </div>
          </Form.Item>
          <div className="fixed-b-btn flex">
            <Button
              onClick={() => setVisible(true)}
              className="w-[12%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
              block
            >
              <SvgIcon name="point" className="w-[15px] h-[3px]" />
            </Button>
            <Button
              onClick={() => {
                Dialog.show({
                  content: (
                    <div className="font-600 text-center pb-2 text-xl">
                      <p>该渠道为签约员工更改成本需对方同意，</p>
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
                      },
                      {
                        key: 'confirm',
                        text: '确认',
                        className: 'dialog-confirm',
                      },
                    ],
                  ],
                })
              }}
              className="w-[56%] h-[2.75rem] rounded-xl"
              block
              type="submit"
              color="primary"
              loadingIcon={<></>}
            >
              保存
            </Button>
          </div>
        </Form>
        <HiilpActionSheet
          actions={[
            {
              text: '编辑详细资料',
              key: 'editDetail',
              onClick: () => {
                navigator('/manage/employee/info/edit/detail')
              },
            },
          ]}
          visible={visible}
          setVisible={setVisible}
        />
      </div>
    </div>
  )
}

export default Edit
