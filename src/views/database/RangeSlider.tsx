import * as React from 'react'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'
import { Slider } from 'antd-mobile'

export default function RangeSlider(props: any) {
  const { price_min, price_max, setParams } = props

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        ticks
        range
        step={1}
        onChange={(value: any) => {
          setParams({
            price_min: value[0],
            price_max: value[1],
          })
        }}
        min={price_min}
        max={price_max}
        defaultValue={[price_min, price_max]}
      />
      <div className="flex justify-between items-center text-xs pt-1">
        <p>${price_min}</p>
        <p>${price_max}</p>
      </div>
    </Box>
  )
}
