import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const CalendarRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/calendar',
        element: lazyLoad(lazy(() => import('@/views/calendar'))),
        key: 'calendar',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/calendar/:mode',
        element: lazyLoad(lazy(() => import('@/views/calendar'))),
        key: 'calendar_mode',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/calendar/kanban',
        element: lazyLoad(lazy(() => import('@/views/calendar/kanban'))),
        key: 'calendar_kanban',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/calendar/add/break',
        element: lazyLoad(lazy(() => import('@/views/calendar/add/AddBreakForm'))),
        key: 'calendar_add_break',
      },
    ],
  },
  // {
  //   element: <LayoutIndex />,
  //   children: [
  //     {
  //       path: '/calendar/add/order',
  //       element: lazyLoad(lazy(() => import('@/views/calendar/add/AddOrderForm'))),
  //       key: 'calendar_add_order',
  //     },
  //   ],
  // },
  {
    path: '/calendar/add/order',
    element: lazyLoad(lazy(() => import('@/views/calendar/add/AddOrderForm'))),
    key: 'calendar_add_order',
  },
  {
    path: '/calendar/edit/order/:id',
    element: lazyLoad(lazy(() => import('@/views/calendar/add/AddOrderForm'))),
    key: 'calendar_edit_order',
  },
  {
    path: '/calendar/result',
    element: lazyLoad(lazy(() => import('@/views/calendar/result'))),
    key: 'calendar_result',
  },
  {
    path: '/calendar/view',
    element: lazyLoad(lazy(() => import('@/views/calendar/view'))),
    key: 'calendar_view',
  },
  {
    path: '/calendar/pay',
    element: lazyLoad(lazy(() => import('@/views/calendar/pay'))),
    key: 'calendar_pay',
  },
  {
    path: '/calendar/pay/confirm',
    element: lazyLoad(lazy(() => import('@/views/calendar/pay/PayConfirm'))),
    key: 'calendar_pay_confirm',
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/calendar/rest/check',
        element: lazyLoad(lazy(() => import('@/views/calendar/check'))),
        key: 'calendar_rest_check',
      },
    ],
  },
]

export default CalendarRouter
