import React from 'react'
import { menuList } from './menu.config'
import styles from './index.module.scss'
import { Tooltip } from 'antd'
import { store } from '@/redux'
const LayoutMenu = (props: any) => {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<any>()
  const userInfo = store.getState().global.userInfo
  const userType = Number(userInfo.user_type) === 1

  useEffect(() => {
    const menuListFitler = menuList(userType)
    setActiveId(menuListFitler.find((x: any) => window.location.pathname === x.path)?.id)

  }, [window.location.pathname])

  return (
    <div className={`flex flex-col py-5 items-center w-60px bg-[#2A4948] ${styles.menus}`}>
      {menuList(userType)?.map((item: any) => (
        <Tooltip placement="rightTop" zIndex={99} key={item?.id} title={item?.name} color={'#8fa2a2'}>
          <div
            key={item?.id}
            onClick={() => {
              setActiveId(item.id)
              navigate(item?.path)
            }}
            className={`${
              styles.menu
            } mb-1.5 cursor-pointer relative flex justify-center items-center rounded-md w-37px h-37px bg-transparent ${
              item?.menuPaths.includes(window.location.pathname) ? '!bg-[#9ECED2]' : 'hover:(bg-[#607777])'
            }`}
          >
            {item?.icon}
          </div>
        </Tooltip>
      ))}
    </div>
  )
}

export default LayoutMenu
