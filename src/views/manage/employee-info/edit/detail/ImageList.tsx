import * as React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import SvgIcon from '@/components/SvgIcon'
import styles from './index.module.scss'
import { Image } from 'antd-mobile'

export default function StandardImageList(props: any) {
  const { itemData, deleteImg } = props

  const vedioType = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm']

  const renderImageList = () => {
    return (
      <ImageList classes={{ root: styles.imgslist }} className="imageList sm:(w-300px)">
        {itemData?.map((item: any, index: any) => {
          const fileArr = item?.split('.') || []
          const fileType = fileArr.slice(-1)?.[0]
          if (vedioType?.includes(fileType)) {
            return (
              <div className="relative" key={index}>
                <video src={`${item}#t=0.5`} width="320" height="240" controls preload="metadata">
                  <source src={`${item}#t=0.5`} type={`video/${fileType}`}></source>
                </video>
                <SvgIcon
                  onClick={() => deleteImg(index)}
                  name="delete-img"
                  className="w-[25px] h-[25px] absolute -right-3 -top-3 z-10"
                />
              </div>
            )
          } else {
            return (
              <ImageListItem
                key={item}
                sx={{
                  overflowY: 'inherit',
                }}
              >
                <div className="relative">
                  <Image src={`${item}`} className="rounded-lg mb-2" />
                  <SvgIcon
                    onClick={() => deleteImg(index)}
                    name="delete-img"
                    className="w-[25px] h-[25px] absolute -right-3 -top-3 z-10"
                  />
                </div>
              </ImageListItem>
            )
          }
        })}
      </ImageList>
    )
  }

  return <>{renderImageList()}</>
}
