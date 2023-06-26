import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import SvgIcon from '@/components/SvgIcon'
import { Avatar, Toast, Button, Dialog } from 'antd-mobile'
import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import ManageApi from '@/http/api/manage'
import CopyUrl from './Copy'
import PcChannelInfo from './Pc'

const ChannelInfo = () => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const location: any = useLocation()
  const [visibleShare, setVisibleShare] = useState(false)

  const { data: detail } = useRequest(() => ManageApi.getChannelDetail({ id: location?.state?.id }))

  let actions: any
  if (detail?.data?.type !== 1) {
    actions = [
      {
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
        },
      },
    ]
  }

  if (detail?.data?.type === 1) {
    actions = [
      {
        text: '删除渠道',
        key: 'delete',
        danger: true,
        onClick: async () => {
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
        },
      },
    ]
  }

  return (
    <>
      <div className={`${styles.customerInfo} pb-[90px] flex flex-col items-center sm:(hidden)`}>
        <HeaderNav
          renderRight={
            <div onClick={() => setVisibleShare(true)} className="flex items-center">
              <SvgIcon name="share" style={{ color: '#fff' }} className="w-[18px] h-[18px]" />
            </div>
          }
          leftIconColor={'#fff'}
          bg={'transparent'}
        />
        <div className={`${styles.customerHeader} h-80 flex items-center flex-col`}>
          <Avatar
            className="z-10 mt-20"
            src={detail?.data?.channel_head}
            style={{ '--border-radius': '50%', '--size': '76px' }}
          />
          <p className="pt-4 z-10 font-600 text-color-[#fff]">{detail?.data?.channel_name}</p>
          <div className="flex z-10 items-center justify-center">
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
            <p className="text-xs font-600">{detail?.data?.channel_email || '--'}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">手机号码</p>
            <p className="text-xs font-600">{detail?.data?.channel_phone || '--'}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-8 mb-4 w-[70%] mt-2 bg-[#fff] rounded-lg">
          <div className="flex items-center">
            <p className="border-r text-xs pr-4">成本</p>
            {detail?.data?.cost_type === 1 && <p className="text-sm pl-4 font-600">{detail?.data?.cost}%</p>}
          </div>
          {detail?.data?.cost_type === 2 && detail?.data?.cost && (
            <div className="text-xs pt-2 font-600">
              <p
                className="
              flex items-center"
              >
                堂食：
                {detail?.data?.cost?.eat_in?.map((item: any, index: string) => (
                  <span key={index}>
                    {item.time}min：${item?.price} &nbsp;
                  </span>
                ))}
              </p>
              <p>
                外卖：
                {detail?.data?.cost?.take_out?.map((item: any, index: string) => (
                  <span key={index}>
                    {item.time}min：${item?.price} &nbsp;
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
            onClick={() =>
              navigate('/manage/add/channel/information', {
                state: {
                  id: detail?.data?.id,
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
        <CopyUrl visibleShare={visibleShare} setVisibleShare={setVisibleShare} id={detail?.data?.id} />

        <HiilpActionSheet actions={actions} visible={visible} setVisible={setVisible} />
      </div>
      <PcChannelInfo detail={detail} />
    </>
  )
}

export default ChannelInfo
