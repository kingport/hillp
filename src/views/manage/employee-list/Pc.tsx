import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { Input, Select } from 'antd'
import { Ellipsis, InfiniteScroll } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

const { Search } = Input
const PcEmployeeList = () => {
  const navigate = useNavigate()
  const [count, setCount] = useState(1)
  const [listData, setListData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState('0')

  const renderItem = (item: any, index: number) => {
    const typeText = item?.type === 1 ? '独家' : item.type === 2 ? '关联' : item.type === 3 ? '签约' : ''
    return (
      <div
        key={index}
        onClick={() => {
          navigate('/manage/employee/info', { state: { id: item.id } })
        }}
        className="flex w-full justify-between py-4 px-5 border border-color-[#e9e9e9] border-solid rounded-md mt-4 cursor-pointer"
      >
        <div className="flex items-center" style={{ flexBasis: '250px' }}>
          <div className="flex justify-center items-center bg-[#fff] w-34px h-34px border border-solid border-color-[#2A4948] rounded-full">
            <HiilpAvatar name={item.nickname} headurl={item?.head} sx={{ width: 30, height: 30 }} />
          </div>
          <Ellipsis className="pl-3" direction="end" content={item?.nickname} />
          {item?.online === 1 && (
            <div className="flex px-3 py-1 ml-3 justify-center items-center bg-[#fff] rounded-xl border border-color-[#e9e9e9] border-solid">
              <p className="text-color-[#8c8c8c] text-xs pr-1">{item?.online === 1 ? '上线' : '下线'}</p>
              <span className={`${item?.online === 1 ? 'bg-[#2A4948]' : 'bg-[#970D0D]'} p-1 rounded-full`}></span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between flex-1">
          <div className="flex flex-col text-xs">
            <p>{item?.phone}</p>
            <p>{item?.email}</p>
          </div>
          <div className="flex items-center text-xs">
            <p>{typeText}</p>
          </div>
        </div>
      </div>
    )
  }

  const { runAsync } = useRequest((params) => ManageApi.getStaffList(params), {
    manual: true,
  })

  const requestLoadMore = async () => {
    const res = await runAsync({ page: count, keyword, type })
    setCount((count) => count + 1)
    setListData((val) => [...val, ...res?.data?.data])
    setHasMore(res?.data.data.length > 0)
  }

  return (
    <div className="flex flex-col w-556px <sm:(hidden)">
      <div className="flex justify-between">
        <p className="text-2xl font-600">管理员工</p>
        <div
          onClick={() => {
            navigate('/manage/add/employee')
          }}
          className="flex bg-[#fff] shadow-sm rounded-md items-center px-4 py-3 cursor-pointer hover:(opacity-90)"
        >
          <SvgIcon name="add" className="w-[11px] h-[11px]" />
          <span className="text-xs pl-1">添加新员工</span>
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

      <>
        <>{listData.map((item, index) => renderItem(item, index))}</>
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </>
    </div>
  )
}

export default PcEmployeeList
