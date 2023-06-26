import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import PersonalApi from '@/http/api/personal'
import { store } from '@/redux'
import { useRequest } from 'ahooks'
import { Swiper, Image, Button, NoticeBar } from 'antd-mobile'
import moment from 'moment'
import { Skeleton } from 'antd'
import PcParticipateInPersonal from './PcParticipateInPersonal'

function ParticipateInPersonal() {
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const { data: onlineUserInfo, loading, refresh } = useRequest(() => PersonalApi.onlineUserInfo({}))
  const { run } = useRequest((params) => ManageApi.staffOnline(params), {
    manual: true,
    onSuccess() {
      refresh()
    },
  })

  const items = onlineUserInfo?.data?.picture?.map((item: any, index: any) => (
    <Swiper.Item key={index}>
      {/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(item) ? (
        <Image className="rounded-lg" src={item} height={144} />
      ) : (
        <video className="rounded-lg w-[100%] h-[144px]" src={item} controls preload="metadata"></video>
      )}
    </Swiper.Item>
  ))

  if (loading) return <Skeleton />

  return (
    <>
      <div className="flex flex-col pt-[88px] items-center pb-[110px] sm:(hidden)">
        <HeaderNav title="线上资料" renderRight={false} onBack={() => navigate('/personal/auth')} />
        {/* 是否修改资料 - 添加提示 */}
        {onlineUserInfo?.data?.is_update === 1 && (
          <div className='absolute top-[48px] w-[100%]'>
            <NoticeBar content={'线上资料正在审核中，审核通过后才会更新资料数据'} color="info" style={{fontSize:'12px'}} />
          </div>
        )}
        <div className="flex flex-col w-[80%] items-center">
          {/*  */}
          <div className="flex flex-col text-color-[#000] px-8 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
            <div className="flex items-center justify-center -mt-18">
              <HiilpAvatar name={userInfo?.nickname} headurl={userInfo?.head} className="shadow-sm" />
            </div>
            <div className="flex flex-col items-center pb-5 pt-2">
              <p className="text-sm">{userInfo?.nickname}</p>
              <p className="text-xs text-color-[#98a3a3]">个人</p>
            </div>
            <div className="flex flex-col pt-8">
              <p className="text-xs">地址</p>
              <p className="text-sm">{onlineUserInfo?.data?.address}</p>
            </div>
            <div className="flex flex-col pt-4">
              <p className="text-xs">评分</p>
              <div className="flex items-center">
                <SvgIcon name="star" className="w-[10px] h-[10px]" />
                <p className="text-sm pl-1">
                  {onlineUserInfo?.data?.synthesis_score}（{onlineUserInfo?.data?.score_num}人评分）
                </p>
              </div>
            </div>
            <div className="flex flex-col pt-8">
              <p className="text-xs">订单数</p>
              <p className="text-sm">已完成{onlineUserInfo?.data?.order_num}单</p>
            </div>
            <div className="flex flex-col pt-8">
              <p className="text-xs">个人介绍</p>
              <p className="text-sm">{onlineUserInfo?.data?.introduce}</p>
            </div>
            <div className="flex items-center pt-8">
              <div className="flex w-23 flex-col">
                <p className="text-xs">年龄</p>
                <p className="text-sm">{onlineUserInfo?.data?.age || '--'}岁</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs">体重</p>
                <p className="text-sm">{onlineUserInfo?.data?.weight || '--'}kg</p>
              </div>
            </div>
            <div className="flex items-center pt-8">
              <div className="flex w-23 flex-col">
                <p className="text-xs">身高</p>
                <p className="text-sm">{onlineUserInfo?.data?.height || '--'}cm</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs">胸围</p>
                <p className="text-sm">{onlineUserInfo?.data?.chest || '--'}</p>
              </div>
            </div>
            <div className="flex items-center pt-8">
              <div className="flex flex-col w-23">
                <p className="text-xs">人种</p>
                <p className="text-sm">{onlineUserInfo?.data?.race_text || '--'}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs">语言</p>
                <p className="text-sm">{onlineUserInfo?.data?.lang || '--'}</p>
              </div>
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
          <div className="flex mt-7 flex-col text-color-[#000] rounded-lg shadow-sm w-full ">
            <Swiper>{items}</Swiper>
          </div>
          {/*  */}
          <div className="flex mt-7 flex-col text-color-[#000] px-8 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
            <div className="flex flex-col">
              <p className="text-xs">收费标准</p>
            </div>
            <div className="flex flex-col pt-6">
              <p className="text-xs">堂食</p>
              {onlineUserInfo?.data?.cost?.eat_in?.map((item: any, index: string) => {
                return (
                  <div className="text-sm" key={index}>
                    <p>
                      {item?.time}min-${item?.price}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col pt-6">
              <p className="text-xs">外卖</p>
              {onlineUserInfo?.data?.cost?.take_out?.map((item: any, index: string) => {
                return (
                  <div className="text-sm" key={index}>
                    {item?.time}min-${item?.price}
                  </div>
                )
              })}
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
              onClick={() =>
                navigate('/manage/employee/info/edit/detail', {
                  state: {
                    onlineUser: 'onlineUser',
                    nickname: userInfo?.nickname,
                  },
                })
              }
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
              text: onlineUserInfo?.data?.online === 2 ? '上线' : '下线',
              key: 'online',
              onClick() {
                setVisible(false)
                run({
                  id: 0,
                })
              },
            },
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
      <div className="<sm:(hidden)">
        <PcParticipateInPersonal onlineUserInfo={onlineUserInfo} loading={loading} />
      </div>
    </>
  )
}

export default ParticipateInPersonal
