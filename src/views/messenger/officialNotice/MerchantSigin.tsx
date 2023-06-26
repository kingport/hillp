import HeaderNav from '@/components/HeaderNav'
import HiilpAvatar from '@/components/HiilpAvatat'
import ManageApi from '@/http/api/manage'
import ShareApi from '@/http/api/share'
import { useRequest } from 'ahooks'
import { Button, Toast } from 'antd-mobile'
import React from 'react'

const MerchantSigin = (props: any) => {
  const location: any = useLocation()
  const { state } = location
  const navigate = useNavigate()

  // 确认签约
  const { run: contract } = useRequest((params) => ManageApi.confirm(params), {
    manual: true,
    onSuccess() {
      Toast.show('签约成功')
      navigate('/manage/channel/list')
    },
  })

  // 获取信息
  const { data: res } = useRequest((params) => ShareApi.getShareInfo({ type: 4, id: state?.data?.merchant_id }))
  return (
    <div className="flex flex-col pt-48px pb-90px justify-center items-center">
      <HeaderNav title={'商家详情'} border renderRight={false} />
      <div className="flex flex-col justify-center shadow-sm rounded-lg mt-20 p-5 w-[80%]">
        <div className="flex justify-center items-center flex-col">
          <HiilpAvatar name={res?.data?.nickname} headurl={res?.data?.head} className="-mt-15" />
          <p>{res?.data?.nickname}</p>
          <p>商家</p>
        </div>
        <p className="text-xs py-8 text-xs">简介 {res?.data?.introduce}</p>
        <div className="flex items-center pb-6 text-xs">
          <div className="flex flex-col pr-5">
            <p>员工数</p>
            <p>{res?.data?.staff_num}</p>
          </div>
          <div className="flex flex-col">
            <p>接单数</p>
            <p>{res?.data?.order_num}</p>
          </div>
        </div>
        <div className="flex flex-col text-xs">
          <p>评分</p>
          <div className="flex items-center">
            {res?.data?.synthesis_score}（{res?.data?.score_num}人评分）
          </div>
        </div>
      </div>
      <div className="fixed-b-btn">
        <Button className="w-[40%] mr-2 h-[2.75rem] rounded-3xl" block loadingIcon={<></>} onClick={() => navigate(-1)}>
          忽略信息
        </Button>
        <Button
          className="w-[40%] ml-2 h-[2.75rem] rounded-3xl"
          block
          type="submit"
          color="primary"
          loadingIcon={<></>}
          onClick={() => {
            contract({
              type: state?.data?.type,
              temp_token: state?.data?.temp_token,
            })
          }}
        >
          立即签约
        </Button>
      </div>
    </div>
  )
}
export default MerchantSigin
