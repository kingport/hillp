import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'
import { updataEmployeeForm } from '@/redux/modules/global/action'
import { Button, Checkbox, SearchBar, Space } from 'antd-mobile'
import { map } from 'lodash'
import React from 'react'

const Service = (props: any) => {
  const { serviceList, value, next, setValue, id, onlineUser, extendData,basisOptions, extraOptions } = props
  const navigate = useNavigate()
  const employeeForm = store.getState().global.employeeForm
  
  const baseService = extendData?.data?.basis
  const extraService = extendData?.data?.extra
  const CheckedIcon = () => {
    return (
      <div className="flex w-[16px] h-[16px] justify-center items-center bg-[#ECECEC] rounded-sm">
        <div className="w-[8px] h-[8px] bg-[#2A4948] rounded-sm"></div>
      </div>
    )
  }

  const CheckIcon = () => {
    return <div className="flex w-[16px] h-[16px] justify-center items-center bg-[#ECECEC] rounded-sm"></div>
  }
  const baseval = map(baseService, 'id')
  const extraval = map(extraService, 'id')

  return (
    <div className="flex flex-col bg-[#fff]  pt-[48px] pb-[90px]">
      <div className="flex flex-col px-8 py-12">
        <p className="text-2xl font-600 pb-6">可提供服务</p>
        <SearchBar
          style={{ '--height': '2.375rem', '--border-radius': '0.625rem' }}
          placeholder="服务项目搜索"
          showCancelButton
        />
        <div className="pt-10">
          <Checkbox.Group
            onChange={(val) => {
              setValue(map(val, (o: any) => o * 1))
            }}
            value={map(value, (o) => o * 1)}
          >
            <Checkbox
              onChange={(checked) => {
                if (checked) {
                  setValue(map([...basisOptions.map(((i:any)=>i.id)),...extraOptions.map(((i:any)=>i.id))], (o) => o * 1))
                } else {
                  setValue([])
                }
              }}
              checked={value.length === [...basisOptions, ...extraOptions]?.length}
              icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
            >
              <div className="text-base font-600 flex items-center">
                <span className="pr-2">全部项目</span>
                <span className="flex text-xs bg-[#f4f4f4] w-[16px] h-[16px] items-center justify-center rounded-full">
                  {basisOptions?.filter((i:any)=>value.includes(i.id))?.length + extraOptions?.filter((i:any)=>value.includes(i.id))?.length}
                </span>
              </div>
            </Checkbox>
            <Space direction="vertical" className="w-full">
              <div className="border-b w-full my-2"></div>
              <div className="text-base font-600 flex items-center">
                <span className="pr-2">基础项目</span>
                <span className="flex text-xs bg-[#f4f4f4] w-[16px] h-[16px] items-center justify-center rounded-full">
                  {basisOptions?.filter((i:any)=>value.includes(i.id))?.length}
                </span>
              </div>
              {basisOptions?.map((item: any, index: any) => {
                return (
                  <Checkbox
                    key={index}
                    icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
                    value={item?.id}
                  >
                    <div className="text-xs flex items-center justify-between">
                      <span className="w-55">{item?.name}</span>
                      <span className="text-color-[#4F4F4F]">A${item?.price}</span>
                    </div>
                  </Checkbox>
                )
              })}
              <div className="border-b w-full my-2"></div>
              <div className="text-base font-600 flex items-center">
                <span className="pr-2">额外项目</span>
                <span className="flex text-xs bg-[#f4f4f4] w-[16px] h-[16px] items-center justify-center rounded-full">
                  {extraOptions?.filter((i:any)=>value.includes(i.id))?.length}
                </span>
              </div>
              {extraOptions?.map((item: any, index: any) => {
                return (
                  <Checkbox
                    key={index}
                    icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
                    value={item?.id}
                  >
                    <div className="text-xs flex items-center justify-between">
                      <span className="w-55">{item?.name}</span>
                      <span className="text-color-[#4F4F4F]">A${item.price}</span>
                    </div>
                  </Checkbox>
                )
              })}
            </Space>
          </Checkbox.Group>
        </div>
      </div>
      <div
        onClick={() =>
          navigate('/manage/add/service', {
            state: {
              type: id ? 'service' : 'onlineUser',
              id,
            },
          })
        }
        className="flex absolute left-8 bottom-25 flex-auto shadow-sm rounded-md bg-[#fff] items-center px-4 py-3"
      >
        <SvgIcon name="add" className="w-[11px] h-[11px]" />
        <span className="text-xs pl-1">添加新服务</span>
      </div>
      <div
        onClick={() => {
          store.dispatch(updataEmployeeForm({ ...employeeForm, server_ids: value }))
          next()
        }}
        className="flex justify-center mt-10"
      >
        <Button className="w-[90%] h-[2.75rem]" block type="submit" color="primary" shape="rounded">
          保存
        </Button>
      </div>
    </div>
  )
}

export default Service
