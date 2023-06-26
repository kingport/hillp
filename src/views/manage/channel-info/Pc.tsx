import React from 'react'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import { Skeleton, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Dialog, Toast } from 'antd-mobile'
import ManageApi from '@/http/api/manage'
import { h5Copy } from '@/utils/util'
import { CloseOutline } from 'antd-mobile-icons'

const PcEmployeeInfo = (props: any) => {
  const { detail } = props
  const navigate = useNavigate()

  const editItems = [
    {
      key: '1',
      label: (
        <span
          onClick={() =>
            navigate('/manage/add/channel/information', {
              state: {
                id: detail?.data?.id,
              },
            })
          }
        >
          编辑资料
        </span>
      ),
    },
  ]
  const baseItems = [
    {
      key: '2',
      label: (
        <span onClick={() => h5Copy(`${window.location.origin}/share?type=${1}&id=${detail?.data?.id}`)}>分享链接</span>
      ),
    },
  ]

  const itemsDel: MenuProps['items'] = [
    {
      key: '3',
      label: (
        <span
          onClick={() => {
            Dialog.show({
              content: <div className="font-600 text-center pb-2 text-xl">确定要删除渠道</div>,
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
                      const res = await ManageApi.deleteChannel({ id: detail?.data?.id })
                      if (res.status === 200) {
                        Toast.show(res.msg)
                        navigate('/manage/channel/list')
                      }
                    },
                  },
                ],
              ],
            })
          }}
        >
          删除渠道
        </span>
      ),
    },
  ]

  const itemsCancel: MenuProps['items'] = [
    {
      key: '3',
      label: (
        <span
          onClick={() => {
            Dialog.show({
              content: <div className="font-600 text-center pb-2 text-xl">确定要取消关联</div>,
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
                      const res = await ManageApi.cancelChannel({ id: detail?.data?.id })
                      if (res.status === 200) {
                        Toast.show(res.msg)
                        navigate('/manage/channel/list')
                      }
                    },
                  },
                ],
              ],
            })
          }}
        >
          取消关联
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col w-500px h-full justify-center <sm:(hidden)">
      <Skeleton loading={!detail} active>
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="border border-solid flex justify-center items-center border-color-[#cee2ee] border-width-1px w-120px h-120px rounded-full">
              <HiilpAvatar
                name={detail?.data?.channel_name}
                headurl={detail?.data?.channel_head}
                sx={{ width: 106, height: 106 }}
              />
            </div>
            <div className="flex flex-col pl-8">
              <p className="font-600 text-lg">{detail?.data?.channel_name}</p>
            </div>
          </div>
          <Dropdown
            menu={{
              items:
                detail?.data?.type === 1
                  ? [...editItems, ...baseItems, ...itemsDel]
                  : detail?.data?.type === 2
                  ? [...editItems, ...baseItems, ...itemsCancel]
                  : [...editItems, ...itemsCancel],
            }}
            placement="bottom"
          >
            <SvgIcon name="point" className="w-[18px] h-[10px] cursor-pointer" />
          </Dropdown>
        </div>
        <div className="flex justify-between pt-12">
          <div className="flex flex-col w-[48%]">
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7">
              <div className="flex text-xs items-center">
                <span className="font-600 text-color-[#3F3F3F]">渠道邮箱：</span>
                <span className="underline cursor-pointer text-color-[#3F3F3F]">{detail?.data?.channel_email}</span>
              </div>
              <div className="flex text-xs items-center pt-1">
                <span className="font-600 text-color-[#3F3F3F]">渠道手机：</span>
                <span className="text-color-[#3F3F3F]">{detail?.data?.channel_phone}</span>
              </div>
            </div>
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7 mt-4">
              <div className="flex text-xs text-color-[#3F3F3F]">
                <span className="font-600 min-w-40px">成本：</span>
                {detail?.data?.cost_type === 1 && <p>{detail?.data?.cost}%</p>}
                {detail?.data?.cost_type === 2 && (
                  <div className="text-xs">
                    <div className="flex">
                      <p>堂食：</p>
                      <div className="flex">
                        {detail?.data?.cost?.eat_in?.map((item: any, index: string) => (
                          <span key={index}>
                            {item.time}min：${item?.price}&nbsp;
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p>外卖：</p>
                      <div className="flex">
                        {detail?.data?.cost?.take_out?.map((item: any, index: string) => (
                          <span key={index}>
                            {item.time}min：${item?.price}&nbsp;
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-[48%] relative flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7 text-color-[#3F3F3F] text-xs">
            {detail?.data?.type === 1 && (
              <>
                <div className="leading-6 pt-3">
                  <p>完成预约数：{detail?.data?.order_num}</p>
                  <p>关注人数：{detail?.data?.fans_num}人</p>
                  <p>
                    综合评分 {detail?.data?.synthesis_score} {detail?.data?.score_num}人评分
                  </p>
                </div>
              </>
            )}
            {detail?.data?.type !== 1 && <div className="m-auto">没有相关数据</div>}
          </div>
        </div>
        <div onClick={() => navigate(-1)} className="fixed top-80px right-40px">
          <CloseOutline fontSize={24} className="cursor-pointer" />
        </div>
      </Skeleton>
    </div>
  )
}

export default PcEmployeeInfo
