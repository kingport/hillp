import React from 'react'
import HeaderNav from '@/components/HeaderNav'
import SvgIcon from '@/components/SvgIcon'
import { Dropdown } from 'antd'
import { store } from '@/redux'
import { h5Copy, saveImage } from '@/utils/util'
import { CenterPopup } from 'antd-mobile'
import { QRCodeSVG } from 'qrcode.react'

const navs = [
  {
    id: 1,
    title: '系统设置',
    path: '/personal/setting/info',
  },
  {
    id: 2,
    title: '通知设置',
    path: '/personal/setting/notice',
  },
  // {
  //   id: 3,
  //   title: '存储空间',
  //   path: '/personal/setting/storage',
  // },
  // {
  //   id: 4,
  //   title: '版本号 ',
  //   path: '/personal/setting/version',
  // },
]

const Setting = () => {
  const navigator = useNavigate()
  const userInfo = store.getState().global.userInfo
  const [visibleQrcode, setVisibleQrcode] = useState(false)
  const canvasRef = useRef(null)

  let type = ''
  // 商家
  if (userInfo.user_type * 1 === 2) type = `4`
  // 个人
  if (userInfo.user_type * 1 === 1) type = `3`

  const items = [
    {
      label: (
        <span
          onClick={() => {
            setVisibleQrcode(true)
            setTimeout(() => {
              saveImage(canvasRef)
            }, 500)
          }}
        >
          保存邀请二维码
        </span>
      ),
      key: '1',
    },
    {
      label: (
        <span onClick={() => h5Copy(`${window.location.origin}/share?type=${type}&id=${userInfo.user_id}`)}>
          复制邀请链接
        </span>
      ),
      key: '2',
    },
  ]

  const NavList = () => {
    return (
      <div className="flex w-full flex-col sm:(w-340px shadow-sm py-4 rounded-xl)">
        {navs.map((item: any) => {
          return (
            <div
              onClick={() => navigator(item?.path)}
              key={item.id}
              style={{ borderBottom: '1px solid #eee' }}
              className="flex cursor-pointer px-10 py-10 items-center justify-between active:bg-[#f9f9fa]"
            >
              <div className="flex flex-col">
                <p className="text-sm">{item?.title}</p>
              </div>
              <SvgIcon name="verify-right" className="w-[6px] h-[10px]" />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-[48px] sm:(w-full items-center justify-center pt-0)">
      <HeaderNav renderRight={false} title="系统设置" border />
      <div className="py-8 flex justify-between items-center w-340px <sm:(hidden)">
        <p className=" font-600 text-2xl ">账号设置</p>
        <Dropdown trigger={['click']} menu={{ items }} placement="bottom">
          <SvgIcon name="point" className="w-[18px] h-[10px] cursor-pointer" />
        </Dropdown>
      </div>
      <NavList />
      <CenterPopup
        visible={visibleQrcode}
        onMaskClick={() => setVisibleQrcode(false)}
        style={{ '--max-width': '15.875rem', '--z-index': '99999999' }}
      >
        <div ref={canvasRef} className="flex flex-col justify-center items-center py-5 text-xs text-color-[#858585]">
          <p>{userInfo?.nickname} 邀请您加入HIILP</p>
          <p className="pb-5">扫描下方二维码立即加入</p>
          <QRCodeSVG
            value={`${window.location.origin}/share?type=${type}&id=${userInfo.user_id}`}
            fgColor="#496b6a"
            size={135}
          />
        </div>
      </CenterPopup>
    </div>
  )
}

export default Setting
