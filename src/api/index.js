import axios from './axios'
const HOST = import.meta.env.MODE === 'development' ? '' : 'https://yigeshuqian.cl8023.com'

const params = [
  { name: 'getWallparper', url: 'https://unsplash.it/1920/1080?random', method: 'get', host: 'self' },
  // { name: 'getTitle', url: 'https://tenapi.cn/title/', method: 'get', host: 'self' },

  { name: 'getTitle', url: '/api/bookmark/getTitle/', method: 'post' },
  { name: 'importBookmark', url: '/api/bookmark/importBookmark/', method: 'post' },
  { name: 'modifyBookmark', url: '/api/bookmark/modifyBookmark/', method: 'post' },
  { name: 'moveBookmark', url: '/api/bookmark/moveBookmark/', method: 'post' },
  { name: 'removeBookmark', url: '/api/bookmark/removeBookmark/', method: 'post' },
  { name: 'sortBookmark', url: '/api/bookmark/sortBookmark/', method: 'post' },
  { name: 'getBookmark', url: '/api/bookmark/getBookmark/', method: 'post' },
  { name: 'addNewNode', url: '/api/bookmark/addNewNode/', method: 'post' },
  { name: 'getWebsiteTitleAndIcon', url: '/api/bookmark/getWebsiteTitleAndIcon/', method: 'post' },

  { name: 'sendCode', url: '/api/user/sendCode/', method: 'post' },
  { name: 'login', url: '/api/user/login/', method: 'post' },
  { name: 'register', url: '/api/user/register/', method: 'post' },
  { name: 'getUserInfo', url: '/api/user/getUserInfo/', method: 'post' },
  { name: 'getUserConfig', url: '/api/user/getUserConfig/', method: 'post' },
  { name: 'setUserConfig', url: '/api/user/setUserConfig/', method: 'post' },

  
  { name: 'webIconTask', url: '/api/task/webIconTask/', method: 'post' },
]

const api = {}

params.forEach((ele) => {
  api[ele.name] = (data) => {
    const url = ele.host === 'self' ? ele.url : `${HOST}${ele.url}`
    return ele.method === 'get' ? axios.get(url, { params: data }) : axios.post(url, data)
  }
})

export default api
