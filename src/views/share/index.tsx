import SvgIcon from '@/components/SvgIcon'
import ShareApi from '@/http/api/share'
import { store } from '@/redux'
import { getUrlParam } from '@/utils/util'
import { useRequest } from 'ahooks'
import { Swiper, Image } from 'antd-mobile'
import React from 'react'

function Share() {
  const userInfo = store.getState().global.userInfo

  const id = getUrlParam('id')
  const type = getUrlParam('type')

  // type 1-员工；2-渠道；3-个人；4-商家
  const { data: shareInfo } = useRequest(() => ShareApi.getShareInfo({ id, type }))

  const items = shareInfo?.data?.picture?.map((item: any, index: string) => (
    <Swiper.Item key={index}>
      <Image className="rounded-lg" src={item} />
    </Swiper.Item>
  ))

  return (
    <div className="flex flex-col pt-[48px] items-center pb-[110px]">
      <div className="flex flex-col w-[80%] items-center">
        <div className="flex mt-7 flex-col text-color-[#000] rounded-lg shadow-sm w-full ">
          <Swiper>{items}</Swiper>
        </div>
        <div className="flex flex-col mt-4 text-color-[#000] px-8 py-8 shadow-sm bg-[#fff] w-full rounded-lg">
          <div className="flex flex-col items-center pb-5 pt-2">
            <p className="text-sm">{shareInfo?.data?.nickname}</p>
            {/* <p className="text-sm">{userInfo?.nickname}</p> */}
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">地址</p>
            <p className="text-sm">{shareInfo?.data?.address}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">评分</p>
            <div className="flex items-center">
              <SvgIcon name="star" className="w-[10px] h-[10px]" />
              <p className="text-sm pl-1">
                {shareInfo?.data?.synthesis_score}（{shareInfo?.data?.score_num}人评分）
              </p>
            </div>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">订单数</p>
            <p className="text-sm">已完成{shareInfo?.data?.order_num}单</p>
          </div>
          <div className="flex flex-col pt-8">
            <p className="text-xs">个人介绍</p>
            <p className="text-sm">{shareInfo?.data?.introduce}</p>
          </div>
          <div className="flex items-center pt-8">
            <div className="flex w-23 flex-col">
              <p className="text-xs">年龄</p>
              <p className="text-sm">{shareInfo?.data?.age || '--'}岁</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs">体重</p>
              <p className="text-sm">{shareInfo?.data?.weight || '--'}kg</p>
            </div>
          </div>
          <div className="flex items-center pt-8">
            <div className="flex w-23 flex-col">
              <p className="text-xs">身高</p>
              <p className="text-sm">{shareInfo?.data?.height || '--'}cm</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs">胸围</p>
              <p className="text-sm">{shareInfo?.data?.chest || '--'}</p>
            </div>
          </div>
          <div className="flex items-center pt-8">
            <div className="flex flex-col w-23">
              <p className="text-xs">人种</p>
              <p className="text-sm">{shareInfo?.data?.race || '--'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs">语言</p>
              <p className="text-sm">{shareInfo?.data?.lang || '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Share
