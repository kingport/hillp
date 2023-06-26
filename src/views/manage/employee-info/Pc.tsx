import React from 'react'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import { Skeleton, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Dialog } from 'antd-mobile'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { h5Copy } from '@/utils/util'
import { CloseOutline } from 'antd-mobile-icons'

const PcEmployeeInfo = (props: any) => {
  const { detail, isExclusive, refresh } = props
  const navigate = useNavigate()

  // 删除员工
  const { runAsync: deleteStaff } = useRequest(() => ManageApi.deleteStaff({ id: detail?.data?.id }), {
    manual: true,
    onSuccess() {
      navigate('/manage/employee/list')
    },
  })
  // 取消关联
  const { runAsync: cancelStaff } = useRequest(() => ManageApi.cancelStaff({ id: detail?.data?.id }), {
    manual: true,
    onSuccess() {
      navigate('/manage/employee/list')
    },
  })
  // 上下线
  const { runAsync: staffOnline } = useRequest(() => ManageApi.staffOnline({ id: detail?.data?.id }), {
    manual: true,
    onSuccess() {
      refresh()
    },
  })

  const baseItems = [
    {
      key: '1',
      label: (
        <span onClick={() => navigate('/manage/add/employee/information', { state: { id: detail?.data?.id } })}>
          编辑资料
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span onClick={() => h5Copy(`${window.location.origin}/share?type=${1}&id=${detail?.data?.id}`)}>分享链接</span>
      ),
    },
  ]

  const onlineItems =
    detail?.data?.type === 1
      ? [
          {
            key: '5',
            label:
              detail?.data?.online === 1 ? (
                <span onClick={staffOnline}>显示下线</span>
              ) : (
                <span onClick={staffOnline}>显示上线</span>
              ),
          },
          {
            key: '6',
            label: <span onClick={() => navigate('/calendar')}>查看预约日历</span>,
          },
        ]
      : [
          {
            key: '6',
            label: <span onClick={() => navigate('/calendar')}>查看预约日历</span>,
          },
        ]

  const items: MenuProps['items'] = [
    ...baseItems,
    {
      key: '3',
      label: isExclusive ? (
        <span
          onClick={() => {
            Dialog.show({
              content: <div className="font-600 text-center pb-2 text-xl">确定要删除员工</div>,
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
                      deleteStaff()
                    },
                  },
                ],
              ],
            })
          }}
        >
          删除员工
        </span>
      ) : (
        <span
          onClick={() => {
            Dialog.show({
              content: <div className="font-600 text-center pb-2 text-xl">确定取消关联</div>,
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
                      cancelStaff()
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
    ...onlineItems,
  ]

  return (
    <div className="flex flex-col w-500px h-full justify-center <sm:(hidden)">
      <Skeleton loading={!detail} active>
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="border border-solid flex justify-center items-center border-color-[#cee2ee] border-width-1px w-120px h-120px rounded-full">
              <HiilpAvatar
                name={detail?.data?.nickname}
                headurl={detail?.data?.head}
                sx={{ width: 106, height: 106 }}
              />
            </div>
            <div className="flex flex-col pl-8">
              <p className="font-600 text-lg">{detail?.data?.nickname}</p>
              <span className="text-color-[#ACACAC] pt-1 pb-1 text-xs">员工编号：{detail?.data?.id}</span>
              {detail?.data?.type === 1 && (
                <div className="w-60px flex py-0.5 justify-center items-center bg-[#fff] rounded-xl border border-color-[#e9e9e9] border-solid">
                  <p className="text-color-[#8c8c8c] text-xs pr-1">{detail?.data?.online === 1 ? '上线' : '下线'}</p>
                  <span
                    className={`${detail?.data?.online === 1 ? 'bg-[#2A4948]' : 'bg-[#970D0D]'} p-1 rounded-full`}
                  ></span>
                </div>
              )}
            </div>
          </div>
          <Dropdown menu={{ items }} placement="bottom">
            <SvgIcon name="point" className="w-[18px] h-[10px] cursor-pointer" />
          </Dropdown>
        </div>
        <div className="flex justify-between pt-12">
          <div className="flex flex-col w-[48%]">
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7">
              <div className="flex text-xs items-center">
                <span className="font-600 text-color-[#3F3F3F]">员工邮箱：</span>
                <span className="underline cursor-pointer text-color-[#3F3F3F]">{detail?.data?.email}</span>
              </div>
              <div className="flex text-xs items-center pt-1">
                <span className="font-600 text-color-[#3F3F3F]">员工手机：</span>
                <span className="text-color-[#3F3F3F]">{detail?.data?.phone}</span>
              </div>
            </div>
            <div className="flex flex-col rounded-2xl bg-[#f6f8f8] py-4 px-7 mt-4">
              <div className="flex text-xs text-color-[#3F3F3F]">
                <span className="font-600 min-w-15">员工成本：</span>
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
              <div className="flex text-xs items-center pt-1 text-color-[#3F3F3F]">
                <span className="font-600 min-w-15">介绍费：</span>
                {detail?.data?.introducer_type === 1 && <p>{detail?.data?.introducer_cost}%</p>}
                {detail?.data?.introducer_type === 2 && (
                  <div className="text-xs">
                    <p className="flex items-center">
                      {detail?.data?.introducer_cost?.map((item: any, index: string) => (
                        <span key={index}>
                          {item.time}min：${item?.price}、
                        </span>
                      ))}
                    </p>
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
                <a
                  onClick={() => navigate('/calendar')}
                  className="bg-[#e6f0ef] mt-3 bottom-4 absolute rounded-md text-xs p-1 text-color-[#2A4948]"
                >
                  查看预约日历
                </a>
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
