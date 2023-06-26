import React from 'react'
import styles from './index.module.scss'
import HeaderNav from '@/components/HeaderNav'
import { Avatar, InfiniteScroll } from 'antd-mobile'
import Select from '@/components/Select'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { useRequest, useUpdateEffect } from 'ahooks'
import PcChannel from './Pc'

function ChannelList() {
  const navigate = useNavigate()
  const accountName = '渠道'

  useRequest(() => ManageApi.getChannelSelect({}), {
    onSuccess(res) {
      res.data.map((x: any) => {
        x.label = x.channel_name
        x.value = x.id
      })
      setEmployeeList(res.data)
    },
  })

  const getChannelList = async (page = 1) => {
    return await ManageApi.getChannelList({ page, id: employeeId })
  }

  const [count, setCount] = useState(1)
  const [listData, setListData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [employeeList, setEmployeeList] = useState([])
  const [employeeId, setEmployeeId] = useState<any>(0)

  const requestLoadMore = async () => {
    const res = await getChannelList(count)
    setCount((count) => count + 1)
    setListData((val) => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }

  useUpdateEffect(() => {
    requestLoadMore()
  }, [employeeId])

  const renderItem = (item: any) => {
    const typeText = item?.type === 1 ? '独家' : item.type === 2 ? '关联' : item.type === 3 ? '签约' : ''
    return (
      <div
        key={item.id}
        className="flex items-center justify-between border-color-[#e9e9e9] border-solid border-b-[0.5px]"
      >
        <div
          onClick={() => {
            navigate('/manage/channel/info', { state: { id: item.id } })
          }}
          className="flex w-[33%] h-12 items-center border-color-[#e9e9e9] border-solid border-r-[0.5px]"
        >
          <Avatar
            src={item?.channel_head}
            className="mr-2 ml-4"
            style={{ '--border-radius': '50%', '--size': '20px' }}
          />
          <p className="text-xs text-color-[#2A4948] opacity-80">{item.channel_name}</p>
        </div>
        <div className="flex justify-center pl-4 w-[33%] h-12 flex-col text-xs border-color-[#e9e9e9] border-solid border-r-[0.5px]">
          <p>{item?.channel_phone}</p>
          <p>{item?.channel_email}</p>
        </div>
        <div className="flex w-[33%] h-12 items-center flex-grow justify-center text-xs">
          <p>{typeText}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`${styles.employeeList} pt-[48px] min-h-[100vh] bg-[#fff] sm:(hidden)`}>
        <HeaderNav title={`${accountName}列表`} onBack={() => navigate('/manage')} renderLeft={false} />
        <div className="shadow-sm py-8 sm:(hidden)">
          <Select
            onChange={(val) => {
              setCount(1)
              setListData([])
              setEmployeeId(val[0])
            }}
            initValue={['0']}
            options={[[{ label: '全部渠道', value: '0' }, ...employeeList]]}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-sm">
            <p className="w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-r-[0.5px] border-b-[0.5px]">
              渠道
            </p>
            <p className="w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-r-[0.5px] border-b-[0.5px]">
              联系方式
            </p>
            <p className="w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-b-[0.5px]">状态</p>
          </div>
          <>
            <>{listData.map((item, index) => renderItem(item))}</>
            <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
          </>
        </div>
        <div
          onClick={() => {
            navigate('/manage/add/channel')
          }}
          className="flex bg-[#fff] fixed z-10 left-8 bottom-30 flex-auto shadow-sm rounded-md items-center px-4 py-3"
        >
          <SvgIcon name="add" className="w-[11px] h-[11px]" />
          <span className="text-xs pl-1">添加新{accountName}</span>
        </div>
      </div>
      <div className="<sm(hidden)">
        <PcChannel />
      </div>
    </>
  )
}

export default ChannelList
