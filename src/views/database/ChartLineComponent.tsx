import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GridComponent } from 'echarts/components'
// import * as echarts from 'echarts/core'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import React from 'react'
import { keys, mapKeys, map, mapValues } from 'lodash'
import { useUpdateEffect } from 'ahooks'
import * as echarts from 'echarts'

const ChartLineComponent = (props: any) => {
  const { width = '100%', height = 120, data = [], keyrender = 'h5', selecttype } = props

  const renderChart = () => {
    // 日期
    const xData = keys(data?.amount_data)
    // 订单量
    const yorderData = selecttype === 3 ? [] : map(Object.keys(data?.order_data), (val) => data?.order_data[val])
    // 金额
    const yamountData = selecttype === 2 ? [] : map(Object.keys(data?.amount_data), (val) => data?.amount_data[val])

    const chartDom: any = document.getElementById(keyrender)
    const myChart = echarts.init(chartDom, { renderer: 'svg' })
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 0,
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          textStyle: { color: '#5d636f', fontSize: 12, lineHeight: 34 },
        },
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          position: 'left',
          type: 'value',
          scale: true,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLabel: {
            //y轴文字的配置
            textStyle: {
              color: '#5d636f',
            },
            formatter: '${value}', //y轴的每一个刻度值后面加上‘%’号
          },
        },
        {
          type: 'value',
          position: 'right',
          scale: true,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          // max: 'dataMax',
          interval: 500,
          // splitNumber: 5,
          axisLabel: {
            //y轴文字的配置
            textStyle: {
              color: '#5d636f',
            },
            formatter: '{value}单', //y轴的每一个刻度值后面加上‘%’号
          },
        },
      ],
      series: [
        {
          symbol: 'none',
          data: yamountData,
          type: 'line',
          color: '#d29175',
        },
        {
          symbol: 'none',
          data: yorderData,
          type: 'line',
          color: '#627273',
          yAxisIndex: 1,
        },
      ],
    }

    option && myChart.setOption(option)
  }

  useEffect(() => {
    renderChart()
  }, [data, keyrender])

  useUpdateEffect(() => {
    renderChart()
  }, [selecttype])

  return <div id={`${keyrender}`} style={{ width: width, height: height, margin: '0 auto' }} {...props}></div>
}

export default ChartLineComponent
