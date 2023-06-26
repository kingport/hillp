import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'
import { Swiper, Image, NoticeBar } from 'antd-mobile'
import moment from 'moment'
import { Skeleton } from 'antd'
import { CloseOutline } from 'antd-mobile-icons'

function ParticipateInPersonal(props: any) {
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()

  const { onlineUserInfo, loading } = props

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
    <div className="flex flex-col items-center">
      {/* 是否修改资料 - 添加提示 */}
      {onlineUserInfo?.data?.is_update === 1 && (
        <div className="w-600px">
          <NoticeBar
            content={'线上资料正在审核中，审核通过后才会更新资料数据'}
            color="info"
            style={{ fontSize: '12px' }}
          />
        </div>
      )}
      <div className="flex w-600px">
        <div className="flex w-300px flex-col text-color-[#000] px-6 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
          <div className="flex flex-col items-center pb-5">
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
          <div
            onClick={() =>
              navigate('/manage/employee/info/edit/detail', {
                state: {
                  onlineUser: 'onlineUser',
                },
              })
            }
            className="flex cursor-pointer pt-8 text-sm"
          >
            <SvgIcon name="edit" className="w-[18px] mr-2 h-[20px] cursor-pointer" />
            <div className="h-20px text-color-[#324848]">编辑资料</div>
          </div>
        </div>
        <div className="w-286px ml-4">
          <div className="flex flex-col text-color-[#000] rounded-lg shadow-sm w-full h-144px mb-7">
            <Swiper>{items}</Swiper>
          </div>
          <div className="flex flex-col text-color-[#000] px-8 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
            <div className="flex flex-col pb-5">
              <p className="text-xs">个人资料</p>
            </div>
            <div className="flex py-2 items-start flex-col">
              <p className="text-xs pr-2">邮箱</p>
              <div>{userInfo?.email || '--'}</div>
            </div>
            <div className="flex pr-2 items-start flex-col">
              <p className="text-xs">手机</p>
              <div>{userInfo?.phone || '--'}</div>
            </div>
          </div>
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
        </div>
      </div>
      <div onClick={() => navigate(-1)} className="fixed top-80px right-40px">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default ParticipateInPersonal
