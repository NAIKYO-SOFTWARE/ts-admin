import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import react from '@vitejs/plugin-react-swc'

import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import { dependencies } from './package.json'

const require = createRequire(import.meta.url)

const vendorsReact = ['react', 'react-router-dom', 'react-dom', 'react-is']
const vendorsUtil = [
  'js-cookie',
  'zustand',
  'immer',
  '@legendapp/state',
  'debounce',
  'rc-menu',
  'rc-picker',
  'dayjs',
  'classnames'
]
const antNotification = ['antd/es/notification']
const antSelect = ['antd/es/select']
const antPagination = ['antd/es/pagination']

const getPlugins = () => {
  const plugins = [react(), ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })]

  return plugins
}

const renderChunks = () => {
  let chunks = {}
  Object.keys(dependencies).forEach((key) => {
    if (vendorsReact.includes(key)) return
    else if (vendorsUtil.includes(key)) return
    else if (antNotification.includes(key)) return
    else if (antSelect.includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: getPlugins(),
  build: process.env.NODE_ENV === 'production' && {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': vendorsReact,
          'vendor-util': vendorsUtil,
          'antd-notification': antNotification,
          'antd-select': antSelect,
          'antd-pagination': antPagination
          // ...renderChunks()
        }
      }
    }
  },
  define: process.env.NODE_ENV === 'development' && {
    global: {}
  }
})
