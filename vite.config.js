import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

// 定义 webpack 不打包资源列表
// const externals = {
//   vue: 'Vue',
//   vuex: 'Vuex',
//   axios: 'axios',
//   'vue-router': 'VueRouter',
// }

console.log(importToCDN)

// https://vitejs.dev/config/
export default defineConfig(async (command, mode) => {
  return {
    plugins: [
      vue(),
      importToCDN({
        modules: [
          {
            name: 'vue',
            var: 'Vue',
            path: 'https://unpkg.com/vue@3.2.45/dist/vue.global.js'
          },
          {
            name: 'vue-router',
            var: 'VueRouter',
            path: 'https://unpkg.com/vue-router@4.1.6/dist/vue-router.global.js'
          },
          {
            name: 'element-plus',
            var: 'ElementPlus',
            path: 'https://unpkg.com/element-plus@2.2.26/dist/index.full.js'
          },
          {
            name: 'axios',
            var: 'axios',
            path: 'https://unpkg.com/axios@1.2.1/dist/axios.min.js'
          },
          {
            name: 'vue-demi',
            var: 'VueDemi',
            path: 'https://unpkg.com/vue-demi@0.13.11/lib/index.iife.js'
          },
          {
              name: 'pinia',
              var: 'Pinia',
              path: 'https://unpkg.com/pinia@2.0.28/dist/pinia.iife.js'
          },
        ]
      })
    ],
    resolve: {
      // 配置路径别名
      alias: {
        '@': '/src'
      },
      extensions: ['.js', '.vue'],
    },
    server: {
      // host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8885/api',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
      },
    },
  }
})
