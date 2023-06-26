import React from 'react'
import { Col, Row } from 'antd'
import Turnover from '../Turnover'
import Income from '../Income'
import Channel from '../Channel'
import SaleType from '../SaleType'
import Duration from '../Duration'
import { DatePicker, Divider, Tabs } from 'antd'
import styles from './index.module.scss'
import Order from './Order'
import Employee from './Employee'
import dayjs from 'dayjs'
import Finance from './Finance'

const { RangePicker } = DatePicker

const PcDataBase = (props: any) => {
  const {
    turnoverRes,
    loading,
    incomeLoading,
    incomeDetailRes,
    ProgressTextStyle,
    channelLoading,
    userInfo,
    channelOrStaffRes,
    saleTypeLoading,
    saleTypeRes,
    durationLoading,
    durationRes,
    time,
  } = props

  const [orderType, setOrderType] = useState('')

  const onChange = (val: string) => {
    setOrderType(val)
  }

  return (
    <div className={`${styles.pcdataBase} <sm:(hidden) w-full p-6 mb-10`}>
      <div className="bg-[#f4f6f6] rounded-md py-4 px-8">
        <RangePicker
          clearIcon={false}
          value={[dayjs(time[0]), dayjs(time[1])]}
          placeholder={['开始时间', '结束时间']}
          className="!bg-[#fff] rounded-3xl"
        />
      </div>
      <Row gutter={[16, 16]} className="mt-5">
        <Col span={8} className="cursor-pointer">
          <Turnover turnoverRes={turnoverRes} loading={loading} keyrender="pc" />
        </Col>
        <Col span={8} className="cursor-pointer">
          <Income
            incomeLoading={incomeLoading}
            incomeDetailRes={incomeDetailRes}
            ProgressTextStyle={ProgressTextStyle}
          />
        </Col>
        <Col span={8} className="cursor-pointer">
          <Channel
            channelLoading={channelLoading}
            userInfo={userInfo}
            channelOrStaffRes={channelOrStaffRes}
            ProgressTextStyle={ProgressTextStyle}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={8} className="cursor-pointer">
          <SaleType saleTypeLoading={saleTypeLoading} saleTypeRes={saleTypeRes} ProgressTextStyle={ProgressTextStyle} />
        </Col>
        <Col span={8} className="cursor-pointer">
          <Duration durationLoading={durationLoading} durationRes={durationRes} ProgressTextStyle={ProgressTextStyle} />
        </Col>
      </Row>
      <Divider />
      <div className="flex justify-center w-full">
        <Tabs
          defaultActiveKey="1"
          tabBarGutter={60}
          onChange={onChange}
          className="w-full flex justify-center"
          items={[
            {
              label: `订单`,
              key: '1',
              children: <Order orderType={orderType} setOrderType={setOrderType} />,
            },
            {
              label: `${userInfo?.user_type === 1 ? '渠道' : '员工'}`,
              key: '2',
              children: <Employee orderType={orderType} setOrderType={setOrderType} />,
            },
            {
              label: `财务`,
              key: '3',
              children: <Finance orderType={orderType} setOrderType={setOrderType} />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default PcDataBase
