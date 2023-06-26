import { Col, Input, Row } from 'antd'
import React from 'react'
import { CloseOutline } from 'antd-mobile-icons'
import { useRequest } from 'ahooks'
import moment from 'moment'
import { getWeek } from '@/utils/util'
import { DotLoading } from 'antd-mobile'
import styles from './index.module.scss'
import { store } from '@/redux'
import HiilpAvatar from '@/components/HiilpAvatat'
import UserApi from '@/http/api/user'

const SearchComponent = () => {
  const navigate = useNavigate()
  const userInfo = store.getState().global.userInfo

  const {
    run: searchRun,
    loading,
    data: searchData,
  } = useRequest((params) => UserApi.search(params), {
    debounceWait: 500,
  })

  const renderOrderListItem = (item: any, key: any) => {
    return (
      <div key={key} className={`${styles.cardContentItem} flex items-center justify-between py-4`}>
        <div className="font-600 w-12">
          <p>{moment(item.start_time * 1000).format('MM月')}</p>
          <p>{moment(item.start_time * 1000).format('DD日')}</p>
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex flex-col mr-4">
            <div className="text-[12px] mb-1">
              <span className={`${styles.cardContentTags} text-color-[#848484]`}>
                {item.server_type === 1 ? '堂食' : '外卖'} ${item.amount}
              </span>
              {item.status === 0 && <span className="text-color-[#D2693F] ml-4">新预约</span>}
              {item.status === 2 && <span className="text-color-[#D2693F] ml-4">已取消</span>}
              {item.status === 7 && <span className="text-color-[#D2693F] ml-4">已取消</span>}
            </div>
            <span className="text-xs mb-1">
              {getWeek(item.start_time * 1000)}
              {moment(item.start_time * 1000).format('HH:mm')}
            </span>
            <span className="text-[12px] leading-16px text-color-[#848484]">
              {item.client_name} 与 {item.staff_name || item?.nickname}
              {item.duration}分钟的预约
            </span>
          </div>
        </div>
      </div>
    )
  }

  const toEmployeeDetail = (item: any) => {
    navigate('/manage/employee/info', { state: { id: item.id } })
  }

  const toChannelDetail = (item: any) => {
    navigate('/manage/channel/info', { state: { id: item.id } })
  }

  const toCustomerDetail = (item: any) => {
    navigate('/manage/customer/info', { state: { id: item.id } })
  }
 

  return (
    <div className="flex flex-col px-20 py-40 w-[calc(100vw-60px)] relative">
      <div className="flex flex-col w-full">
        <Input
          onChange={(e) => {
            searchRun({
              keyword: e.target.value,
            })
          }}
          placeholder="在此搜索"
          className="text-3xl"
          bordered={false}
        />
        <div className="border border-solid border-color-[#acaba6]"></div>
        <span className="text-color-[#acaba6] pt-6">
          通过输入即将到来的预约, {userInfo?.user_type === 2 ? '员工' : '渠道'}或者客户进行查询
        </span>
      </div>
      <div className="flex w-full pt-30">
        <Row className="w-full">
          <Col span={8}>
            <p className="text-2xl">即将到来的预约</p>
            <div className="flex flex-col h-400px overflow-auto">
              {searchData?.data?.subscribe?.map((item: any, index: number) => renderOrderListItem(item, index))}
            </div>
          </Col>
          <Col span={8}>
            <p className="text-2xl">{userInfo?.user_type === 2 ? '员工' : '渠道'}</p>
            {loading && (
              <>
                <span>Loading</span>
                <DotLoading />
              </>
            )}
            <div className="flex flex-col h-600px overflow-auto">
              {searchData?.data?.user?.map((item: any) => {
                return (
                  <div className="flex items-center py-4" key={item?.id} onClick={() =>{
                    userInfo?.user_type === 2 ? toEmployeeDetail(item) : toChannelDetail(item)
                  }}>
                    <div className="border mr-4 border-solid flex justify-center items-center border-color-[#cee2ee] border-width-1px w-55px h-55px rounded-full">
                      <HiilpAvatar name={item?.nickname} headurl={item?.head} sx={{ width: 50, height: 50 }} />
                    </div>
                    <div className="flex text-xl flex-col">
                      <p className="font-600 text-xl text-color-[#000]">{item?.nickname}</p>
                      <p className="py-1 text-xs text-color-[#797979]">
                        {item?.area || '--'} {item?.phone}
                      </p>
                      <p className="text-xs text-color-[#797979]">{item?.email || '--'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Col>
          <Col span={8}>
            <p className="text-2xl">客户</p>
            {loading && (
              <>
                <span>Loading</span>
                <DotLoading />
              </>
            )}
            <div className="flex flex-col h-600px overflow-auto">
              {searchData?.data?.client?.map((item: any) => {
                return (
                  <div className="flex items-center py-4" key={item?.id} onClick={() =>toCustomerDetail(item)}>
                    <div className="border mr-4 border-solid flex justify-center items-center border-color-[#D2693F] border-width-1px w-55px h-55px rounded-full">
                      <HiilpAvatar
                        name={item?.nickname}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        style={{ background: '#f2e2da' }}
                        headurl={item?.head}
                        sx={{ width: 50, height: 50 }}
                      />
                    </div>
                    <div className="flex text-xl flex-col">
                      <p className="font-600 text-xl text-color-[#000]">{item?.nickname}</p>
                      <p className="py-1 text-xs text-color-[#797979]">
                        {item?.area || '--'} {item?.phone}
                      </p>
                      <p className="text-xs text-color-[#797979]">{item?.email || '--'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Col>
        </Row>
      </div>
      <div onClick={() => navigate(-1)} className="fixed top-80px right-40px">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default SearchComponent
