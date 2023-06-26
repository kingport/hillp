import React, { RefObject } from 'react'
import { DatePickerRef, Form, Input, Picker } from 'antd-mobile'
import styles from '../add/employee/index.module.scss'
import SvgIcon from '@/components/SvgIcon'
import { omit, cloneDeep, mapKeys, map, keys } from 'lodash'

import { addRandomKey, getRandomString } from '@/utils/util'

interface Props {
  keyTitle: string
  setList: (val: any) => void
  list: any
  timePicker: any[]
  isEdit?: boolean
  form: any
  swiperIndex?: string
}

const TimePriceItem = (props: Props) => {
  const { keyTitle, list = [{}], form, setList, timePicker } = props

  // 删除
  const delectRow = async (key: string) => {
    const listLen = keys(list).length
    if (listLen === 1) {
      form.setFieldsValue({
        [keyTitle]: {
          [`time_${key}`]: [''],
          [`price_${key}`]: '',
        },
      })
    } else {
      const newList: any = omit(list, [key])
      setList(newList)
    }
  }

  // 添加
  const addRow = () => {
    const newList: any = cloneDeep(list)
    const key = getRandomString()
    newList[key] = {}
    setList(newList)
  }

  // 初始化
  const convertValueList = (value: any) => {
    setList(mapKeys(addRandomKey(value), (item) => item.key))
  }

  useEffect(() => {
    convertValueList(list)
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex w-[64%] items-center justify-around">
        <p className="text-xs font-500">时长</p>
        <p className="text-xs font-500">价格</p>
      </div>
      {map(list, (item, key) => {
        return (
          <div key={key} className="flex items-center">
            <Form.Item
              className="mx-2 min-w-15"
              onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                datePickerRef.current?.open() // ⬅️
              }}
              initialValue={item?.time ? [`${item?.time}`] : []}
              layout="vertical"
              name={[keyTitle, `time_${key}`]}
              trigger="onConfirm"
              arrow={false}
            >
              {timePicker && (
                <Picker columns={[timePicker]}>
                  {(value) =>
                    value[0] ? (
                      <span className="text-xs">{value[0].label}</span>
                    ) : (
                      <span className="text-xs text-color-[#ccc]">请选择</span>
                    )
                  }
                </Picker>
              )}
            </Form.Item>
            <Form.Item layout="vertical">
              <div className={`${styles.price} flex items-center`}>
                <span className="text-xs pl-3 pr-2">$</span>
                <Form.Item className="min-w-15" initialValue={item?.price} noStyle name={[keyTitle, `price_${key}`]}>
                  <Input placeholder="输入" />
                </Form.Item>
              </div>
            </Form.Item>
            <div
              onClick={() => delectRow(key)}
              className="flex shadow-sm min-w-[1.5rem] min-h-[1.5rem] cursor-pointer ml-4 mt-1 justify-center items-center bg-[#fff] rounded-full"
            >
              <SvgIcon name="delect" className="w-[10px] h-[1px]" />
            </div>
            <div
              onClick={() => addRow()}
              className="flex ml-4 mr-4 mt-1 justify-center items-center cursor-pointer min-w-[1.5rem] min-h-[1.5rem] rounded-full bg-[#2A4948]"
            >
              <SvgIcon name="add" style={{ color: '#fff' }} className="w-[10px] h-[10px]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default TimePriceItem
