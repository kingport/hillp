import Ellipseing from '@/components/Ellipseing'
import HeaderNav from '@/components/HeaderNav'
import HiilpAvatar from '@/components/HiilpAvatat'
import ManageApi from '@/http/api/manage'
import { useRequest } from 'ahooks'
import { Button, ImageViewer, Image, Toast } from 'antd-mobile'
import React from 'react'
import styles from './index.module.scss'
import Pcindex from './Pcindex'

const Detail = () => {
  const location: any = useLocation()
  const navigate = useNavigate()

  const { data: detail } = useRequest(() => ManageApi.userDetails({ id: location?.state?.id }))

  const [visibleImg, setVisibleImg] = useState(false)

  const applySign = async () => {
    const res = await ManageApi.signingApply({ id: location?.state?.id })
    if (res.status === 200) {
      Toast.show(res.msg)
      navigate(-1)
    }
  }

  return (
    <>
      <div className={`${styles.customerInfo} pb-[90px] flex flex-col items-center sm:(hidden)`}>
        <HeaderNav bg="#2A4948" leftIconColor={'#fff'} renderRight={false} />
        <div className={`${styles.customerHeader} h-75 flex items-center flex-col`}>
          <HiilpAvatar name={detail?.data?.nickname} headurl={detail?.data?.head} className="z-10 mt-20 text-lg" />
          <p className="pt-4 z-10 font-600 text-color-[#fff]">{detail?.data?.nickname}</p>
          <p className="z-10 text-xs text-color-[#fff]">
            综合评分 {detail?.data?.synthesis_score} {detail?.data?.score_num}人评分
          </p>
        </div>
        <div className="shadow-sm flex justify-between px-8 py-6 w-[70%] -m-14 bg-[#fff] rounded-lg z-20">
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
        <div className="shadow-sm flex flex-col px-8 py-4 mb-4 w-[70%] mt-20 bg-[#fff] rounded-lg">
          <div className="flex flex-col">
            <p className="text-xs">简介</p>
            <p className="text-xs font-500 text-color-[#292929]">{detail?.data?.introduce || '--'}</p>
          </div>
        </div>
        {!!detail?.data?.picture.length && (
          <div className="shadow-sm flex h-[144px] flex-col mb-4 w-[70%] mt-1 bg-[#fff] rounded-lg">
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
        <div className="shadow-sm flex flex-col px-8 py-4 mb-4 w-[70%] mt-1 bg-[#fff] rounded-lg">
          <div className="flex flex-col">
            <p className="text-xs">基础服务111</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.basis}</p>
          </div>
          <div className="flex flex-col pt-4">
            <p className="text-xs">额外服务</p>
            <p className="text-sm font-500 text-color-[#292929]">{detail?.data?.extra}</p>
          </div>
        </div>
        <div className="shadow-sm flex flex-col px-8 py-4 mb-4 w-[70%] mt-1 bg-[#fff] rounded-lg">
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

        <div className="fixed-b-btn flex">
          <Button
            onClick={applySign}
            className="w-[70%] h-[2.75rem]"
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
      <div className="<sm:(hidden)">
        <Pcindex detail={detail} />
      </div>
    </>
  )
}

export default Detail
