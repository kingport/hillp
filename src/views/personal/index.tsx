import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Button, CenterPopup, Popup, Toast } from 'antd-mobile'
import styles from './index.module.scss'
import { h5Copy, saveImage } from '@/utils/util'
import { QRCodeSVG } from 'qrcode.react'
import { store } from '@/redux'
import HiilpAvatar from '@/components/HiilpAvatat'
import UploadApi from '@/http/api/upload'
import { useRequest } from 'ahooks'
import PersonalApi from '@/http/api/personal'
import { updataUserInfo } from '@/redux/modules/global/action'
import UserApi from '@/http/api/user'

import InviteIcon from '@/assets/invite.png'
import ShareIcon from '@/assets/share.png'

const navs = [
  {
    id: 1,
    title: '个人信息',
    desc: '查看和编辑个人资料',
    path: '/personal/information',
  },
  {
    id: 2,
    title: '我的钱包',
    desc: '查看收款方式及流水明细',
    path: '/personal/wallet',
  },
  {
    id: 3,
    title: '账号权限',
    desc: '开通相关服务以获得权限',
    path: '/personal/auth',
  },
  {
    id: 4,
    title: '账号安全',
    desc: '修改密码及操作账号状态',
    path: '/personal/security',
  },
  {
    id: 5,
    title: '账户设置',
    desc: '修改密码及查看版本信息',
    path: '/personal/setting',
  },
  // {
  //   id: 6,
  //   title: '帮助',
  //   desc: '联系客服/常见问题/合作意向',
  //   path: '/personal/help',
  // },
]

