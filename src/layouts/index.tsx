import React from 'react'
import { Outlet } from 'react-router-dom'
import LayoutMenu from './menu'
import LayoutHeader from './header'

const LayoutIndex = (props: any) => {
  return (
    <div className="flex flex-col">
      <div className="hidden sm:(flex fixed top-0 z-10 w-full bg-[#fff])">
        <LayoutHeader></LayoutHeader>
      </div>
      <div className="flex">
        <div className="hidden sm:(flex fixed left-0 z-9 top-60px)">
          <LayoutMenu></LayoutMenu>
        </div>
        <div className="sm:(flex flex-1 justify-center h-[92vh] pl-60px pt-60px) w-full">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

export default LayoutIndex
