import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const MessengerRouter: Array<RouteObject> = [
  {
    path: '/messenger',
    element: lazyLoad(lazy(() => import('@/views/messenger'))),
    key: 'messenger',
  },
  {
    path: '/messenger/online/booking',
    element: lazyLoad(lazy(() => import('@/views/messenger/onlineBooking'))),
    key: 'messenger_online_booking',
  },
  {
    path: '/messenger/booking',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    element: lazyLoad(lazy(() => import('@/views/messenger/viewBooking'))),
    key: 'messenger_booking',
  },
  {
    path: '/messenger/notice',
    element: lazyLoad(lazy(() => import('@/views/messenger/viewNotice'))),
    key: 'messenger_notice',
  },
  {
    path: '/messenger/business/info',
    element: lazyLoad(lazy(() => import('@/views/messenger/businessInfo'))),
    key: 'messenger_business_info',
  },
  {
    path: '/messenger/official/notice',
    element: lazyLoad(lazy(() => import('@/views/messenger/officialNotice'))),
    key: 'messenger_official_notice',
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/messenger/official/change/cost',
        element: lazyLoad(lazy(() => import('@/views/messenger/officialNotice/CostChange'))),
        key: 'messenger_official_change_cost',
      },
    ],
  },
  {
    path: '/messenger/official/notice/merchant/sigin',
    element: lazyLoad(lazy(() => import('@/views/messenger/officialNotice/MerchantSigin'))),
    key: 'messenger_official_notice_sigin',
  },
  {
    path: '/messenger/relevance/account',
    element: lazyLoad(lazy(() => import('@/views/messenger/relevanceAccount'))),
    key: 'messenger_relevance_account',
  },
]

export default MessengerRouter
