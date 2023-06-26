import * as React from 'react'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'
import { Slider } from 'antd-mobile'

export default function RangeSlider(props: any) {
  const { price_min, price_max, min, max, setParams } = props

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        range
        step={1}
        value={[price_min * 1, price_max * 1]}
        min={min}
        max={max}
        defaultValue={[min, max]}
        onAfterChange={(value: any) => {
          setParams({
            price_min: value[0],
            price_max: value[1],
          })
        }}
      />
      <div className="flex justify-between items-center text-xs pt-1">
        <p>${min}</p>
        <p>${max}</p>
      </div>
    </Box>
  )
}
