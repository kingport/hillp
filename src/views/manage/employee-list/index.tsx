import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import Select from '@/components/Select'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import HiilpAvatar from '@/components/HiilpAvatat'
import PcEmployeeList from './Pc'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Ellipsis, InfiniteScroll } from 'antd-mobile'

function EmployeeList() {
  const navigate = useNavigate()
  const [employeeList, setEmployeeList] = useState([])
  const [employeeId, setEmployeeId] = useState<any>(0)
  const [count, setCount] = useState(1)

  const getStaffList = async (page = 1) => {
    return await ManageApi.getStaffList({ page, id: employeeId })
  }

  const [listData, setListData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)

  const requestLoadMore = async () => {
    const res = await getStaffList(count)
    setCount((count) => count + 1)
    setListData((val) => [...val, ...res.data.data])
    setHasMore(res.data.data.length > 0)
  }

  useRequest(() => ManageApi.getStaffSelect({}), {
    onSuccess(res) {
      res.data.map((x: any) => {
        x.label = x.nickname
        x.value = x.id
      })
      setEmployeeList(res.data)
    },
  })

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
        <div className="flex w-[43%] py-2 items-center justify-between pr-2 border-color-[#e9e9e9] border-solid border-r-[0.5px]">
          <div
            onClick={() => {
              navigate('/manage/employee/info', { state: { id: item.id } })
            }}
            className="flex items-center"
          >
            <HiilpAvatar
              name={item.nickname}
              headurl={item?.head}
              sx={{ width: 20, height: 20 }}
              className="mr-2 ml-4 !text-xs"
            />
            <Ellipsis className="text-xs" rows={2} direction="end" content={item.nickname} style={{ width: 60 }} />
          </div>
          {item?.online === 1 && (
            <div className="flex flex-shrink transform scale-70 border border-solid border-color-[#C9C9C9] px-1 justify-center items-center bg-[#fff] rounded-xl">
              <p className="text-color-[#8c8c8c] text-xs pr-1">{'上线'}</p>
              <span className={`${'bg-[#2A4948]'} p-1 rounded-full`}></span>
            </div>
          )}
        </div>
        <div className="flex justify-center pl-4 w-[33%] h-12 flex-col text-xs border-color-[#e9e9e9] border-solid border-r-[0.5px]">
          <p>{item?.phone}</p>
          <Ellipsis direction="end" content={item?.email} />
        </div>
        <div className="flex w-[23%] h-12 items-center flex-grow justify-center text-xs">
          <p>{typeText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`pt-[48px] <sm:(min-h-[100vh]) bg-[#fff]`}>
      <HeaderNav title={`员工列表`} renderLeft={false} onBack={() => navigate('/manage')} />
      <div className="shadow-sm py-8 sm:(hidden)">
        <Select
          onChange={(val) => {
            setCount(1)
            setListData([])
            setEmployeeId(val[0])
          }}
          initValue={['0']}
          options={[[{ label: '全部员工', value: '0' }, ...employeeList]]}
        />
      </div>
      <div className="flex flex-col sm:(hidden)">
        <div className="flex items-center text-sm">
          <p className="w-[43%] text-center py-2 border-color-[#e9e9e9] border-solid border-r-[0.5px] border-b-[0.5px]">
            员工
          </p>
          <p className="w-[33%] text-center py-2 border-color-[#e9e9e9] border-solid border-r-[0.5px] border-b-[0.5px]">
            联系方式
          </p>
          <p className="w-[23%] text-center py-2 border-color-[#e9e9e9] border-solid border-b-[0.5px]">状态</p>
        </div>
        <>
          <>{listData.map((item, index) => renderItem(item))}</>
          <InfiniteScroll loadMore={requestLoadMore} hasMore={hasMore} />
        </>
      </div>
      <div
        onClick={() => {
          navigate('/manage/add/employee')
        }}
        className="flex bg-[#fff] fixed z-10 left-8 bottom-30 flex-auto shadow-sm rounded-md items-center px-4 py-3 sm:(hidden)"
      >
        <SvgIcon name="add" className="w-[11px] h-[11px]" />
        <span className="text-xs pl-1">添加新员工</span>
      </div>
      {/* pc */}
      <PcEmployeeList />
    </div>
  )
}

export default EmployeeList
