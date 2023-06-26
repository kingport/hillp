import React, { FC } from 'react'
import { Badge, TabBar, Image } from 'antd-mobile'
import { withRouter } from '@/utils/withRouter'
import styles from './index.module.scss'
import SvgIcon from '../SvgIcon'
import { store } from '@/redux'
import EchartPng from '@/assets/echart.png'
import Mejpg from '@/assets/me.jpg'
import Messagejpg from '@/assets/message.jpg'
import { MessageContext } from '@/utils/message'

const FooterBar = (props: any) => {
  const [activeKey, setActiveKey] = React.useState('/field/home')
  const [hideTab, sethideTab] = React.useState(false)
  const [tabs, setTabs] = React.useState<any>([])

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const messageNumber: any = React.useContext(MessageContext)
  useEffect(() => {
    setTabs([
      {
        key: '/calendar',
        title: '日历',
        icon: (active: boolean) => (
          <SvgIcon className={styles.barIcon} name={active ? 'calendar-active' : 'calendar'} />
        ),
      },
      {
        key: '/manage',
        title: '管理',
        icon: (active: boolean) => <SvgIcon className={styles.barIcon} name={active ? 'manage-active' : 'manage'} />,
      },
      {
        key: '/database',
        title: '报表',
        icon: (active: boolean) =>
          active ? (
            <SvgIcon className={styles.barIcon} name={'echart-active'} />
          ) : (
            <img src={EchartPng} className={styles.barIcon} />
          ),
      },
      {
        key: '/messenger',
        title: '消息',
        icon: (active: boolean) => {
          if (messageNumber?.new_message) {
            return (
              <Badge content={Badge.dot} color="#2A4948">
                {active ? (
                  <SvgIcon className={styles.barIcon} name={'message-active'} />
                ) : (
                  <img src={Messagejpg} className={styles.barIcon} />
                )}
              </Badge>
            )
          } else {
            return (
              <>
                {active ? (
                  <SvgIcon className={styles.barIcon} name={'message-active'} />
                ) : (
                  <img src={Messagejpg} className={styles.barIcon} />
                )}
              </>
            )
          }
        },
      },
      {
        key: '/personal',
        title: '个人',
        icon: (active: boolean) =>
          active ? (
            <SvgIcon className={styles.barIcon} name={'me-active'} />
          ) : (
            <img src={Mejpg} className={styles.barIcon} />
          ),
        // icon: (active: boolean) => <SvgIcon className={styles.barIcon} name={active ? 'me-active' : 'me'} />,
      },
    ])
  }, [messageNumber])

  const onChange = (val: string) => {
    setActiveKey(val)
    navigate(`${val}`)
  }

  useEffect(() => {
    if (tabs.length) {
      setActiveKey(pathname)
      sethideTab(!tabs.map((item: any) => item.key).includes(pathname) && pathname !== '/calendar/plan')
    }
  }, [pathname, tabs])

  return (
    <div style={{ display: hideTab ? 'none' : 'block', maxWidth: '100%' }} className={`${styles.FooterBar}`}>
      <TabBar activeKey={activeKey} onChange={onChange}>
        {tabs.map((item: any) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  )
}
export default withRouter(FooterBar)