function Personal() {
  const [visible, setVisible] = useState(false)
  const [visibleShare, setVisibleShare] = useState(false)
  const [visibleQrcode, setVisibleQrcode] = useState(false)
  const canvasRef = useRef<any>()
  const navigate = useNavigate()

  const { data: userInfo, refresh } = useRequest(() => UserApi.getUserInfo({}))
  const [avatarInfo, setAvatarInfo] = useState<any>({
    file_path: '',
    file_url: '',
  })
  const fileInputEl = useRef<any>(null)

  let type = ''
  // 商家
  if (userInfo?.data?.user_type * 1 === 2) type = `4`
  // 个人
  if (userInfo?.data?.user_type * 1 === 1) type = `3`

  const RightNav = () => {
    return (
      <div className="flex items-center  text-color-[#fff]">
        <SvgIcon onClick={() => setVisibleShare(true)} name="personal" className="w-[19px] h-[19px] mr-4" />
        <SvgIcon onClick={() => setVisible(true)} name="share" className="w-[19px] h-[19px]" />
      </div>
    )
  }

  const TopNav = () => {
    return (
      <div className="flex flex-col gap-y-[12px] text-color-[#fff]  absolute right-0 top-[35px] z-1 text-xs">
        <div
          className="flex items-center bg-[#ffffff] text-color-[#2A4948] px-[16px] py-[6px] rounded-l-[15px]"
          onClick={() => setVisibleShare(true)}
        >
          <img src={InviteIcon} className="w-[12px] h-[12px] mr-[12px]" /> 邀请
        </div>
        <div
          className="flex items-center px-[16px] py-[6px] border-solid border-white border-1 border-r-0 rounded-l-[15px]"
          onClick={() => setVisible(true)}
        >
          <img src={ShareIcon} className="w-[12px] h-[12px] mr-[12px]" />
          分享
        </div>
      </div>
    )
  }

  const NavList = () => {
    return (
      <div className="flex w-full flex-col mt-20">
        {navs.map((item: any) => {
          return (
            <div
              onClick={() => navigate(item.path)}
              key={item.id}
              style={{ borderBottom: '1px solid #eee' }}
              className="flex px-10 py-5 items-center justify-between active:bg-[#f9f9fa]"
            >
              <div className="flex flex-col">
                <p className="text-sm">{item?.title}</p>
                <p className="text-xs text-color-[#646464]">{item?.desc}</p>
              </div>
              <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
            </div>
          )
        })}
      </div>
    )
  }

  const handlePhoto = async (event: any) => {
    const files = [...event.target.files]
    if (files.length) {
      const res = await UploadApi.uploadFile(files)
      if (res?.status === 200) {
        Toast.show(res.data.msg)
        run({ head: res?.data?.data?.file_url })
        setAvatarInfo(res.data.data)
      }
    }
  }

  const { run } = useRequest((params) => PersonalApi.updateHead(params), {
    manual: true,
    onSuccess() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.dispatch(updataUserInfo)
    },
  })

  const CardInfo = () => {
    return (
      <div className="shadow-sm flex justify-center py-4 w-[70%] -m-14 bg-[#fff] rounded-lg z-20">
        <div className="flex flex-col items-center w-[50%] border-r">
          <p className="text-xs">评分</p>
          <p className="text-2xl font-600">{userInfo?.data?.synthesis_score}</p>
        </div>
        <div className="flex flex-col items-center w-[50%] border-r">
          <p className="text-xs">订单</p>
          <p className="text-2xl font-600">{userInfo?.data?.order_num}</p>
        </div>
        <div className="flex flex-col items-center w-[50%]">
          <p className="text-xs">粉丝</p>
          <p className="text-2xl font-600">{userInfo?.data?.fans_num}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.personalInfo} pb-[90px] flex flex-col items-center relative`}>
      {/* <HeaderNav leftIconColor={'#fff'} bg={'#2A4948'} renderLeft={false} renderRight={<RightNav />} /> */}
      <TopNav />
      <div className={`${styles.customerHeader}  h-75 flex items-center flex-col`}>
        <div className="relative mt-20">
          <HiilpAvatar
            className="z-10"
            headurl={avatarInfo?.file_url || userInfo?.data?.head}
            name={userInfo?.data?.nickname}
          />
          <div
            onClick={async () => await fileInputEl.current.click()}
            className="w-18px -bottom-0 -right-0 absolute z-99 h-18px bg-[#fff] rounded-full flex justify-center items-center"
          >
            <SvgIcon name="amend" className="w-10px h-9px" />
          </div>
          <input
            id="file"
            type="file"
            ref={fileInputEl} //挂载ref
            accept=".jpg,.jpeg,.png" //限制文件类型
            hidden //隐藏input
            onChange={(event) => handlePhoto(event)}
          />
        </div>
        <div className="pt-4 z-10 font-600 text-color-[#fff] relative">{userInfo?.data?.nickname}</div>
        <p className="text-xs z-10 text-color-[#fff] opacity-70">UID {userInfo?.data?.user_id}</p>
      </div>
      <CardInfo />
      <NavList />
      <Popup
        visible={visible}
        onClose={() => setVisible(false)}
        showCloseButton
        bodyStyle={{ height: 'auto', borderRadius: '20px 20px 0 0' }}
      >
        <div className="py-12 px-10">
          <div
            onClick={() => {
              h5Copy(
                `${
                  userInfo?.data?.online_url
                    ? userInfo?.data?.online_url
                    : window.location.origin + '/share?type=' + type + '&id=' + userInfo?.data.user_id
                }`
              )
              setVisible(false)
            }}
            className="flex rounded-lg py-1 bg-gradient-to-r from-[#3a5050]  to-[#768586] justify-center items-center text-color-[#fff]"
          >
            <SvgIcon name="copy" className="w-[16px] h-[16px]" />
            <Button className="text-color-[#fff]" fill="none">
              复制链接
            </Button>
          </div>
        </div>
      </Popup>
      <Popup
        visible={visibleShare}
        onClose={() => setVisibleShare(false)}
        showCloseButton
        bodyStyle={{ height: 'auto', borderRadius: '20px 20px 0 0' }}
      >
        <div ref={canvasRef} className="flex flex-col justify-center items-center py-5 text-xs text-color-[#858585]">
          <p>{userInfo?.data?.nickname} 邀请您加入HIILP</p>
          <p className="pb-5">扫描下方二维码立即加入</p>
          <QRCodeSVG
            value={`${window.location.origin}/user?invita_code=${userInfo?.data?.invitation_code}`}
            fgColor="#496b6a"
            size={135}
          />
          <p className="pb-5 pt-2">邀请码 {userInfo?.data?.invitation_code}</p>
        </div>
        <div className="pt-14 pb-10 px-4 flex items-center justify-between">
          <div
            onClick={() => {
              h5Copy(`${window.location.origin}/user?invita_code=${userInfo?.data?.invitation_code}`)
              setVisibleShare(false)
            }}
            className="flex rounded-lg py-1 px-8 bg-[#f3f3f3] justify-center items-center text-color-[#fff]"
          >
            <SvgIcon name="copy" style={{ color: '#2A4948' }} className="w-[16px] h-[16px]" />
            <Button className="text-color-[#2A4948]" fill="none">
              复制链接
            </Button>
          </div>
          <div
            onClick={() => {
              // setVisibleQrcode(true)
              setTimeout(() => {
                saveImage(canvasRef)
              }, 2000)
            }}
            className="flex rounded-lg py-1 px-8 bg-[#f3f3f3] justify-center items-center text-color-[#fff]"
          >
            <SvgIcon name="img" className="w-[20px] h-[16px]" />
            <Button className="text-color-[#2A4948]" fill="none">
              保存图片
            </Button>
          </div>
        </div>
      </Popup>
      {/* <CenterPopup
        visible={visibleQrcode}
        onMaskClick={() => {
          setVisibleQrcode(false)
        }}
        style={{ '--max-width': '15.875rem', '--z-index': '99999999' }}
      >
        <div ref={canvasRef} className="flex flex-col justify-center items-center py-5 text-xs text-color-[#858585]">
          <p>{userInfo?.data?.nickname} 邀请您加入HIILP</p>
          <p className="pb-5">扫描下方二维码立即加入</p>
          <QRCodeSVG value={`${window.location.origin}/user`} fgColor="#496b6a" size={135} />
        </div>
      </CenterPopup> */}
    </div>
  )
}

export default Personal
