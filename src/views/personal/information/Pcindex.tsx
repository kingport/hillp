import React from 'react'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import { Skeleton } from 'antd'
import type { MenuProps } from 'antd'
import { useRequest } from 'ahooks'
import { CloseOutline } from 'antd-mobile-icons'
import { store } from '@/redux'
import PersonalApi from '@/http/api/personal'
import moment from 'moment'

const PcEmployeeInfo = (props: any) => {
  const userInfo = store.getState().global.userInfo
  const navigate = useNavigate()

  const { data: res } = useRequest(() => PersonalApi.assetList({}))

  return (
    <div className="flex flex-col w-600px h-full justify-center <sm:(hidden)">
      <Skeleton loading={!userInfo} active>
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="border border-solid flex justify-center items-center border-color-[#cee2ee] border-width-1px w-120px h-120px rounded-full">
              <HiilpAvatar name={userInfo?.nickname} headurl={userInfo?.head} sx={{ width: 106, height: 106 }} />
            </div>
            <div className="flex flex-col pl-8">
              <p className="font-600 text-lg">{userInfo?.nickname}</p>
              <span className="text-color-[#ACACAC] pt-1 pb-1 text-xs">UID {userInfo?.user_id}</span>
            </div>
          </div>
          <div
            onClick={() => {
              // 商家
              if (userInfo?.user_type === 2) {
                // navigate('/personal/information/merchant/edit')
                navigate('/manage/base/info')
              }
              // 个人
              if (userInfo?.user_type === 1) {
                navigate('/manage/base/info')
                // navigate('/manage/employee/info/edit/detail', {
                //   state: {
                //     onlineUser: 'onlineUser',
                //     nickname: userInfo?.nickname,
                //   },
                // })
              }
            }}
            className="flex cursor-pointer text-sm"
          >
            <SvgIcon name="edit" className="w-[18px] mr-2 h-[20px] cursor-pointer" />
            <div className="h-20px">编辑资料</div>
          </div>
        </div>
        <div className="flex justify-between pt-12">
          <div className="flex flex-col w-[48%]">
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7">
              <div className="flex text-xs items-center">
                <span className="font-600 text-color-[#3F3F3F]">个人邮箱：</span>
                <span className="underline cursor-pointer text-color-[#3F3F3F]">{userInfo?.email}</span>
              </div>
              <div className="flex text-xs items-center pt-1">
                <span className="font-600 text-color-[#3F3F3F]">个人手机：</span>
                <span className="text-color-[#3F3F3F]">{userInfo?.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex w-[48%] relative flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7 text-color-[#3F3F3F] text-xs">
            <div className="leading-6">
              {res?.data?.status === 2 && (
                <span
                  className="underline-current underline cursor-pointer"
                  onClick={() => {
                    navigate('/personal/auth/online', {
                      state: {
                        type: 'wallet',
                      },
                    })
                  }}
                >
                  未开通升级账户，请升级
                </span>
              )}
              {res?.data?.status !== 2 && (
                <div className="flex items-center">
                  <div className="flex flex-col pr-4 text-xs text-color-[#000]">
                    <p>套餐</p>
                    <p className="text-color-[#666]">{res?.data?.setmeal || '无'}</p>
                  </div>
                  <div className="flex flex-col text-xs text-color-[#000]">
                    <p>有效期至</p>
                    <p className="text-color-[#666]">
                      {res?.data?.promotion_endtime
                        ? moment(res?.data?.promotion_endtime * 1000).format('YYYY-MM-DD')
                        : '无'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div onClick={() => navigate(-1)} className="fixed top-80px right-40px">
          <CloseOutline fontSize={24} className="cursor-pointer" />
        </div> */}
      </Skeleton>
    </div>
  )
}

export default PcEmployeeInfo
