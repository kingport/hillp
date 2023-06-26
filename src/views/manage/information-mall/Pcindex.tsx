import HeaderNav from '@/components/HeaderNav'
import HiilpAvatar from '@/components/HiilpAvatat'
import SvgIcon from '@/components/SvgIcon'
import ManageApi from '@/http/api/manage'
import { store } from '@/redux'
import { maxWidth } from '@mui/system'
import { useMount, useUpdateEffect } from 'ahooks'
import { Divider, Skeleton } from 'antd'
import { Button, CenterPopup, NavBar } from 'antd-mobile'
import moment from 'moment'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.module.scss'

const InformationMall = () => {
  const navigate = useNavigate()
  const userInfo = store.getState().global.userInfo

  const { region } = store.getState().global.areaRegion

  const [selectNation, setSelectNation] = useState(0)
  const [count, setCount] = useState(1)
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const squareList = async () => {
    return await ManageApi.squareList({ page: count, region: selectNation })
  }

  const requestLoadMore = async () => {
    if (loading) {
      return
    }
    const res = await squareList()
    setCount((count) => count + 1)
    // eslint-disable-next-line no-unsafe-optional-chaining
    setData((val: any) => [...val, ...res?.data?.data])
    setLoading(false)
    setHasMore(res.data.data.length > 0)
  }

  useMount(() => {
    setSelectNation(region?.find((r: any) => r.value === userInfo?.region_id * 1)?.value)
  })

  const renderNationText = () => {
    if (selectNation === 0) return '全部'
    return region?.find((r: any) => r.value === selectNation * 1)?.label
  }

  const dateText = (time: any) => {
    const d = moment(moment().format('YYYY-MM-DD')).diff(moment(moment(time * 1000).format('YYYY-MM-DD')))
    const dur = moment.duration(d).asDays()
    return dur === 0 ? '今天' : `${dur}天前`
  }

  const renderItem = (item: any, index: string) => {
    return (
      <div key={index} className={`inline-flex w-400px flex-col p-6 rounded-lg bg-[#fff] ml-[8px] mr-[8px] mt-[16px] ${styles.informationCard}`}>
        <div className="flex justify-between">
          <div className="flex items-center">
            <HiilpAvatar name={item?.nickname} sx={{ width: 34, height: 34 }} headurl={item?.head} />
            <div className="ml-2">
              <p className="text-xs text-color-[#000] font-600">{item?.nickname}</p>
              <p className="text-xs text-color-[#999]">{item?.address}</p>
            </div>
          </div>
          <div className="text-xs w-15 text-color-[#ABABAB]">{dateText(item.time)}</div>
        </div>
        <div className="flex items-center pt-6 pl-10">
          <div className="flex flex-col pr-4">
            <p className="text-xs text-color-[#292929]">年龄</p>
            <p className="text-sm text-color-[#292929] font-600">{`${item?.age || '-'}岁`}</p>
          </div>
          <div className="flex flex-col pr-4 ">
            <p className="text-xs text-color-[#292929]">体重</p>
            <p className="text-sm text-color-[#292929] font-600">{`${item?.weight || '-'}kg`}</p>
          </div>
          <div className="flex flex-col pr-4">
            <p className="text-xs text-color-[#292929]">身高</p>
            <p className="text-sm text-color-[#292929] font-600">{item?.height || '--'}</p>
          </div>
          <div className="flex flex-col pr-4">
            <p className="text-xs text-color-[#292929]">胸围</p>
            <p className="text-sm text-color-[#292929] font-600">{item?.chest || '--'}</p>
          </div>
        </div>
        <Button
          onClick={() =>
            navigate('/manage/employee/information/mall/detail', {
              state: {
                id: item?.id,
              },
            })
          }
          className="w-[40%] mt-6 ml-10"
          size="mini"
          color="primary"
          shape="rounded"
        >
          <span className="text-xs">查看详情</span>
        </Button>
      </div>
    )
  }

  const selectArce = (item: any) => {
    setSelectNation(item.value)
  }

  useUpdateEffect(() => {
    requestLoadMore()
  }, [selectNation])

  const renderLeft = <SvgIcon style={{ color: '', width: '20px', height: '48px' }} name="nav-left" />

  return (
    <div className="flex w-100vw flex-col justify-center items-center min-h-[calc(100vh-60px)] bg-[#f9f9fa]">
      <NavBar
        style={{
          '--height': '48px',
          fontSize: '12px',
          width: 832,
        }}
        left={
          <div
            onClick={() => navigate(-1)}
            className={`${styles.pcLeft} cursor-pointer flex items-center justify-start text-sm`}
          >
            {renderLeft}
            <span className="pl-2">返回</span>
          </div>
        }
        right={
          <div onClick={() => setVisible(true)} className="flex justify-end cursor-pointer item-center">
            <SvgIcon name="location" className="w-[11px] h-[15px]" />
            <p className="ml-1 text-xs font-500">{renderNationText()}</p>
          </div>
        }
        // onBack={back}
        backArrow={<></>}
      // className={`${border ? styles.border : ''}`}
      >
        <span className={`flex text-sm items-center justify-center`}>{'信息广场'}</span>
      </NavBar>
      <div
        id="scrollableDiv"
        style={{
          height: `90vh`,
          overflow: 'auto',
          padding: '0 16px',
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={requestLoadMore}
          hasMore={hasMore}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>没有更多了 🤐</Divider>}
          scrollableTarget="scrollableDiv"
          className="flex flex-wrap"
          style={{ maxWidth: '832px' }}
        >
          {data.map((item: any, index: any) => renderItem(item, index))}
        </InfiniteScroll>
      </div>
      <CenterPopup
        visible={visible}
        onClose={() => setVisible(false)}
        style={{ '--min-width': '20rem' }}
        showCloseButton
      >
        <div className="flex p-4 flex-col justify-center items-center">
          <p className="font-500">请选择您的所在地区</p>
          {[
            {
              value: 0,
              label: '全部',
            },
            ...region,
          ].map((item: any) => {
            return (
              <div
                onClick={() => {
                  selectArce(item)
                  setCount(1)
                  setData([])
                }}
                key={item.value}
                className="flex pt-5 items-center "
              >
                <p>{item?.label}</p>
                <SvgIcon
                  name="checked"
                  className={`${selectNation === item.value ? 'opacity-100' : 'opacity-0'} w-[10px] h-[6px] ml-4`}
                />
              </div>
            )
          })}
          <Button onClick={() => setVisible(false)} color="primary" className="w-[90%] mt-6" shape="rounded">
            确认
          </Button>
        </div>
      </CenterPopup>
    </div>
  )
}

export default InformationMall
