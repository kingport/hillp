import React from 'react'
import { RouteObject } from '@/routers/interface'
import lazyLoad from '../utils/lazyLoad'
import LayoutIndex from '@/layouts'

const UserRouter: Array<RouteObject> = [
  {
    path: '/user',
    element: lazyLoad(lazy(() => import('@/views/user'))),
    key: 'user',
  },
  {
    path: '/user/register',
    element: lazyLoad(lazy(() => import('@/views/user/register'))),
    key: 'user_register',
  },
  {
    path: '/user/register/email',
    element: lazyLoad(lazy(() => import('@/views/user/register/CheckEmail'))),
    key: 'user_register_email',
  },
  {
    path: '/user/register/account',
    element: lazyLoad(lazy(() => import('@/views/user/register/CreateAccount'))),
    key: 'user_register_account',
  },
  {
    path: '/user/login',
    element: lazyLoad(lazy(() => import('@/views/user/login'))),
    key: 'user_login',
  },
  {
    path: '/user/register/success',
    element: lazyLoad(lazy(() => import('@/views/user/register/Success'))),
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/user/verify',
        element: lazyLoad(lazy(() => import('@/views/user/verify'))),
      },
    ],
  },

  {
    path: '/user/verify/phone',
    element: lazyLoad(lazy(() => import('@/views/user/verify/VerifyPhone'))),
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/user/verify/email',
        element: lazyLoad(lazy(() => import('@/views/user/verify/VerifyEmail'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/user/verify/sms',
        element: lazyLoad(lazy(() => import('@/views/user/verify/VerifySms'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/user/change/pwd',
        element: lazyLoad(lazy(() => import('@/views/user/verify/ChangePwd'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/user/change/old/pwd',
        element: lazyLoad(lazy(() => import('@/views/user/verify/ChangeOldPwd'))),
      },
    ],
  },
  {
    element: <LayoutIndex />,
    children: [
      {
        path: '/user/change/pwd/success',
        element: lazyLoad(lazy(() => import('@/views/user/verify/ChangeSuccess'))),
      },
    ],
  },
]

export default UserRouter
