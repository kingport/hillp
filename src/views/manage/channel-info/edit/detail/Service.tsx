import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Button, Checkbox, Dialog, SearchBar, Space } from 'antd-mobile'
import { map } from 'lodash'
import React from 'react'

const Service = () => {
  const [value, setValue] = useState<(string | number)[]>([])
  const navigate = useNavigate()

  const baseService = [
    {
      id: 1,
      name: '精油开背',
    },
    {
      id: 2,
      name: '精油按摩',
    },
    {
      id: 3,
      name: '头部开背',
    },
  ]
  const extraService = [
    {
      id: 4,
      name: '面部清洁',
    },
    {
      id: 5,
      name: '小气泡',
    },
    {
      id: 6,
      name: '暖手套餐',
    },
  ]

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
      {/* <HeaderNav renderLeft={false} /> */}
      <div className="flex flex-col px-11 py-12">
        <p className="text-2xl font-600 pb-6">可提供服务</p>
        <SearchBar
          style={{ '--height': '2.375rem', '--border-radius': '0.625rem' }}
          placeholder="服务项目搜索"
          showCancelButton
        />
        <div className="pt-10">
          <Checkbox.Group
            value={value}
            onChange={(val) => {
              setValue(val)
            }}
          >
            <Checkbox
              onChange={(checked) => {
                if (checked) {
                  setValue([...baseval, ...extraval])
                } else {
                  setValue([])
                }
              }}
              checked={value.length === [...baseval, ...extraval].length}
              icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
            >
              <div className="text-base font-600 flex items-center">
                <span className="pr-2">全部项目</span>
                <span className="flex text-xs bg-[#f4f4f4] w-[16px] h-[16px] items-center justify-center rounded-full">
                  {baseService.length + extraService.length}
                </span>
              </div>
            </Checkbox>
            <Space direction="vertical" className="w-full">
              <div className="border-b w-full my-2"></div>
              <Checkbox
                // onChange={(checked) => {
                //   if (checked) {
                //     setValue([...baseval])
                //   } else {
                //     setValue([])
                //   }
                // }}
                // checked={baseval.length === [...baseval].length}
                icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
              >
                <div className="text-base font-600 flex items-center">
                  <span className="pr-2">基础项目</span>
                  <span className="flex text-xs bg-[#f4f4f4] w-[16px] h-[16px] items-center justify-center rounded-full">
                    {baseService.length}
                  </span>
                </div>
              </Checkbox>
              {baseService.map((item, index) => {
                return (
                  <Checkbox
                    key={index}
                    icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
                    value={item?.id}
                  >
                    <div className="text-xs flex items-center justify-between">
                      <span className="w-55">{item?.name}</span>
                      <span className="text-color-[#4F4F4F]">A$99.00</span>
                    </div>
                  </Checkbox>
                )
              })}
              <div className="border-b w-full my-2"></div>
              <Checkbox icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}>
                <div className="text-base font-600 flex items-center">
                  <span className="pr-2">额外项目</span>
                  <span className="flex text-xs bg-[#f4f4f4] w-[16px] h-[16px] items-center justify-center rounded-full">
                    {extraService.length}
                  </span>
                </div>
              </Checkbox>
              {extraService.map((item, index) => {
                return (
                  <Checkbox
                    key={index}
                    icon={(checked) => (checked ? <CheckedIcon /> : <CheckIcon />)}
                    value={item?.id}
                  >
                    <div className="text-xs flex items-center justify-between">
                      <span className="w-55">{item?.name}</span>
                      <span className="text-color-[#4F4F4F]">A$99.00</span>
                    </div>
                  </Checkbox>
                )
              })}
            </Space>
          </Checkbox.Group>
        </div>
      </div>
      {/* <div
        onClick={() => navigate('/manage/add/service')}
        className="flex fixed left-8 bottom-35 flex-auto shadow-sm bg-[#fff] rounded-md items-center px-4 py-3"
      >
        <SvgIcon name="add" className="w-[11px] h-[11px]" />
        <span className="text-xs pl-1">添加新服务</span>
      </div> */}
      {/* <div className="fixed-b-btn flex">
        <Button
          onClick={async () => {
            await sleep(1000)
            Dialog.show({
              content: <div className="font-600 text-center pb-2 text-xl">确定添加提供服务</div>,
              closeOnAction: true,
              actions: [
                [
                  {
                    key: 'cancel',
                    text: '取消',
                    className: 'dialog-cancel',
                  },
                  {
                    key: 'confirm',
                    text: '确认',
                    className: 'dialog-confirm',
                  },
                ],
              ],
            })
            return 22
          }}
          className="w-[70%] h-[2.75rem]"
          block
          type="submit"
          color="primary"
          shape="rounded"
          loading="auto"
          loadingIcon={<Ellipseing />}
        >
          保存
        </Button>
      </div> */}
    </div>
  )
}

export default Service
