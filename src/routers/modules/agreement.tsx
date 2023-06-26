import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const AgreementRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/agreement',
        element: lazyLoad(lazy(() => import('@/views/agreement'))),
      },
    ],
  },
]

export default AgreementRouter
