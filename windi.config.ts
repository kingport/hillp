import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    boxShadow: {
      sm: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      '2xl': '1.5625rem',
    },
    animation: {
      pulse: 'pulse 0.8s linear 1',
    },
  },
  shortcuts: {
    // 底部固定按钮
    'fixed-b-btn': 'w-full fixed bg-[#fff] shadow-sm bottom-0 left-0 h-[90px] z-99 flex items-center justify-center',
    'absoult-b-btn':
      'w-full absoult bg-[#fff] shadow-sm bottom-0 left-0 h-[90px] z-99 flex items-center justify-center',
    // 1px solid
    'border-b': 'h-[0.5px] w-full bg-[#bdbdbd]',
    w18: 'w-[1.125rem]',
    w20: 'w-[1.25rem]',
    w24: 'w-[1.5rem]',
    w28: 'w-[1.75rem]',
    w30: 'w-[1.875rem]',
    h18: 'h-[1.125rem]',
    h20: 'h-[1.25rem]',
    h24: 'h-[1.5rem]',
    h28: 'h-[1.75rem]',
    h30: 'h-[1.875rem]',
    // order table
    'order-table': 'w-25 !border-l-0 !border-r-0 px-2 py-2 border-width-[0.5px] border-color-[#e9e9e9] border-solid',
  },
})
