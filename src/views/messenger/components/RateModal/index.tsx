import React, { useState } from 'react'
import { Button, Modal, Rate, Toast } from 'antd-mobile'
import { useRequest, useSize } from 'ahooks'
import CalendarApi from '@/http/api/calendar'
import Ellipseing from '@/components/Ellipseing'

export default function RateModal(props: any) {
  const { id, name, width = '35%', callback } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [source, setSource] = useState(5)
  const size = useSize(document.querySelector('body'))

  // 订单评分
  const { runAsync: evaluateRunAsync } = useRequest(() => CalendarApi.evaluateOrder({ id, score: source }), {
    manual: true,
    onSuccess() {
      setVisible(false)
      if (callback) {
        callback()
      }
    },
  })

  const Content = () => {
    return (
      <>
        <div className="bg-opacity-100 bg-[#fff] py-10 rounded-xl flex flex-col items-center mb-1.5rem">
          <p className="text-[#1F1F1F] font-600 mb-2">请对{name}评分</p>
          <Rate defaultValue={source} onChange={(val) => setSource(val)} />
        </div>
        <div className="flex justify-around">
          <Button
            className="w-[35%] border-0 text-[#2A4948] bg-[#F3F3F3]"
            shape="rounded"
            block
            size="middle"
            onClick={() => setVisible(false)}
          >
            取消
          </Button>
          <Button
            className="w-[35%]"
            shape="rounded"
            block
            type="submit"
            size="middle"
            color="primary"
            onClick={async () => {
              await evaluateRunAsync()
            }}
            loadingIcon={<Ellipseing />}
            loading="auto"
          >
            确认
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Button
        className={`w-[${width}] border-0 text-[red] bg-[#F3F3F3]`}
        shape="rounded"
        block
        size="large"
        onClick={() => {
          setVisible(true)
        }}
      >
        评分
      </Button>
      <Modal
        visible={visible}
        content={<Content />}
        bodyStyle={{ backgroundColor: `rgba(255,255,255,0)`, width: size?.width && size?.width > 640 ? 500 : 'auto' }}
      />
    </>
  )
}
