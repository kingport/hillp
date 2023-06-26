import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import UserApi from '@/http/api/user'
import { store } from '@/redux'
import { Button, Dialog, Radio } from 'antd-mobile'
import moment from 'moment'
import React from 'react'

const CancellationApply = () => {
  const user_id = store.getState().global.userId
  const navigator = useNavigate()
  const [value, setChecked] = useState(false)

  return (
    <div className="flex flex-col pt-[48px] pb-[90px] sm:(justify-between)">
      <HeaderNav renderRight={false} title="注销申请" />
      <div className="flex flex-col text-sm px-10 py-12 text-color-[#000]">
        <p className="font-600 pb-8">Hiilp 注销须知</p>
        <p className="font-500 pb-8">为保证你的帐号安全，在你提交的注销申请生 效前，需同时满足以下条件：</p>
        <p className="font-500">1.帐号处于安全状态</p>
        <p className="pb-8">帐号处于正常使用状态，无被盗风险</p>
        <p className="font-500">2.帐号财产已结清</p>
        <p className="pb-8">
          没有资产、欠款、未结清的资金和虚拟权益，本帐号及通过本帐号接入的第三方中没有未完成或存在争议的服务。
        </p>
        <p className="font-500"> 3.帐号权限解除</p>
        <p className="pb-8">帐号已解除与其他产品的授权登录或绑定关系。</p>
        <p className="font-500">4.帐号无任何纠纷，包括投诉举报 </p>
      </div>
      <div className="<sm:(fixed-b-btn) flex flex-col sm:(flex-row items-center justify-end)">
        <Radio
          onChange={(val) => setChecked(val)}
          checked={value}
          style={{ '--icon-size': '14px' }}
          className="flex items-center"
        >
          <p className="text-xs text-color-[#8b8b8b]">点击代表您已同意《Hiilp注销须知》</p>
        </Radio>
        <Button
          onClick={() => {
            if (!value) return false
            Dialog.show({
              content: (
                <div className="font-600 text-center pb-2 text-sm">
                  <p>你的帐号已提交注销申请，</p>
                  <p className="pt-1">将于{moment().format('YYYY-MM-DD')}删除。</p>
                  <p className="text-xs pt-4 font-400 text-color-[#000]">
                    如您想放弃注销流程，请点击“放弃
                    <br />
                    注销”；如确定注销此帐号，点击“了
                    <br />
                    解”后可通过其他帐号进行登录。
                  </p>
                </div>
              ),
              closeOnAction: true,
              actions: [
                [
                  {
                    key: 'cancel',
                    text: '放弃注销',
                    className: 'dialog-cancel',
                  },
                  {
                    key: 'confirm',
                    text: '了解',
                    className: 'dialog-confirm',
                    onClick: async () => {
                      const res = await UserApi.delAccount({
                        user_id,
                      })
                      if (res.status === 200) {
                        navigator('/user')
                      }
                    },
                  },
                ],
              ],
            })
          }}
          className="w-[70%] sm:(w-[30%] ml-4)"
          shape="rounded"
          block
          type="submit"
          size="large"
          color="primary"
          loading="auto"
          loadingIcon={<Ellipseing />}
        >
          提交注销申请
        </Button>
      </div>
    </div>
  )
}

export default CancellationApply
