import React, { lazy } from 'react'
import lazyLoad from './utils/lazyLoad'
import { RouteObject } from '@/routers/interface'

const metaRouters: any = import.meta.globEager('./modules/*.tsx')

/**
 * @description 处理路由
 * @returns {*}
 */
export const routerArray: RouteObject[] = []
Object.keys(metaRouters).forEach((item) => {
  Object.keys(metaRouters[item]).forEach((key: any) => {
    routerArray.push(...metaRouters[item][key])
  })
})

export const rootRouter: any = [
  {
    path: '/',
    element: lazyLoad(lazy(() => import('@/views/user'))),
  },
  {
    path: '*',
    element: lazyLoad(lazy(() => import('@/components/ErrorMessage'))),
  },
  ...routerArray,
  {
    path: '/verification',
    element: lazyLoad(lazy(() => import('@/views/verification'))),
  },
  {
    path: '/share',
    element: lazyLoad(lazy(() => import('@/views/share'))),
  },
  {
    path: '/search',
    element: lazyLoad(lazy(() => import('@/views/search'))),
  },
  {
    path: '/news',
    element: lazyLoad(lazy(() => import('@/views/news'))),
  }
]
