import HeaderNav from '@/components/HeaderNav'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import PersonalApi from '@/http/api/personal'
import { store } from '@/redux'
import { useRequest } from 'ahooks'
import { Button, NoticeBar } from 'antd-mobile'
import moment from 'moment'
import React from 'react'

const ParticipateIn = () => {
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const { data: onlineUserInfo } = useRequest(() => PersonalApi.onlineMerchant({}))

  return (
    <div className="flex flex-col pt-[48px] items-center pb-[110px]">
      <HeaderNav title="线上资料" renderRight={false} onBack={() => navigate('/personal/auth')} />
      {/* 是否修改资料 - 添加提示 */}
      {onlineUserInfo?.data?.is_update === 1 && (
        <div className="absolute top-[48px] w-[100%]">
          <NoticeBar
            content={'线上资料正在审核中，审核通过后才会更新资料数据'}
            color="info"
            style={{ fontSize: '12px' }}
          />
        </div>
      )}
      <div className="flex flex-col w-[80%] pt-10 items-center">
        {/*  */}
        <div className="flex flex-col text-color-[#000] px-8 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
          <div className="flex items-center justify-center -mt-18">
            <HiilpAvatar
              name={onlineUserInfo?.data?.online_name}
              headurl={onlineUserInfo?.data?.online_head}
              className="shadow-sm"
            />
          </div>
          <div className="flex flex-col items-center pb-5 pt-2">
            <p className="text-sm">{onlineUserInfo?.data?.online_name}</p>
            <p className="text-xs text-color-[#98a3a3]">商家</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">简介</p>
            <p className="text-sm">{onlineUserInfo?.data?.remark}</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">邮箱</p>
            <p className="text-sm">{onlineUserInfo?.data?.online_email}</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">手机号</p>
            <p className="text-sm">
              {onlineUserInfo?.data?.online_area}&nbsp;
              {onlineUserInfo?.data?.online_phone}
            </p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">地址</p>
            <p className="text-sm">{onlineUserInfo?.data?.online_address}</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">套餐</p>
            <p className="text-sm">
              {onlineUserInfo?.data?.setmeal || '--'}｜有效期至
              {moment(onlineUserInfo?.data?.promotion_endtime * 1000).format('YYYY-MM-DD')}
            </p>
          </div>
        </div>
        {/*  */}
        <div className="fixed-b-btn flex">
          <Button
            className="w-[12%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
            block
            onClick={() => setVisible(true)}
          >
            <SvgIcon name="point" className="w-[15px] h-[3px]" />
          </Button>
          <Button
            onClick={() => {
              navigate('/personal/auth/promote/online/edit')
            }}
            className=" bg-[#F3F3F3]  w-[56%] h-[2.75rem] rounded-xl"
            block
            type="submit"
            loadingIcon={<></>}
          >
            <div className="flex items-center justify-center">
              <SvgIcon name="edit" className="w-[18px] h-[18px]" />
              <p className="ml-2">编辑资料</p>
            </div>
          </Button>
        </div>
      </div>
      <HiilpActionSheet
        actions={[
          {
            text: '查看账户状态',
            key: 'status',
            onClick() {
              navigate('/personal/wallet')
            },
          },
        ]}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  )
}

export default ParticipateIn
