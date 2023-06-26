import React from 'react'
import SvgIcon from '@/components/SvgIcon'
import { store } from '@/redux'
// import { useMount, useRequest } from 'ahooks'
// import MessengerApi from '@/http/api/messenger'
import { Badge } from 'antd'
import { useUpdateEffect } from 'ahooks'

export const menuList = (userType: boolean) => {
  return [
    {
      id: 1,
      name: '订单看板',
      path: '/calendar/kanban',
      icon: <SvgIcon name="pc-kanban" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/calendar/kanban'],
    },
    {
      id: 2,
      name: '预约日历',
      path: '/calendar',
      icon: <SvgIcon name="pc-calendar" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/calendar'],
    },
    // TODO
    {
      id: 3,
      name: '排班日历',
      path: '/calendar/plan',
      icon: <SvgIcon name="pc-arrange" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/calendar/plan'],
    },
    {
      id: 4,
      name: userType ? '添加新渠道' : '添加新员工',
      path: userType ? '/manage/add/channel' : '/manage/add/employee',
      icon: <SvgIcon name={userType ? 'pc-channel' : 'pc-employee'} className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: [
        '/manage/add/channel',
        '/manage/add/employee',
        '/manage/add/employee/information',
        '/manage/employee/information/mall',
      ],
    },
    {
      id: 5,
      name: userType ? '管理渠道' : '管理员工',
      path: userType ? '/manage/channel/list' : '/manage/employee/list',
      icon: (
        <SvgIcon name={userType ? 'pc-manage-channel' : 'pc-manage'} className="w-4.5 h-5" style={{ color: '#fff' }} />
      ),
      menuPaths: ['/manage/channel/list', '/manage/channel/info', '/manage/employee/list', '/manage/employee/info'],
    },
    {
      id: 6,
      name: '管理服务',
      path: '/manage/service/list',
      icon: <SvgIcon name="pc-manage-service" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/manage/service/list'],
    },
    {
      id: 7,
      name: '管理客户',
      path: '/manage/customer/list',
      icon: <SvgIcon name="pc-manage-customer" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/manage/customer/list', '/manage/customer/info', '/manage/add/customer'],
    },
    {
      id: 8,
      name: '报表',
      path: '/database',
      icon: <SvgIcon name="pc-manage-chart" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: [
        '/database',
        '/database/kanban/duration',
        '/database/list',
        '/database/order/detail',
        '/database/kanban/turnover',
        '/database/kanban/income',
        '/database/kanban/employee',
        '/database/kanban/saletype',
      ],
    },
    {
      id: 9,
      name: '账号权限',
      path: '/personal/auth',
      icon: <SvgIcon name="pc-account-auth" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/personal/auth', '/personal/auth/online', '/personal/auth/association'],
    },
    {
      id: 10,
      name: '账号设置',
      path: '/personal/setting',
      icon: <SvgIcon name="pc-account-settting" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/personal/setting', '/personal/setting/info', '/personal/setting/notice'],
    },
    {
      id: 11,
      name: '账号安全',
      path: '/personal/security',
      icon: <SvgIcon name="pc-security" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/personal/security', '/user/change/old/pwd'],
    },
    {
      id: 12,
      name: '帮助',
      path: '/personal/help',
      icon: <SvgIcon name="pc-help" className="w-4.5 h-5" style={{ color: '#fff' }} />,
      menuPaths: ['/personal/help', '/news'],
    },
  ]
}

export const headerMenuList = (messageNumber: any) => [
  {
    id: 1,
    name: '搜索',
    icon: <SvgIcon name="pc-search" className="w-25px h-25px" />,
    path: '/search',
  },
  {
    id: 2,
    name: '官方通知',
    icon: (
      <Badge className={`${'opacity-100'}`} count={messageNumber?.pub_count} color="#2A4948">
        <SvgIcon name="pc-message" className="w-25px h-25px" />
      </Badge>
    ),
  },
  {
    id: 3,
    name: '消息',
    icon: (
      <Badge
        className={`${'opacity-100'}`}
        count={messageNumber?.sub_count || messageNumber?.ref_count}
        color="#2A4948"
      >
        <SvgIcon name="pc-message-one" className="w-24px h-24px" />
      </Badge>
    ),
  },
  {
    id: 4,
    icon: <SvgIcon name="pc-wallet" className="w-24px h-24px" />,
    name: '钱包',
    path: '/personal/wallet',
  },
]
