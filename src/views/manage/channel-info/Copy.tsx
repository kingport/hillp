import SvgIcon from '@/components/SvgIcon'
import { h5Copy } from '@/utils/util'
import { Button, Popup } from 'antd-mobile'
import React from 'react'

interface ICopyUrlProps {
  visibleShare: boolean
  setVisibleShare: (val: boolean) => void
  id: string
}

export default function Copyurl(props: ICopyUrlProps) {
  const { visibleShare, setVisibleShare, id } = props
  return (
    <Popup
      visible={visibleShare}
      onClose={() => setVisibleShare(false)}
      showCloseButton
      bodyStyle={{ height: 'auto', borderRadius: '20px 20px 0 0' }}
    >
      <div className="py-12 px-10">
        <div
          onClick={() => {
            h5Copy(`${window.location.origin}/share?type=${2}&id=${id}`)
            setVisibleShare(false)
          }}
          className="flex rounded-lg py-1 bg-gradient-to-r from-[#3a5050]  to-[#768586] justify-center items-center text-color-[#fff]"
        >
          <SvgIcon name="copy" className="w-[16px] h-[16px]" />
          <Button className="text-color-[#fff]" fill="none">
            复制链接
          </Button>
        </div>
      </div>
    </Popup>
  )
}
