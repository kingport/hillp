import React from 'react'
import UserApi from '@/http/api/user'
import { useRequest } from 'ahooks'
import EmptyImage from '@/assets/empty.png'
import styles from './index.module.scss'



function News() {
    const {
        run: searchRun,
        loading,
        data: fqData,
      } = useRequest((params) => UserApi.getFqIndex(params), {
        debounceWait: 500,
      })

    return (
        fqData?.data?.text ?
        <div className={`${styles.htmlGroup}`} dangerouslySetInnerHTML={{__html: fqData?.data?.text}}></div> : 
        <div className={`${styles.emptyGroup}`}>
            <img className={`${styles.emptyImage}`} src={EmptyImage} alt="" />
            <div className={`${styles.emptyText}`}>暂无数据</div>
        </div>
    )
}

export default News