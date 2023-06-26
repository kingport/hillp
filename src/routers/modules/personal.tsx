import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const PersonalRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal',
        element: lazyLoad(lazy(() => import('@/views/personal'))),
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/help',
        element: lazyLoad(lazy(() => import('@/views/personal/help'))),
        key: 'personal_help',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/auth',
        element: lazyLoad(lazy(() => import('@/views/personal/auth'))),
        key: 'personal_auth',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/information',
        element: lazyLoad(lazy(() => import('@/views/personal/information'))),
        key: 'personal_information',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/information/merchant/edit',
        element: lazyLoad(lazy(() => import('@/views/personal/information/Merchant'))),
        key: 'personal_information_merchant',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/wallet',
        element: lazyLoad(lazy(() => import('@/views/personal/wallet'))),
        key: 'personal_wallet',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/auth/online',
        element: lazyLoad(lazy(() => import('@/views/personal/auth/promote-online'))),
        key: 'personal_auth_online',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/auth/sign',
        element: lazyLoad(lazy(() => import('@/views/personal/auth/promote-sign'))),
        key: 'personal_auth_sign',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/auth/association',
        element: lazyLoad(lazy(() => import('@/views/personal/auth/association'))),
        key: 'personal_auth_association',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/auth/association/confirm',
        element: lazyLoad(lazy(() => import('@/views/personal/auth/association/Confirm'))),
        key: 'personal_auth_association_confirm',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/setting',
        element: lazyLoad(lazy(() => import('@/views/personal/setting'))),
        key: 'personal_setting',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/setting/info',
        element: lazyLoad(lazy(() => import('@/views/personal/setting/Info'))),
        key: 'personal_setting_info',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/setting/notice',
        element: lazyLoad(lazy(() => import('@/views/personal/setting/Notice'))),
        key: 'personal_setting_notice',
      },
    ],
  },

  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/security',
        element: lazyLoad(lazy(() => import('@/views/personal/security'))),
        key: 'personal_security',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/security/cancellation',
        element: lazyLoad(lazy(() => import('@/views/personal/security/CancellationApply'))),
        key: 'personal_security_cancellation',
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/personal/auth/promote/online/edit',
        element: lazyLoad(lazy(() => import('@/views/personal/auth/promote-online/EditMerchant'))),
        key: 'personal_auth_promote_online_edit',
      },
    ],
  },
]

export default PersonalRouter
