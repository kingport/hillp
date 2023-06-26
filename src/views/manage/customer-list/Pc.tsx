import HiilpAvatar from '@/components/HiilpAvatat'
import InfiniteList from '@/components/InfiniteList'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { useGetState } from 'ahooks'
import { Skeleton, Input } from 'antd'
import { InfiniteScroll, SearchBar } from 'antd-mobile'
import React from 'react'
const { Search } = Input

const PcEmployeeList = () => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const from = location?.state?.from

  const [count, setCount, getCount] = useGetState<number>(1)
  const [keyword, setKeyword, getKeyword] = useGetState('')
  const [listData, setListData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)

  const renderItem = (item: any, index: number) => {
    return (
      <div
        key={index}
        onClick={() => {
          if (from && from === 'addOrder') {
            navigate('/calendar/add/order', { state: { customerId: item.id } })
          } else {
            navigate('/manage/customer/info', { state: { id: item.id } })
          }
        }}
        className="flex w-full justify-between items-center py-4 px-5 border border-color-[#e9e9e9] border-solid rounded-md mt-4 cursor-pointer"
      >
        <div className="flex items-center">
          <div className="flex justify-center items-center bg-[#fff] w-34px h-34px border border-solid border-color-[#2A4948] rounded-full">
            <HiilpAvatar name={item.nickname} headurl={item?.head} sx={{ width: 30, height: 30 }} />
          </div>
          <p className="pl-3">{item?.nickname}</p>
        </div>
        <div className="flex items-center text-xs">{item?.email}</div>
      </div>
    )
  }

  const requestLoadMore = async () => {
    const res = await ManageApi.getClientList({ page: count, keyword })
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
    <div className="flex flex-col w-556px h-[90%] overflow-auto <sm:(hidden)">
      <div className="flex justify-between">
        <p className="text-2xl font-600">管理客户</p>
        <div
          onClick={() => navigate('/manage/add/customer')}
          className="flex bg-[#fff] shadow-sm rounded-md items-center px-4 py-3 cursor-pointer hover:(opacity-90)"
        >
          <SvgIcon name="add" className="w-[11px] h-[11px]" />
          <span className="text-xs pl-1">添加新客户</span>
        </div>
      </div>

      <div className="flex items-center px-6 py-4 justify-between mt-5 bg-[#f4f6f6] rounded-md">
        <div>
          <Search
            placeholder="姓名或邮箱搜索"
            onSearch={(val) => {
              setKeyword(val)
            }}
          />
        </div>
      </div>

      <div className="h-[90vh] overflow-auto mt-1">
        <>{listData.map((item, index) => renderItem(item, index))}</>
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>
    </div>
  )
}

export default PcEmployeeList
