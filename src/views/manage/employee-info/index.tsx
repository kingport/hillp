import React from 'react'
import { Button, Dialog, Toast } from 'antd-mobile'
import { useRequest } from 'ahooks'
import HeaderNav from '@/components/HeaderNav'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import HiilpAvatar from '@/components/HiilpAvatat'
import styles from './index.module.scss'
import CopyUrl from './Copy'
import PcEmployeeInfo from './Pc'
import { Skeleton } from 'antd'

const EmployeeInfo = () => {
  const [visible, setVisible] = useState(false)
  const [visibleShare, setVisibleShare] = useState(false)
  const navigate = useNavigate()
  const location: any = useLocation()

  const { data: detail, refresh, loading } = useRequest(() => ManageApi.getStaffDetail({ id: location?.state?.id }))

  const isExclusive = detail?.data?.type === 1

  // 独家删除员工 非独家取消关联
  const actionSheet = isExclusive
    ? {
        text: '删除员工',
        key: 'delete',
        danger: true,
        onClick: async () => {
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
                    const res = await ManageApi.deleteStaff({ id: detail?.data?.id })
                    if (res.status === 200) {
                      setVisible(false)
                      navigate('/manage/employee/list')
                    }
                  },
                },
              ],
            ],
          })
        },
      }
    : {
        text: '取消关联',
        key: 'cancel',
        onClick: async () => {
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
                    const res = await ManageApi.cancelStaff({ id: detail?.data?.id })
                    if (res.status === 200) {
                      navigate('/manage/employee/list')
                    }
                  },
                },
              ],
            ],
          })
        },
      }

  return (
    <Skeleton loading={loading}>
      <div className={`sm:(hidden) ${styles.customerInfo} pb-[90px] flex flex-col items-center`}>
        <HeaderNav
          renderRight={
            <div className="flex items-center">
              <SvgIcon
                onClick={() => setVisibleShare(true)}
                name="share"
                style={{ color: '#fff' }}
                className="w-[18px] h-[18px]"
              />
              {detail?.data?.type === 1 && (
                <div className="flex px-3 py-1 ml-4 justify-center items-center bg-[#fff] rounded-xl">
                  <p className="text-color-[#8c8c8c] text-xs pr-1">{detail?.data?.online === 1 ? '上线' : '下线'}</p>
                  <span
                    className={`${detail?.data?.online === 1 ? 'bg-[#2A4948]' : 'bg-[#970D0D]'} p-1 rounded-full`}
                  ></span>
                </div>
              )}
            </div>
          }
          leftIconColor={'#fff'}
          bg={'transparent'}
        />
        <div className={`${styles.customerHeader} h-80 flex items-center flex-col`}>
          <HiilpAvatar className="z-10 mt-20" name={detail?.data?.nickname} headurl={detail?.data?.head} />
          <p className="pt-4 z-10 font-600 text-color-[#fff]">{detail?.data?.nickname}</p>
          <div className="flex z-10 items-center justify-center text-color-[#fff]">
            <p className="text-xs">综合评分：{detail?.data?.synthesis_score}</p>
            <p className="text-xs ml-2">{detail?.data?.score_num}人评分</p>
          </div>
        </div>
        <div className="shadow-sm flex justify-center py-4 w-[70%] -m-14 bg-[#fff] rounded-lg z-20">
          <div className="flex flex-col items-center w-[50%] border-r">
            <p className="text-xs">完成预约数</p>
            <p className="text-2xl font-600">{detail?.data?.order_num}</p>
          </div>
          <div className="flex flex-col items-center w-[50%]">
            <p className="text-xs">关注人数</p>
            <p className="text-2xl font-600">{detail?.data?.fans_num}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-8 mb-4 w-[70%] mt-20 bg-[#fff] rounded-lg">
          <div className="flex flex-col">
            <p className="text-xs">邮箱</p>
            <p className="text-xs font-600">{detail?.data?.email}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">手机号码</p>
            <p className="text-xs font-600">{detail?.data?.phone}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-8 mb-4 w-[70%] mt-2 bg-[#fff] rounded-lg">
          <div className="flex items-center">
            <p className="border-r text-xs pr-4">员工成本</p>
            {detail?.data?.cost_type === 1 && <p className="text-sm pl-4 font-600">{detail?.data?.cost}%</p>}
          </div>
          {detail?.data?.cost_type === 2 && (
            <div className="text-xs pt-2 font-600">
              <div className="flex items-center">
                {detail?.data?.cost?.eat_in && (
                  <>
                    <p>堂食：</p>
                    <div className="flex">
                      {detail?.data?.cost?.eat_in?.map((item: any, index: string) => (
                        <span key={index}>
                          {item.time}min：${item?.price}&nbsp;
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {detail?.data?.cost?.take_out && (
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
              )}
            </div>
          )}
          {detail?.data?.introducer_cost && (
            <div className="flex items-center pt-2">
              <p className="border-r text-xs pr-4">介绍费用</p>
              {detail?.data?.introducer_type === 1 && (
                <p className="text-sm pl-4 font-600">{detail?.data?.introducer_cost}%</p>
              )}
            </div>
          )}
          {detail?.data?.introducer_type === 2 && (
            <div className="text-xs pt-2 font-600">
              <p
                className="
              flex items-center"
              >
                {detail?.data?.introducer_cost?.map((item: any, index: string) => (
                  <span key={index}>
                    {item.time}min：${item?.price}、
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
        <div className="fixed-b-btn flex">
          <Button
            className="w-[12%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
            block
            onClick={() => setVisible(true)}
          >
            <SvgIcon name="point" className="w-[15px] h-[3px]" />
          </Button>
          <Button
            onClick={() => navigate('/manage/add/employee/information', { state: { id: detail?.data?.id } })}
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
        <HiilpActionSheet
          actions={
            detail?.data?.type === 1
              ? [
                  {
                    text: detail?.data?.online === 1 ? '下线' : '上线',
                    key: 'offline',
                    async onClick() {
                      setVisible(false)
                      const res = await ManageApi.staffOnline({
                        id: detail?.data?.id,
                      })
                      if (res.status === 200) {
                        Toast.show(res.msg)
                        refresh()
                      }
                    },
                  },
                  actionSheet,
                  {
                    text: '查看预约日历',
                    key: 'copy',
                    onClick() {
                      navigate('/calendar')
                    },
                  },
                ]
              : [
                  actionSheet,
                  {
                    text: '查看预约日历',
                    key: 'copy',
                    onClick() {
                      navigate('/calendar')
                    },
                  },
                ]
          }
          visible={visible}
          setVisible={setVisible}
        />
        <CopyUrl visibleShare={visibleShare} setVisibleShare={setVisibleShare} id={detail?.data?.id} />
      </div>
      {/* pc */}
      <PcEmployeeInfo detail={detail} isExclusive={isExclusive} refresh={refresh} />
    </Skeleton>
  )
}

export default EmployeeInfo
