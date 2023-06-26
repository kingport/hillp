import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const PayRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/pay',
        element: lazyLoad(lazy(() => import('@/views/pay'))),
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/pay/change/mode',
        element: lazyLoad(lazy(() => import('@/views/pay/ChangeMode'))),
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/pay/add/mode',
        element: lazyLoad(lazy(() => import('@/views/pay/AddMode'))),
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/pay/success',
        element: lazyLoad(lazy(() => import('@/views/pay/Success'))),
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/pay/faild',
        element: lazyLoad(lazy(() => import('@/views/pay/Faild'))),
      },
    ],
  },
]

export default PayRouter
