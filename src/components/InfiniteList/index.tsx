import React from 'react'
import { DotLoading, InfiniteScroll } from 'antd-mobile'

const InfiniteList = (props: any) => {
  const { renderItem, data: list = [], renderEmpty, requestLoadMore } = props

  const [data, setData] = useState<string[]>([...list])
  const [hasMore, setHasMore] = useState(true)

  async function loadMore() {
    const append = await requestLoadMore()
    setData((val) => [...val, ...append])
    setHasMore(append.length > 0)
  }

  const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    if (renderEmpty) {
      return (
        <>
          {hasMore ? (
            <>
              <span>Loading</span>
              <DotLoading />
            </>
          ) : data.length === 0 ? (
            renderEmpty()
          ) : (
            <></>
          )}
        </>
      )
    } else {
      return (
        <>
          {hasMore ? (
            <>
              <span>Loading</span>
              <DotLoading />
            </>
          ) : (
            <span>--- 没有更多了 ---</span>
          )}
        </>
      )
    }
  }

  return (
    <>
      <>{data.map((item, index) => renderItem(item, index))}</>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
        <InfiniteScrollContent hasMore={hasMore} />
      </InfiniteScroll>
    </>
  )
}

export default InfiniteList
