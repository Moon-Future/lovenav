import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 定义 webpack 不打包资源列表
const externals = {
  vue: 'Vue',
  vuex: 'Vuex',
  axios: 'axios',
  'vue-router': 'VueRouter',
}

// https://vitejs.dev/config/
export default defineConfig(async (command, mode) => {
  return {
    plugins: [vue()],
    resolve: {
      // 配置路径别名
      alias: {
        '@': '/src'
      },
      extensions: ['.js', '.vue']
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5555/api',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
      },
    },
  }
})
