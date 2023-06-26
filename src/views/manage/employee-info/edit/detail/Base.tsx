import SvgIcon from '@/components/SvgIcon'
import InformationApi from '@/http/api/information'
import { store } from '@/redux'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { useMount, useRequest } from 'ahooks'
import { Button, CheckList, DatePickerRef, Form, Input, Picker, Popup } from 'antd-mobile'
import _ from 'lodash'
import React, { RefObject } from 'react'
import styles from './index.module.scss'

function Base(props: any) {
  const { extendData, langList, next, nickname, swiperIndex } = props

  const employeeForm = store.getState().global.employeeForm

  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const { data: raceList, loading } = useRequest(() => InformationApi.getInformationList({ type: 1 }))

  useEffect(() => {
    if (extendData?.data) {
      let formData = extendData?.data

      // 用户编辑时的缓存数据
      if (employeeForm) {
        formData = employeeForm
      }

      form.setFieldsValue({
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        chest: formData.chest,
      })
      if (formData?.race) {
        form.setFieldsValue({
          race: [formData?.race],
        })
      }
      if (formData?.lang_ids) {
        form.setFieldsValue({
          lang: renderLang(formData?.lang_ids),
        })
        setSelected(formData?.lang_ids)
      }
    }
  }, [swiperIndex, extendData])

  const renderLang = (val: any) => {
    let langText = ''
    langList?.data?.map((l: any) => {
      val.map((s: any) => {
        if (`${l.value}` === `${s}`) {
          langText += l.label + ','
        }
      })
    })
    return langText
  }

  const onFinish = (values: any) => {
    // 人种
    values.race = values.race[0]
    // 语言
    if (!selected.length) return false
    values.lang_ids = selected
    if (extendData?.data?.id) {
      values.id = extendData.data.id
    }
    values.nickname = nickname
    store.dispatch(updataEmployeeForm(values))
    next()
  }

  if (loading) return <></>

  return (
    <div className="flex flex-col px-8 py-20">
      <Form form={form} requiredMarkStyle="none" layout="horizontal" onFinish={onFinish} footer={null}>
        <Form.Item label="年龄*">
          <div className={`${styles.input} flex items-center`}>
            <Form.Item
              noStyle
              name="age"
              rules={[
                {
                  required: true,
                  message: '请输入合法年龄',
                  validator: (_, value, callback) => {
                    if (value < 18) {
                      return Promise.reject('请输入合法年龄')
                    } else {
                      return Promise.resolve(true)
                    }
                  },
                },
              ]}
            >
              <Input placeholder="年龄" />
            </Form.Item>
            <p className="text-xs pr-4 min-w-34px">岁</p>
          </div>
        </Form.Item>
        <Form.Item label="体重*">
          <div className={`${styles.input} flex items-center`}>
            <Form.Item noStyle name="weight" rules={[{ required: true }]}>
              <Input placeholder="体重" />
            </Form.Item>
            <p className="text-xs pr-4 min-w-34px">kg</p>
          </div>
        </Form.Item>
        <Form.Item label="身高*">
          <div className={`${styles.input} flex items-center`}>
            <Form.Item noStyle name="height" rules={[{ required: true }]}>
              <Input placeholder="身高" />
            </Form.Item>
            <p className="text-xs pr-4 min-w-34px">cm</p>
          </div>
        </Form.Item>
        <Form.Item label="胸围*">
          <div className={`${styles.input} flex items-center`}>
            <Form.Item noStyle name="chest" rules={[{ required: true }]}>
              <Input placeholder="胸围" />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item
          name="race"
          trigger="onConfirm"
          label="人种*"
          onClick={(e, PickerRef: RefObject<DatePickerRef>) => {
            PickerRef.current?.open() // ⬅️
          }}
          rules={[{ required: true, message: '请选择人种' }]}
          className={styles.raceContainer}
        >
          <Picker columns={[raceList?.data]}>
            {(value: any) => <span className="text-xs pl-4 flex items-center h-38px">{value[0]?.label || ''}</span>}
          </Picker>
        </Form.Item>
        <Form.Item label="语言*">
          <div onClick={() => setVisible(true)} className={`${styles.input} flex items-center`}>
            <Form.Item noStyle name="lang">
              <Input placeholder="" readOnly />
            </Form.Item>
            <SvgIcon name="phone-bottom" className="w-[10px] h-[6px] mr-4" />
          </div>
        </Form.Item>
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false)
          }}
          destroyOnClose
        >
          <div className={styles.checkListContainer}>
            <CheckList
              multiple
              className={styles.myCheckList}
              value={selected}
              onChange={(val) => {
                form.setFieldsValue({
                  lang: renderLang(val),
                })
                setSelected(val)
              }}
            >
              {langList?.data?.map((item: any) => (
                <CheckList.Item key={item.id} value={`${item.value}`}>
                  {item?.label}
                </CheckList.Item>
              ))}
            </CheckList>
          </div>
        </Popup>
        <div className="flex justify-center mt-10">
          <Button className="w-[100%] h-[2.75rem]" block type="submit" color="primary" shape="rounded">
            下一步
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Base
