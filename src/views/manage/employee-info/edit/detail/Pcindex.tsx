import React, { RefObject } from 'react'
import styles from './index.module.scss'

import { Button, Form, Swiper, SwiperRef, Toast } from 'antd-mobile'
import PcBaseForm from './PcBase'

import { useMount, useRequest, useSize } from 'ahooks'
import ManageApi from '@/http/api/manage'
import InformationApi from '@/http/api/information'
import PersonalApi from '@/http/api/personal'
import { store } from '@/redux'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { Skeleton } from 'antd'
import PcPrice from './PcPrice'
import PcAddress from './PcAddress'
import PcPersonal from './PcPersonal'
import { differenceWith, identity, isEqual, map, pickBy } from 'lodash'
import Geocode from 'react-geocode'
import { GOOGLE_MAP_KEY } from '@/constant'
import { CloseOutline } from 'antd-mobile-icons'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

function EditDetail() {
  const navigator = useNavigate()
  const location: any = useLocation()
  const ref = useRef<SwiperRef>(null)
  const [form] = Form.useForm()
  const size = useSize(document.querySelector('body'))

  const [value, setValue] = useState<(string | number)[]>([])
  const [timePicker, setTimePicker] = useState([])
  const [extendData, setExtendData] = useState<any>({})
  const [isUserOnline, setIsUserOnline] = useState(false)

  const [eatInlist, setEatInlist] = useState<any>()
  const [takeOutlist, setTakeOutlist] = useState<any>()
  const [costUnit, setCostUnit] = useState<string>('%')
  const [images, setImages] = useState<any>([])
  const [coverImg, setCoverImg] = useState('')

  const {
    run: runlang,
    data: langList,
    loading: langListLoading,
  } = useRequest(() => InformationApi.getInformationList({ type: 2 }), {
    manual: true,
  })
  const { run: runinfor } = useRequest(() => InformationApi.getInformationList({ type: 9 }), {
    onSuccess(res) {
      setTimePicker(res?.data)
    },
    manual: true,
  })
  const {
    run: runserver,
    data: serviceList,
    loading,
  } = useRequest(ManageApi.getServerList, {
    onSuccess(res) {
      const basisids: number[] = []
      const extraids: number[] = []
      res.data?.basis.map((item: any) => basisids.push(item.id))
      res.data?.extra.map((item: any) => extraids.push(item.id))
      setValue([...basisids, ...extraids])
    },
    manual: true,
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
      setExtendData(res)
      setIsUserOnline(true)
    },
  })

  useEffect(() => {
    // if (size?.width && size?.width > 640) {
    runlang()
    runinfor()
    runserver()
    if (location?.state?.id) {
      extendStaffRun()
    }
    if (location?.state?.onlineUser) {
      onlineUserRun()
    }
    // }
  }, [])

  useEffect(() => {
    if (extendData?.data) {
      const { data: formData } = extendData
      const lang_ids_num = formData.lang_ids.map((i: number) => Number(i))
      const baseIds = formData?.basis?.map((i: any) => i.id)
      const extraIds = formData?.extra?.map((i: any) => i.id)
      form.setFieldsValue({
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        chest: formData.chest,
        lang_ids: lang_ids_num,
        race: formData.race,
        base_ids: baseIds,
        extra_ids: extraIds,
        street: formData.street || formData.address || '',
        house_num: formData.house_num,
        bell: formData.bell,
        remark: formData.remark,
        introduce: formData.introduce,
      })
    }
  }, [extendData])

  const onFinish = (values: any) => {
    // 堂食
    const eatInArr: any = []
    if (eatInlist) {
      let eatInObj = {}
      Object.keys(eatInlist).map((key) => {
        eatInObj = {
          price: values.eat_in[`price_${key}`],
          time: values.eat_in[`time_${key}`][0],
        }
        eatInArr.push(eatInObj)
      })
    }
    // 外卖
    const takeOutArr: any = []
    if (takeOutlist) {
      let takeOutObj = {}
      Object.keys(takeOutlist).map((key) => {
        takeOutObj = {
          price: values.take_out[`price_${key}`],
          time: values.take_out[`time_${key}`][0],
        }
        takeOutArr.push(takeOutObj)
      })
    }

    values.sales_cost = {
      eat_in: differenceWith(
        eatInArr,
        [
          { time: undefined, price: undefined },
          { time: '', price: '' },
        ],
        isEqual
      ),
      take_out: differenceWith(
        takeOutArr,
        [
          { time: undefined, price: undefined },
          { time: '', price: '' },
        ],
        isEqual
      ),
    }

    if (!values.sales_cost.eat_in.length && !values.sales_cost.take_out.length) {
      return Toast.show('外卖/堂食请至少选择一个')
    }

    if (values.sales_cost.eat_in.length) {
      values.sales_cost.eat_in.map((item: any) => {
        if (!item.price || !item.time) {
          throw Toast.show('请完善或清空')
        }
      })
    }

    if (values.sales_cost.take_out.length) {
      values.sales_cost.take_out.map((item: any) => {
        if (!item.price || !item.time) {
          throw Toast.show('请完善或清空')
        }
      })
    }

    delete values.take_out
    delete values.eat_in

    if (images.length && coverImg) {
      // 将封面图插入头部
      const images_concat = [coverImg, ...images]
      values.picture = JSON.stringify(images_concat)

      values.lang_ids = values.lang_ids.join()
      // eslint-disable-next-line no-unsafe-optional-chaining
      values.server_ids = [...values.base_ids, ...values?.extra_ids].join()
      delete values.base_ids
      delete values.extra_ids

      if (values.sales_cost.take_out.length === 0) {
        delete values.sales_cost.take_out
      }
      if (values.sales_cost.eat_in.length === 0) {
        delete values.sales_cost.eat_in
      }

      values.sales_cost = JSON.stringify(values.sales_cost)
      values.nickname = extendData?.data?.nickname
      values.id = extendData?.data?.id
      if (!values?.street) return Toast.show('请重新选择地址')

      Geocode.fromAddress(values?.street).then(
        async (response: any) => {
          const { lat, lng } = response.results[0].geometry.location
          values.latitude = `${lat},${lng}`
          values = pickBy(values, identity)

          let res
          if (!location?.state?.onlineUser) {
            res = await ManageApi.extendEdit({ ...values })
          } else {
            // 个人信息里的个人资料更新
            res = await PersonalApi.updateOnline({ ...values })
          }
          if (res.status === 200) {
            store.dispatch(updataEmployeeForm(''))
            if (!location?.state?.onlineUser) {
              navigator('/calendar/plan')
            } else {
              navigator('/personal/auth/online')
            }
          } else {
            Toast.show(res.msg)
          }
        },
        (error: any) => {
          Toast.show('ZERO_RESULTS')
        }
      )
    } else {
      Toast.show('请上传照片')
    }
  }

  if (loading || langListLoading || extendLoading) return <Skeleton />

  return (
    <div className={`${styles.AddEmployeeForm} !min-h-auto bg-[#fff] !w-500px`}>
      <Form form={form} requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null}>
        <PcBaseForm langList={langList} extendData={extendData} />
        <PcPrice
          eatInlist={eatInlist}
          setEatInlist={setEatInlist}
          extendData={extendData}
          takeOutlist={takeOutlist}
          setTakeOutlist={setTakeOutlist}
          costUnit={costUnit}
          setCostUnit={setCostUnit}
          value={value}
          serviceList={serviceList}
          swipeNext={() => ref.current?.swipeNext()}
          timePicker={timePicker}
          setTimePicker={setTimePicker}
        />
        <PcAddress extendData={extendData} />
        <PcPersonal
          images={images}
          setImages={setImages}
          coverImg={coverImg}
          setCoverImg={setCoverImg}
          isUserOnline={isUserOnline}
          extendData={extendData}
        />
        <Button color="primary" shape="rounded" className="mb-10 w-100px" type="submit">
          确定
        </Button>
      </Form>
      <div onClick={() => navigator(-1)} className="fixed top-80px right-40px">
        <CloseOutline fontSize={24} className="cursor-pointer" />
      </div>
    </div>
  )
}

export default EditDetail
