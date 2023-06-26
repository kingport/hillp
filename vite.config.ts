import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import vitePluginImp from 'vite-plugin-imp'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      react(),
      svgr(),
      AutoImport({
        imports: ['react', 'react-router-dom'],
        dts: './src/auto-imports.d.ts',
        dirs: ['src/store'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        },
      }),
      WindiCSS(),
      createSvgIconsPlugin({
        iconDirs: [path.join(__dirname, 'src/assets/icons')],
      }),
      vitePluginImp({
        libList: [
          { libName: 'antd-mobile', libDirectory: 'es/components', style: () => false },
          {
            libName: 'antd',
            libDirectory: 'es',
            style: (name) => {
              if (name !== 'time-picker') {
                return `antd/es/${name}/style`
              }
            },
          },
        ],
      }),
    ],
    //项目部署的基础路径,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode: mode,
    resolve: {
      //别名
      alias: [
        { find: '@', replacement: resolve(__dirname, './src') },
        {
          find: '@components',
          replacement: resolve(__dirname, './src/components'),
        },
        { find: '@store', replacement: resolve(__dirname, './src/store') },
        { find: '@views', replacement: resolve(__dirname, './src/views') },
        { find: '@assets', replacement: resolve(__dirname, './src/assets') },
        { find: '@hooks', replacement: resolve(__dirname, './src/hooks') },
      ],
    },
    //服务
    server: {
      proxy: {
        '/api': {
          target: 'https://test-apiv1.clsdevops.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
      host: '0.0.0.0',
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        sass: {
          javascriptEnabled: true,
        },
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
    //构建
    build: {
      // outDir: `dist_${format(new Date(), 'yyyyMMdd_HHmm')}`, //输出路径  新增打日期包
      //构建后是否生成 source map 文件
      sourcemap: mode != 'production',
      // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('antd-mobile') && id.endsWith('.css')) {
              return 'antd-mobile'
            }
            if (id.includes('windicss') && id.endsWith('.css')) {
              return 'windicss'
            }
          },
        },
      },
    },
  })
}
