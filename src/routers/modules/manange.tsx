import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const ManageRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage',
        element: lazyLoad(lazy(() => import('@/views/manage'))),
        key: 'manage',
      },
    ],
  },
  // 添加服务
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/service',
        element: lazyLoad(lazy(() => import('@/views/manage/add/service'))),
        key: 'manage_add_service',
      },
    ],
  },
  // 添加客户
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/customer',
        element: lazyLoad(lazy(() => import('@/views/manage/add/customer'))),
        key: 'manage_add_customer',
      },
    ],
  },
  // 添加员工
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/employee',
        element: lazyLoad(lazy(() => import('@/views/manage/add/employee'))),
        key: 'manage_add_employee',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/promote',
        element: lazyLoad(lazy(() => import('@/views/manage/add/promote'))),
        key: 'manage_add_promote',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/employee/information',
        element: lazyLoad(lazy(() => import('@/views/manage/add/employee/AddEmployeeForm'))),
        key: 'manage_add_employee_information',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/channel/information',
        element: lazyLoad(lazy(() => import('@/views/manage/add/channel/AddChannelForm'))),
        key: 'manage_add_channel_information',
      },
    ],
  },
  //  添加渠道
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/add/channel',
        element: lazyLoad(lazy(() => import('@/views/manage/add/channel'))),
        key: 'manage_add_channel',
      },
    ],
  },
  // 员工列表
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/list',
        element: lazyLoad(lazy(() => import('@/views/manage/employee-list'))),
        key: 'manage_employee_list',
      },
    ],
  },
  // 渠道列表
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/channel/list',
        element: lazyLoad(lazy(() => import('@/views/manage/channel-list'))),
        key: 'manage_channel_list',
      },
    ],
  },
  // 服务列表
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/service/list',
        element: lazyLoad(lazy(() => import('@/views/manage/service-list'))),
        key: 'manage_service_list',
      },
    ],
  },
  // 客户列表
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/customer/list',
        element: lazyLoad(lazy(() => import('@/views/manage/customer-list'))),
        key: 'manage_customer_list',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/channel/info',
        element: lazyLoad(lazy(() => import('@/views/manage/channel-info'))),
        key: 'manage_channel_info',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/customer/info',
        element: lazyLoad(lazy(() => import('@/views/manage/customer-info'))),
        key: 'manage_customer_info',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/info',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element: lazyLoad(lazy(() => import('@/views/manage/employee-info'))),
        key: 'manage_employee_info',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/info/edit',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element: lazyLoad(lazy(() => import('@/views/manage/employee-info/edit'))),
        key: 'manage_employee_info_edit',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/info/edit/detail',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element: lazyLoad(lazy(() => import('@/views/manage/employee-info/edit/detail'))),
        key: 'manage_employee_info_edit_detail',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/base/info',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element: lazyLoad(lazy(() => import('@/views/manage/pc-base-info'))),
        key: 'manage_employee_info_edit_detail',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/intive',
        element: lazyLoad(lazy(() => import('@/views/manage/invite-email'))),
        key: 'manage_employee_intive',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/intive/success',
        element: lazyLoad(lazy(() => import('@/views/manage/invite-success'))),
        key: 'manage_employee_intive_success',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/information/mall',
        element: lazyLoad(lazy(() => import('@/views/manage/information-mall'))),
        key: 'manage_employee_information_mall',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/information/mall/detail',
        element: lazyLoad(lazy(() => import('@/views/manage/information-mall/detail'))),
        key: 'manage_employee_information_mall_detail',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/manage/employee/service/edit',
        element: lazyLoad(lazy(() => import('@/views/manage/employee-info/edit/detail/Service'))),
        key: 'manage_service_edit',
      },
    ],
  },
]

export default ManageRouter
