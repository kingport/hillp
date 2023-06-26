import Ellipseing from '@/components/Ellipseing'
import ManageApi from '@/http/api/manage'
import PersonalApi from '@/http/api/personal'
import UploadApi from '@/http/api/upload'
import { store } from '@/redux'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { Button, Form, TextArea, Toast, DotLoading } from 'antd-mobile'
import { map, cloneDeep, pickBy, pullAllWith, isEqual, identity } from 'lodash'
import React from 'react'
import ImageList from './ImageList'
import Geocode from 'react-geocode'
import { GOOGLE_MAP_KEY } from '@/constant'
import { useRequest } from 'ahooks'

Geocode.setApiKey(GOOGLE_MAP_KEY)
Geocode.setLanguage('en')
Geocode.setRegion('es')
Geocode.setLocationType('ROOFTOP')

const PersonalForm = (props: any) => {
  const { extendData, images, setImages, coverImg, setCoverImg, isUserOnline } = props

  const [form] = Form.useForm()
  // const [images, setImages] = useState<any>([])
  // const [coverImg, setCoverImg] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadCoverLoading, setUploadCoverLoading] = useState(false)

  const employeeForm = store.getState().global.employeeForm
  const navigator = useNavigate()
  const fileInputEl = useRef<any>(null)
  const fileCoverInputEl = useRef<any>(null)

  const handlePhoto = async (event: any) => {
    const files = [...event.target.files]
    if (files.length) {
      setUploadLoading(true)
      const res = await UploadApi.uploadFile(files)
      if (res?.status === 200) {
        Toast.show(res.data.msg)
        setImages(() => [...images, res?.data?.data?.file_url])
      }
      setUploadLoading(false)
    }
  }

  const handleCoverPhoto = async (event: any) => {
    const files = [...event.target.files]
    if (files.length) {
      setUploadCoverLoading(true)
      const res = await UploadApi.uploadFile(files)
      if (res?.status === 200) {
        Toast.show(res.data.msg)
        setCoverImg(res?.data?.data?.file_url)
      }
      setUploadCoverLoading(false)
    }
  }

  useEffect(() => {
    if (extendData?.data) {
      if (!isUserOnline) {
        const arr: any = []
        extendData?.data?.picture.map((item: any, index: number) => {
          if (index > 0) {
            arr.push(item.url)
          } else {
            setCoverImg(item.url)
          }
        })
        setImages(arr)
      } else {
        const arr: any = []
        extendData?.data?.picture?.map((i: any, index: number) => {
          if (index > 0) {
            arr.push(i)
          } else {
            setCoverImg(i)
          }
        })
        setImages(arr)
      }
      form.setFieldsValue({
        introduce: extendData?.data?.introduce,
      })
    }
  }, [extendData])

  // const onFinish = async () => {
  //   form.validateFields().then(async (values) => {
  //     if (images.length && coverImg) {
  //       // 将封面图插入头部
  //       const images_concat = [coverImg, ...images]
  //       values.picture = JSON.stringify(images_concat)

  //       const cloneEmployeeForm = cloneDeep(employeeForm)

  //       cloneEmployeeForm.lang_ids = cloneEmployeeForm.lang_ids.join()
  //       cloneEmployeeForm.server_ids = cloneEmployeeForm.server_ids.join()

  //       if (cloneEmployeeForm.sales_cost.take_out.length === 0) {
  //         delete cloneEmployeeForm.sales_cost.take_out
  //       }
  //       if (cloneEmployeeForm.sales_cost.eat_in.length === 0) {
  //         delete cloneEmployeeForm.sales_cost.eat_in
  //       }

  //       cloneEmployeeForm.sales_cost = JSON.stringify(cloneEmployeeForm.sales_cost)

  //       if (!cloneEmployeeForm?.street) return Toast.show('请重新选择地址')

  //       Geocode.fromAddress(cloneEmployeeForm?.street).then(
  //         async (response: any) => {
  //           const { lat, lng } = response.results[0].geometry.location
  //           values.latitude = `${lat},${lng}`
  //           values = pickBy(values, identity)

  //           let res
  //           if (!isUserOnline) {
  //             res = await ManageApi.extendEdit({ ...values, ...cloneEmployeeForm })
  //           } else {
  //             // 个人信息里的个人资料更新
  //             res = await PersonalApi.updateOnline({ ...values, ...cloneEmployeeForm })
  //           }
  //           if (res.status === 200) {
  //             store.dispatch(updataEmployeeForm(''))
  //             if (!isUserOnline) {
  //               navigator('/calendar/plan')
  //             } else {
  //               navigator('/personal/auth/online')
  //             }
  //           }
  //         },
  //         (error: any) => {
  //           console.error(error)
  //         }
  //       )
  //     } else {
  //       Toast.show('请上传照片')
  //     }
  //   })
  // }

  const deleteImg = (index: string) => {
    const dImages = pullAllWith(images, [images[index]], isEqual)
    setImages([...dImages])
  }

  return (
    <div className="flex h-full flex-col px-8 py-12 overflow-auto">
      {/* <Form form={form} requiredMarkStyle="none"> */}
      <Form.Item name="introduce" layout="vertical" label="个人介绍">
        <TextArea placeholder="请输入" autoSize={{ minRows: 8, maxRows: 8 }} />
      </Form.Item>
      {/* </Form> */}
      <div className="flex justify-between items-center pt-8 pb-4">
        <p>封面图</p>
        <div
          onClick={() => {
            if (uploadCoverLoading) return false
            fileCoverInputEl.current.click()
          }}
          className="text-xs bg-[#F3F3F3] font-500 rounded-2xl px-4 py-1 cursor-pointer"
        >
          {uploadCoverLoading ? <DotLoading color="primary" /> : '上传'}
        </div>
        <input
          id="file"
          type="file"
          ref={fileCoverInputEl} //挂载ref
          accept=".jpg,.jpeg,.png" //限制文件类型
          hidden //隐藏input
          onChange={(event) => handleCoverPhoto(event)}
        />
      </div>
      {coverImg && <img src={coverImg} style={{ borderRadius: 10, width: 300 }} />}
      <div className="flex justify-between items-center pt-8 pb-4">
        <p>照片&视频</p>
        <div
          onClick={() => {
            if (uploadLoading) return false
            fileInputEl.current.click()
          }}
          className="text-xs bg-[#F3F3F3] font-500 cursor-pointer rounded-2xl px-4 py-1"
        >
          {uploadLoading ? <DotLoading color="primary" /> : '上传'}
        </div>
        <input
          id="file"
          type="file"
          ref={fileInputEl} //挂载ref
          accept=".jpg,.jpeg,.png,.mp4,.mkv,.avi,.mov,.wmv,.flv,.webm" //限制文件类型
          hidden //隐藏input
          onChange={(event) => handlePhoto(event)}
        />
      </div>
      <ImageList itemData={images} deleteImg={deleteImg} />
    </div>
  )
}

export default PersonalForm
