import axios from './axios'

const params = [
  { name: 'getWallparper', url: 'https://unsplash.it/1920/1080?random', method: 'get' }
]

const api = {}

params.forEach(ele => {
  api[ele.name] = (data) => {
    return ele.method === 'get' ? axios.get(ele.url, { params: data }) : axios.post(ele.url, data)
  }
})

export default api