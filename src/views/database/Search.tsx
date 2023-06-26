import SvgIcon from '@/components/SvgIcon'
import { SearchBar } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'

interface Props {
  tip?: string
}

const Search = (props: Props) => {
  const { tip } = props
  return (
    <div className="flex items-center w-full">
      <div className={`${styles.searchinput} pr-4 w-full justify-between`}>
        <SearchBar placeholder={tip} />
        <div className="flex items-center">
          <SvgIcon name="filter-order" className="w-[11px] h-[13px]" />
          <p className="text-xs pl-1">筛选</p>
        </div>
      </div>
    </div>
  )
}

export default Search
