import axios from './axios'
import { PRODUCT_KEY } from '@/config/const'

// banner 图
export function getBannerList(placementKey) {
  return axios({
    url: '/futureclass/eshopServer/operation/website/client/banner/get',
    method: 'get',
    params: {
      productKey: PRODUCT_KEY,
      placementKey: placementKey,
    },
  })
}

// 省市区数据
export function getareaData() {
  return axios({
    url: '/futureclass/usersServer/common/areaTree',
    method: 'get',
    params: {},
  })
}

// 联系我们表单提交
export function saveContactForm(data) {
  return axios({
    url: '/futureclass/eshopServer/operation/website/client/contract/save',
    method: 'post',
    data: data
  })
}

// 下载应用列表
export function getAppList() {
  return axios({
    url: '/futureclass/eshopServer/operation/website/client/app/get',
    method: 'get',
    params: {}
  })
}
