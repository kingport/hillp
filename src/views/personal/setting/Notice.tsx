import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import PersonalApi from '@/http/api/personal'
import { useRequest, useResetState } from 'ahooks'
import { Button, Switch, Toast } from 'antd-mobile'
import { store } from '@/redux'
import { updataUserInfo } from '@/redux/modules/global/action'
import { CloseOutline } from 'antd-mobile-icons'

interface State {
  new_remind: boolean
  email_remind: boolean
}

const Notice = () => {
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()

  const [state, setState, resetState] = useResetState<State>({
    new_remind: userInfo?.new_remind ? true : false,
    email_remind: userInfo?.email_remind ? true : false,
  })

  const { run } = useRequest((params) => PersonalApi.systemSetting(params), {
    manual: true,
    onSuccess(res) {
      Toast.show(res.msg)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.dispatch(updataUserInfo)
    },
  })

  const onConfirm = () => {
    run({ type: 2, new_remind: state.new_remind ? 1 : 0, email_remind: state.email_remind ? 1 : 0 })
  }

  return (
    <div className="flex flex-col pt-[48px] pb-[90px] sm:(w-350px justify-center py-0)">
      <HeaderNav title="通知设置" renderRight={false} border />
      <p className="text-center font-600 text-2xl pb-10 <sm:(hidden)">通知设置</p>
      <div className="flex w-full flex-col">
        <div className="border-solid border-color-[#eee] sm:(border-none) border-b-1px flex px-10 py-10 items-center justify-between active:bg-[#f9f9fa] cursor-pointer">
          <div className="flex flex-col">
            <p className="text-sm">新消息提醒</p>
          </div>
          <Switch onChange={(val) => setState({ ...state, new_remind: val })} checked={state?.new_remind} />
        </div>
        <div className="border-solid border-color-[#eee] sm:(border-none) border-b-1px flex px-10 py-10 items-center justify-between active:bg-[#f9f9fa] cursor-pointer">
          <div className="flex flex-col">
            <p className="text-sm">电子邮件推送</p>
          </div>
          <Switch onChange={(val) => setState({ ...state, email_remind: val })} checked={state?.email_remind} />
        </div>
      </div>
      <div className="<sm:(fixed-b-btn) flex justify-around sm:pt-10">
        <Button onClick={resetState} className="w-[30%] border-0 bg-[#F3F3F3]" shape="rounded" block size="large">
          取消
        </Button>
        <Button
          className="w-[30%]"
          shape="rounded"
          block
          type="submit"
          size="large"
          color="primary"
          loadingIcon={<></>}
          onClick={onConfirm}
        >
          确认
        </Button>
      </div>
      <div onClick={() => navigate(-1)} className="fixed top-80px right-40px <sm:(hidden)">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default Notice
