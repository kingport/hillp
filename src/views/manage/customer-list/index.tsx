import React from 'react'
import styles from './index.module.scss'
import HeaderNav from '@/components/HeaderNav'
import { Avatar, Button, InfiniteScroll, Input, SearchBar } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import PcCustomerList from './Pc'
import { useGetState } from 'ahooks'

function CustomerList() {
  const navigate = useNavigate()
  const location: any = useLocation()
  const from = location?.state?.from

  const [count, setCount, getCount] = useGetState<number>(1)
  const [keyword, setKeyword, getKeyword] = useGetState('')
  const [listData, setListData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)

  const requestLoadMore = async () => {
    const res = await ManageApi.getClientList({ page: count, keyword })
    setCount((count) => count + 1)
    setListData((val) => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }

  const renderItem = (item: any, index: any) => {
    return (
      <div
        onClick={() => {
          if (from && from === 'addOrder') {
            navigate('/calendar/add/order', { state: { customerId: item.id }, replace: true })
          } else {
            navigate('/manage/customer/info', { state: { id: item.id } })
          }
        }}
        key={index}
        className="flex py-4 items-center justify-between"
      >
        <div className="flex items-center">
          <Avatar src={item?.head} style={{ '--border-radius': '50%', '--size': '40px' }} />
          <div className="flex flex-col ml-5">
            <p className="text-sm font-500 text-color-[#000]">{item?.nickname}</p>
            <p className="text-xs text-color-[#999999]">{item?.email}</p>
          </div>
        </div>
        <SvgIcon className="w-[6px] h-[10px]" name="verify-right" />
      </div>
    )
  }

  useEffect(() => {
    setCount(1)
    setListData([])
    setHasMore(true)
  }, [keyword])

  return (
    <div
      className={`${styles.serviceList} pb-[90px] bg-[#fff] <sm:(min-h-[100vh] pt-[12rem]) sm:(justify-center flex items-center pb-0 !h-full)`}
    >
      <HeaderNav
        renderLeft={false}
        onBack={() => {
          if (from && from === 'addOrder') {
            navigate('/calendar/add/order', {
              state: {
                ...location?.state,
              },
            })
          } else {
            navigate('/manage')
          }
        }}
      />
      <div className="flex w-full bg-[#fff] fixed top-10 flex-col px-12 sm:(hidden)">
        <p className="font-600 text-2xl pb-4 pt-8">客户列表</p>
        <SearchBar
          placeholder="输入名称或手机号"
          onSearch={(val) => {
            setKeyword(val)
          }}
          onClear={() => {
            setKeyword('')
          }}
        />
      </div>
      <div className="flex bg-[#fff] flex-col pb-[90px] px-12 sm:(hidden)">
        <>{listData.map((item, index) => renderItem(item, index))}</>
        <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
      </div>
      <div
        onClick={() =>
          navigate('/manage/add/customer', {
            state: {
              from: 'addOrder',
              ...location?.state,
            },
          })
        }
        className="flex bg-[#fff] fixed z-10 left-8 bottom-30 flex-auto shadow-sm rounded-md items-center px-4 py-3 sm:(hidden)"
      >
        <SvgIcon name="add" className="w-[11px] h-[11px]" />
        <span className="text-xs pl-1">添加新客户</span>
      </div>
      <div className="fixed-b-btn sm:(hidden)">
        <Button
          onClick={() => {
            if (from && from === 'addOrder') {
              navigate('/calendar/add/order', {
                state: {
                  ...location?.state,
                },
              })
            } else {
              navigate('/manage')
            }
          }}
          className="w-[80%] bg-[#f3f3f3]"
          size="large"
          block
          shape="rounded"
        >
          返回
        </Button>
      </div>
      {/* pc */}
      <PcCustomerList />
    </div>
  )
}

export default CustomerList
