import React from 'react'
import { Button, Dialog, Toast } from 'antd-mobile'
import { useRequest } from 'ahooks'
import HeaderNav from '@/components/HeaderNav'
import ManageApi from '@/http/api/manage'
import HiilpAvatar from '@/components/HiilpAvatat'
import styles from './index.module.scss'
import { Skeleton } from 'antd'
import PcCostChange from './PcCostChange'

const CostChange = () => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const type = location?.state?.data?.type
  const id = location?.state?.data?.id

  const { data: detail, loading } = useRequest(() => ManageApi.getCost({ id: id, type: type }))
  const { run } = useRequest((params) => ManageApi.updateCost(params), {
    manual: true,
    onSuccess() {
      Toast.show({
        content: '操作成功',
        afterClose() {
          navigate('/messenger')
        },
      })
    },
  })

  // 拒绝
  const turnDown = () => {
    Dialog.show({
      content: `如拒绝则保持原成本`,
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
            className: 'dialog-cancel',
            onClick() {
              //
            },
          },
          {
            key: 'confirm',
            text: `确认`,
            className: 'dialog-confirm',
            async onClick() {
              run({
                id,
                type,
                status: 2,
              })
            },
          },
        ],
      ],
    })
  }

  // 同意
  const agreement = () => {
    //
    Dialog.show({
      content: `如同意则更改为新成本`,
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
            className: 'dialog-cancel',
            onClick() {
              //
            },
          },
          {
            key: 'confirm',
            text: `确认`,
            className: 'dialog-confirm',
            async onClick() {
              run({
                id,
                type,
                status: 1,
              })
            },
          },
        ],
      ],
    })
  }

  return (
    <Skeleton loading={loading}>
      <div className={`${styles.customerInfo} pb-[90px] flex flex-col items-center sm:(hidden)`}>
        <HeaderNav renderRight={false} leftIconColor={'#fff'} bg={'transparent'} />
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
            <p className="text-2xl font-600">{detail?.data?.order_num || 0}</p>
          </div>
          <div className="flex flex-col items-center w-[50%]">
            <p className="text-xs">关注人数</p>
            <p className="text-2xl font-600">{detail?.data?.fans_num || 0}</p>
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

        <div className="shadow-sm flex flex-col px-8 py-8 mb-4 w-[70%] mt-4 bg-[#fff] rounded-lg">
          {/* 原成本 type==1 */}
          {detail?.data?.jiu_cost_type === 1 && (
            <div className="flex items-center text-xs text-color-[#aaa]">
              <p>
                {type === 1 ? '原成本：' : '原员工成本'}
                {detail?.data?.jiu_cost}%
              </p>
            </div>
          )}
          {/* 原成本 type==2 */}
          {detail?.data?.jiu_cost_type === 2 && (
            <div className="flex flex-col text-xs text-color-[#aaa]">
              <p>{type === 1 ? '原成本：' : '原员工成本'}</p>
              <div className="flex items-center">
                {detail?.data?.jiu_cost?.eat_in?.length && (
                  <div>
                    堂食：
                    {detail?.data?.jiu_cost?.eat_in?.map((e: any, index: string) => (
                      <p key={index}>
                        {e?.time}min/${e.price}&nbsp;
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {detail?.data?.jiu_cost?.take_out?.length && (
                  <div>
                    外卖：
                    {detail?.data?.jiu_cost?.take_out?.map((e: any, index: string) => (
                      <p key={index}>
                        {e?.time}min/${e.price}&nbsp;
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 新成本 type==1 */}
          {detail?.data?.cost_type === 1 && (
            <div className="flex items-center text-xs pt-2">
              <p>
                {type === 1 ? '新成本：' : '新员工成本'}
                {detail?.data?.cost}%
              </p>
            </div>
          )}
          {/* 新成本 type==2 */}
          {detail?.data?.cost_type === 2 && (
            <div className="flex flex-col text-xs pt-2">
              <p>{type === 1 ? '新成本：' : '新员工成本'}</p>
              <div className="flex items-center">
                {detail?.data?.cost?.eat_in?.length && (
                  <div>
                    堂食：
                    {detail?.data?.cost?.eat_in?.map((e: any, index: string) => (
                      <p key={index}>
                        {e?.time}min/${e.price}&nbsp;
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {detail?.data?.cost?.take_out?.length && (
                  <div>
                    外卖：
                    {detail?.data?.cost?.take_out?.map((e: any, index: string) => (
                      <p key={index}>
                        {e?.time}min/${e.price}&nbsp;
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="fixed-b-btn flex justify-around">
          <Button
            onClick={turnDown}
            className=" bg-[#F3F3F3]  w-[40%] h-[2.75rem]"
            type="submit"
            shape="rounded"
            loadingIcon={<></>}
          >
            拒绝
          </Button>
          <Button
            onClick={agreement}
            className=" bg-[#F3F3F3]  w-[40%] h-[2.75rem]"
            shape="rounded"
            color="primary"
            loadingIcon={<></>}
          >
            同意
          </Button>
        </div>
      </div>
      <div className="<sm:(hidden)">
        <PcCostChange />
      </div>
    </Skeleton>
  )
}

export default CostChange
