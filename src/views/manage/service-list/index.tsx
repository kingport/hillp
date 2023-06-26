import React from 'react'
import styles from './index.module.scss'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { useRequest } from 'ahooks'
import ManageApi from '@/http/api/manage'
import PcServerList from './Pc'

function ServiceList() {
  const navigate = useNavigate()
  const { data: serverList, loading, refresh, run } = useRequest((params) => ManageApi.getServerList(params))
  const location: any = useLocation()
  const serviceTabs = [
    {
      id: 1,
      title: '基础项目',
      key: 'basis',
    },
    {
      id: 2,
      title: '额外项目',
      key: 'extra',
    },
  ]

  return (
    <div className={`${styles.serviceList} pt-[48px] <sm:(min-h-[100vh]) bg-[#fff]`}>
      <HeaderNav
        title="服务列表"
        renderRight={false}
        onBack={() => {
          if (location?.state?.type === 'service') {
            navigate(-2)
          } else {
            navigate('/manage')
          }
        }}
      />
      <div className="flex flex-col sm:(hidden)">
        {serviceTabs.map((item) => {
          return (
            <div key={item.id} className="flex flex-col">
              <p className="py-4 px-5">{item.title}</p>
              {serverList?.data[item.key].map((citem: any) => {
                return (
                  <div
                    onClick={() => navigate('/manage/add/service', { state: { type: 'edit', id: citem.id } })}
                    className="flex px-5 py-6 border-t flex-col active:bg-[#f9f9fa]"
                    key={citem.id}
                  >
                    <div className="flex justify-between">
                      <p className="text-xs">{citem?.name}</p>
                      <p className="text-xs text-color-[#4f4f4f]">{citem?.price}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div
        onClick={() => navigate('/manage/add/service')}
        className="sm:(hidden) bg-[#fff] flex fixed left-8 bottom-15 flex-auto shadow-sm rounded-md items-center px-4 py-3"
      >
        <SvgIcon name="add" className="w-[11px] h-[11px]" />
        <span className="text-xs pl-1">添加新服务</span>
      </div>
      {/* pc */}
      <PcServerList run={run} serverList={serverList} refresh={refresh} loading={loading} />
    </div>
  )
}

export default ServiceList
