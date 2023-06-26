import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { useGetState, useRequest } from 'ahooks'
import { Input, Select } from 'antd'
import { Avatar, InfiniteScroll } from 'antd-mobile'
import React from 'react'
const { Search } = Input

const PcEmployeeList = () => {
  const navigate = useNavigate()

  const [count, setCount, getCount] = useGetState<number>(1)
  const [keyword, setKeyword, getKeyword] = useGetState('')
  const [listData, setListData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [type, setType] = useState('0')

  const renderItem = (item: any) => {
    const typeText = item?.type === 1 ? '独家' : item.type === 2 ? '关联' : item.type === 3 ? '签约' : ''
    return (
      <div
        key={item.id}
        className="flex items-center justify-between border rounded-md border-color-[#e9e9e9] py-2 border-solid"
      >
        <div
          onClick={() => {
            navigate('/manage/channel/info', { state: { id: item.id } })
          }}
          className="flex w-[33%] h-12 items-center"
        >
          <Avatar
            src={item?.channel_head}
            className="mr-2 ml-4"
            style={{ '--border-radius': '50%', '--size': '20px' }}
          />
          <p className="text-xs text-color-[#2A4948] opacity-80">{item.channel_name}</p>
        </div>
        <div className="flex justify-center pl-4 w-[33%] h-12 flex-col text-xs">
          <p>{item?.channel_phone}</p>
          <p>{item?.channel_email}</p>
        </div>
        <div className="flex w-[33%] h-12 items-center flex-grow justify-center text-xs">
          <p>{typeText}</p>
        </div>
      </div>
    )
  }
  const { runAsync } = useRequest((params) => ManageApi.getChannelList(params), {
    manual: true,
  })
  const requestLoadMore = async () => {
    const res = await runAsync({ page: count, keyword, type })
    setCount((count) => count + 1)
    setListData((val) => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }

  useEffect(() => {
    setCount(1)
    setListData([])
    setHasMore(true)
  }, [keyword])

  return (
    <div className="flex flex-col w-556px min-h-[calc(100vh-60px)] mt-20 overflow-auto <sm:(hidden)">
      <div className="flex justify-between">
        <p className="text-2xl font-600">管理渠道</p>
        <div
          onClick={() => navigate('/manage/add/channel')}
          className="flex bg-[#fff] shadow-sm rounded-md items-center px-4 py-3 cursor-pointer hover:(opacity-90)"
        >
          <SvgIcon name="add" className="w-[11px] h-[11px]" />
          <span className="text-xs pl-1">添加新渠道</span>
        </div>
      </div>

      <div className="flex items-center px-6 py-4 justify-between mt-5 bg-[#f4f6f6] rounded-md">
        <div>
          <Search
            placeholder="姓名或邮箱搜索"
            onSearch={(e) => {
              setKeyword(e)
              setCount(1)
              setListData([])
              setHasMore(true)
            }}
          />
        </div>
        <Select
          style={{ width: 'auto' }}
          onChange={(val) => {
            setCount(1)
            setListData([])
            setHasMore(true)
            setType(val)
          }}
          defaultValue={'0'}
          options={[
            { value: '0', label: '全部' },
            { value: '1', label: '独家' },
            { value: '2', label: '关联' },
            { value: '3', label: '签约' },
          ]}
        />
      </div>

      <div className="h-[90vh] overflow-auto mt-1">
        <>{listData.map((item) => renderItem(item))}</>
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>
    </div>
  )
}

export default PcEmployeeList
