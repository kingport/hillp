import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import HiilpAvatar from '@/components/HiilpAvatat'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { Button, ImageViewer, Image, Toast, NavBar } from 'antd-mobile'
import SvgIcon from '@/components/SvgIcon'
import React from 'react'
import styles from './index.module.scss'

const Detail = (props: any) => {
  const { detail } = props
  const location: any = useLocation()
  const navigate = useNavigate()

  // const { data: detail } = useRequest(() => ManageApi.userDetails({ id: location?.state?.id }))

  const [visibleImg, setVisibleImg] = useState(false)

  const applySign = async () => {
    const res = await ManageApi.signingApply({ id: location?.state?.id })
    if (res.status === 200) {
      Toast.show(res.msg)
      navigate(-1)
    }
  }
  const renderLeft = <SvgIcon style={{ color: '', width: '20px', height: '48px' }} name="nav-left" />

  return (
    <div className={`flex flex-col items-center min-h-[calc(100vh-60px)]`}>
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
        // onBack={back}
        backArrow={<></>}
      // className={`${border ? styles.border : ''}`}
      >
        <span className={`flex text-sm items-center justify-center`}>{'详情资料'}</span>
      </NavBar>
      <div className="w-500px">
        <div className={`flex items-center flex-col`}>
          <p className="pt-4 z-10 font-600 text-color-[#333]">{detail?.data?.nickname}</p>
          <p className="z-10 text-xs text-color-[#333] mt-[8px] mb-[16px]">
            综合评分 {detail?.data?.synthesis_score} <span className='ml-2'>共{detail?.data?.score_num}人评分</span>
          </p>
        </div>
        <div className="shadow-sm flex justify-between px-8 py-6 w-[100%] bg-[#fff] rounded-lg z-20">
          <div className="flex flex-col">
            <p className="text-xs">年龄</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.age || '--'}岁</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs">体重</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.weight || '--'}kg</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs">身高</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.height || '--'}cm</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs">胸围</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.chest || '--'}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-4 mb-4 w-[100%] mt-4 bg-[#fff] rounded-lg">
          <div className="flex flex-col">
            <p className="text-xs">简介</p>
            <p className="text-xs font-500 text-color-[#292929]">{detail?.data?.introduce || '--'}</p>
          </div>
        </div>
        {!!detail?.data?.picture.length && (
          <div className="shadow-sm flex flex-col mb-4 w-[100%] mt-1 bg-[#fff] rounded-lg">
            <Image
              src={detail?.data?.picture[0]}
              onClick={() => setVisibleImg(true)}
              className="rounded-lg"
              fit="cover"
            />
            <ImageViewer.Multi
              images={detail?.data?.picture}
              defaultIndex={1}
              visible={visibleImg}
              onClose={() => {
                setVisibleImg(false)
              }}
            />
          </div>
        )}
        <div className="shadow-sm flex flex-col px-8 py-4 mb-4 w-[100%] mt-1 bg-[#fff] rounded-lg">
          <div className="flex flex-col">
            <p className="text-xs">基础服务</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.basis}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">额外服务</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.extra}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-4 mb-4 w-[100%] mt-1 bg-[#fff] rounded-lg">
          <div className="flex items-center">
            <p className="text-xs pr-4">员工成本</p>
            {detail?.data?.cost_type === 1 && <p className="text-xs font-600">{detail?.data?.cost}%</p>}
          </div>
          {detail?.data?.cost_type === 2 && (
            <div className="text-xs pt-2 font-600">
              <p className="flex items-center">
                {detail?.data?.cost?.eat_in && '堂食：'}
                {detail?.data?.cost?.eat_in?.map((item: any, index: string) => (
                  <span key={index}>
                    {item.time}min：${item?.price} &nbsp;
                  </span>
                ))}
              </p>
              <p>
                {detail?.data?.cost?.take_out && '外卖：'}
                {detail?.data?.cost?.take_out?.map((item: any, index: string) => (
                  <span key={index}>
                    {item.time}min：${item?.price} &nbsp;
                  </span>
                ))}
              </p>
            </div>
          )}
          {detail?.data?.min_duration && (
            <div className="text-xs font-600">
              <p className="flex items-center">
                最低时长：
                <span>{detail?.data?.min_duration}min</span>
              </p>
            </div>
          )}
          {detail?.data?.min_price && (
            <div className="text-xs font-600">
              <p className="flex items-center">
                最低单价：
                <span>${detail?.data?.min_price}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex">
          <Button
            onClick={applySign}
            className="w-[100%] h-[2.75rem]"
            loading="auto"
            shape="rounded"
            block
            type="submit"
            color="primary"
            loadingIcon={<Ellipseing />}
          >
            申请签约
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Detail
