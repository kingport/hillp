import HeaderNav from '@/components/HeaderNav'
import HiilpActionSheet from '@/components/HiilpActionSheet'
import SvgIcon from '@/components/SvgIcon'
import CalendarApi from '@/http/api/calendar'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { Avatar, Button, Toast } from 'antd-mobile'
import { Skeleton } from 'antd'
import React from 'react'
import styles from './index.module.scss'
import PcCustomerInfo from './Pc'

const CustomerInfo = () => {
  const [visible, setVisible] = useState(false)
  const location: any = useLocation()
  const navigator = useNavigate()

  const from = location?.state?.from

  const getClientDetail = async () => {
    return !location?.state?.source
      ? await ManageApi.getClientDetail({ id: location?.state?.id })
      : await CalendarApi.getClientInfo({ client_id: location?.state?.id, source: location?.state?.source })
  }

  const { data: clienInfo, loading } = useRequest(getClientDetail)

  return (
    <div className={`${styles.customerInfo} pb-[90px] flex flex-col items-center`}>
      <Skeleton loading={loading}>
        <HeaderNav leftIconColor={'#fff'} renderRight={false} bg={'transparent'} />
        <div className={`${styles.customerHeader} h-70 flex items-center flex-col sm:(hidden)`}>
          <Avatar
            className="z-10 mt-20"
            src={clienInfo?.data?.head}
            style={{ '--border-radius': '50%', '--size': '76px' }}
          />
          <p className="pt-4 z-10 font-600 text-color-[#fff]">{clienInfo?.data?.nickname}</p>
        </div>
        <div className="shadow-sm flex justify-center py-4 w-[70%] -m-14 bg-[#fff] rounded-lg z-20 sm:(hidden)">
          <div className="flex flex-col items-center w-[50%] border-r">
            <p className="text-xs">评分</p>
            <p className="text-2xl font-600">{clienInfo?.data?.synthesis_score || clienInfo?.data?.score}</p>
          </div>
          <div className="flex flex-col items-center w-[50%]">
            <p className="text-xs">线上预约数</p>
            <p className="text-2xl font-600">{clienInfo?.data?.order_num || clienInfo?.data?.subscribe_num}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-8 mb-4 w-[70%] mt-20 bg-[#fff] rounded-lg sm:(hidden)">
          <div className="flex flex-col">
            <p className="text-xs">邮箱</p>
            <p className="text-xs font-600">{clienInfo?.data?.email || '--'}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">手机号码</p>
            <p className="text-xs font-600">{clienInfo?.data?.phone || '--'}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">地址</p>
            <p className="text-xs font-600">{clienInfo?.data?.address || '--'}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">备注</p>
            <p className="text-xs font-600">{clienInfo?.data?.remark || '--'}</p>
          </div>
        </div>
        {from === 'calendarView' ? (
          <div className="fixed-b-btn flex sm:(hidden)">
            <Button
              className="w-[56%] h-[2.75rem] rounded-xl bg-[#F3F3F3]"
              block
              onClick={() => {
                navigator(-1)
              }}
            >
              返回
            </Button>
          </div>
        ) : location?.state?.type === 'onlineCustomer' ? (
          <> </>
        ) : (
          <div className="fixed-b-btn flex sm:(hidden)">
            <Button
              className="w-[12%] flex items-center justify-center mr-4 h-[2.75rem] rounded-xl border-0 bg-[#F3F3F3]"
              block
              onClick={() => setVisible(true)}
            >
              <SvgIcon name="point" className="w-[15px] h-[3px]" />
            </Button>
            <Button
              onClick={() => {
                navigator('/calendar/add/order', {
                  state: {
                    customerId: clienInfo?.data?.id,
                  },
                })
              }}
              className="w-[56%] h-[2.75rem] rounded-xl"
              block
              type="submit"
              color="primary"
              loadingIcon={<></>}
            >
              添加预约
            </Button>
          </div>
        )}
      </Skeleton>
      <HiilpActionSheet
        actions={[
          {
            text: '编辑资料',
            key: 'edit',
            onClick: () => {
              navigator('/manage/add/customer', { state: { type: 'edit', formData: clienInfo?.data } })
            },
          },
          {
            text: '删除客户',
            key: 'delete',
            danger: true,
            onClick: async () => {
              setVisible(false)
              const res = await ManageApi.deleteClient({
                id: clienInfo?.data?.id,
              })
              if (res.status === 200) {
                Toast.show({
                  content: res?.msg,
                  afterClose() {
                    navigator('/manage/customer/list')
                  },
                })
              }
            },
          },
        ]}
        visible={visible}
        setVisible={setVisible}
      />
      {/* pc */}
      <PcCustomerInfo clienInfo={clienInfo} />
    </div>
  )
}

export default CustomerInfo
