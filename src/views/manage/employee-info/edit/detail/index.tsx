import React, { RefObject } from 'react'
import HeaderNav from '@/components/HeaderNav'
import styles from './index.module.scss'

import { Button, Swiper, SwiperRef } from 'antd-mobile'
import BaseForm from './Base'
import PriceForm from './Price'
import AddressForm from './Address'
import PersonalForm from './Personal'
import ServiceForm from './Service'
import { useMount, useRequest, useSize } from 'ahooks'
import ManageApi from '@/http/api/manage'
import InformationApi from '@/http/api/information'
import PersonalApi from '@/http/api/personal'
import { store } from '@/redux'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { Skeleton } from 'antd'
import Pcindex from './Pcindex'

function EditDetail() {
  const navigator = useNavigate()
  const location: any = useLocation()
  const ref = useRef<SwiperRef>(null)
  const size = useSize(document.querySelector('body'))

  const [swiperIndex, setSwiperIndex] = useState(0)
  const [value, setValue] = useState<(string | number)[]>([])
  const [timePicker, setTimePicker] = useState([])
  const [extendData, setExtendData] = useState<any>({})
  const [isUserOnline, setIsUserOnline] = useState(false)
  const [basisOptions, setBasisOptions] = useState<any>([])
  const [extraOptions, setExtraOptions] = useState<any>([])

  const {
    run: runlang,
    data: langList,
    loading: langListLoading,
  } = useRequest(() => InformationApi.getInformationList({ type: 2 }), {
    manual: true,
  })
  const { run: runinfor } = useRequest(() => InformationApi.getInformationList({ type: 9 }), {
    manual: true,
    onSuccess(res) {
      setTimePicker(res?.data)
    },
  })
  const {
    data: serviceList,
    loading,
    run: runserver,
  } = useRequest(ManageApi.getServerList, {
    manual: true,
    onSuccess(res) {
      setBasisOptions(res.data?.basis)
      setExtraOptions(res.data?.extra)
    },
  })
  // 详细资料详情
  const { run: extendStaffRun, loading: extendLoading } = useRequest(
    () => ManageApi.extendStaff({ id: location?.state?.id }),
    {
      manual: true,
      onSuccess(res) {
        setExtendData(res)
      },
    }
  )
  // 个人用户信息
  const { run: onlineUserRun } = useRequest(() => PersonalApi.onlineUserInfo({}), {
    manual: true,
    onSuccess(res) {
      const basisids: number[] = []
      const extraids: number[] = []
      res.data?.basis.map((item: any) => basisids.push(item.id))
      res.data?.extra.map((item: any) => extraids.push(item.id))
      setValue([...basisids, ...extraids])
      setExtendData(res)
      setIsUserOnline(true)
    },
  })

  useEffect(() => {
    if (size?.width && size?.width <= 640) {
      runlang()
      runinfor()
      runserver()
      if (location?.state?.id) {
        extendStaffRun()
      }
      if (location?.state?.onlineUser) {
        onlineUserRun()
      }
    }
  }, [size?.width])

  useEffect(() => {
    if (!loading && extendData && extendData?.data?.server_ids) {
      setValue(extendData?.data?.server_ids)
    }
    if (!loading && location?.state?.type) {
      ref.current?.swipeTo(2)
    }
  }, [extendData, loading])

  const next = () => {
    ref.current?.swipeNext()
  }

  if (loading || langListLoading || extendLoading) return <Skeleton />

  return (
    <>
      {size?.width && size?.width <= 640 && (
        <div className={`${styles.AddEmployeeForm} bg-[#fff] sm:(hidden)`}>
          <HeaderNav
            onBack={() => {
              if (swiperIndex === 0) {
                store.dispatch(updataEmployeeForm(''))
                navigator(-1)
              }
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
            style={{ '--height': `100vh` }}
            defaultIndex={swiperIndex}
            loop={false}
            allowTouchMove={false}
            indicator={() => null}
          >
            <Swiper.Item>
              <BaseForm
                langList={langList}
                swiperIndex={swiperIndex}
                extendData={extendData}
                next={next}
                nickname={extendData?.data?.nickname}
              />
            </Swiper.Item>
            <Swiper.Item style={{ overflowY: 'auto', paddingBottom: 120 }}>
              {swiperIndex === 1 && (
                <PriceForm
                  extendData={extendData}
                  swiperIndex={swiperIndex}
                  next={next}
                  value={value}
                  serviceList={serviceList}
                  swipeNext={() => ref.current?.swipeNext()}
                  timePicker={timePicker}
                  setTimePicker={setTimePicker}
                />
              )}
            </Swiper.Item>
            <Swiper.Item style={{ overflowY: 'auto', paddingBottom: 90 }}>
              <ServiceForm
                swiperIndex={swiperIndex}
                extendData={extendData}
                value={value}
                setValue={setValue}
                basisOptions={basisOptions}
                extraOptions={extraOptions}
                serviceList={serviceList}
                next={next}
                id={location?.state?.id}
              />
            </Swiper.Item>
            <Swiper.Item>
              <AddressForm swiperIndex={swiperIndex} extendData={extendData} next={next} />
            </Swiper.Item>
            <Swiper.Item style={{ overflowY: 'auto', paddingBottom: 90 }}>
              <PersonalForm isUserOnline={isUserOnline} extendData={extendData} />
            </Swiper.Item>
          </Swiper>
        </div>
      )}

      {size?.width && size?.width > 640 && <Pcindex />}
    </>
  )
}

export default EditDetail
