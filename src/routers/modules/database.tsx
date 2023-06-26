import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const DatabaseRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database',
        element: lazyLoad(lazy(() => import('@/views/database'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/list',
        element: lazyLoad(lazy(() => import('@/views/database/list'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/order/detail',
        element: lazyLoad(lazy(() => import('@/views/database/order/Detail'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/kanban/turnover',
        element: lazyLoad(lazy(() => import('@/views/database/kanban/Turnover'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/kanban/income',
        element: lazyLoad(lazy(() => import('@/views/database/kanban/Income'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/kanban/employee',
        element: lazyLoad(lazy(() => import('@/views/database/kanban/Employee'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/kanban/saletype',
        element: lazyLoad(lazy(() => import('@/views/database/kanban/SaleType'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/database/kanban/duration',
        element: lazyLoad(lazy(() => import('@/views/database/kanban/Duration'))),
      },
    ],
  },
]

export default DatabaseRouter
