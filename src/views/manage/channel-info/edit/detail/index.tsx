import React, { RefObject } from 'react'
import HeaderNav from '@/components/HeaderNav'
import styles from './index.module.scss'

import { Button, Swiper, SwiperRef } from 'antd-mobile'
import BaseForm from './Base'
import PriceForm from './Price'
import AddressForm from './Address'
import PersonalForm from './Personal'
import ServiceForm from './Service'

function EditDetail() {
  const navigator = useNavigate()
  const ref = useRef<SwiperRef>(null)
  const [swiperIndex, setSwiperIndex] = useState(0)

  const onFinish = (values: any) => {
    if (swiperIndex === 1) return ref.current?.swipeTo(swiperIndex + 2)
    ref.current?.swipeNext()
  }
  return (
    <div className={`${styles.AddEmployeeForm}  pt-[48px] pb-[90px] bg-[#fff]`}>
      <HeaderNav
        onBack={() => {
          if (swiperIndex === 0) navigator(-1)
          ref.current?.swipeTo(swiperIndex - 1)
        }}
        renderRight={false}
        title={'编辑详细资料'}
        border
      />
      <Swiper
        ref={ref}
        onIndexChange={(val) => {
          setSwiperIndex(val)
        }}
        defaultIndex={swiperIndex}
        loop={false}
        allowTouchMove={false}
        indicator={() => null}
      >
        <Swiper.Item>
          <BaseForm />
        </Swiper.Item>
        <Swiper.Item>
          <PriceForm swipeNext={() => ref.current?.swipeNext()} />
        </Swiper.Item>
        <Swiper.Item>
          <ServiceForm />
        </Swiper.Item>
        <Swiper.Item>
          <AddressForm />
        </Swiper.Item>
        <Swiper.Item>
          <PersonalForm />
        </Swiper.Item>
      </Swiper>
      <div className="fixed-b-btn flex">
        <Button
          onClick={onFinish}
          className="w-[70%] h-[2.75rem]"
          block
          type="submit"
          color="primary"
          shape="rounded"
          loadingIcon={<></>}
        >
          {swiperIndex === 3 || swiperIndex === 2 ? '保存' : '下一步'}
        </Button>
      </div>
    </div>
  )
}

export default EditDetail
