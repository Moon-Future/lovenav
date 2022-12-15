import axios from './axios'
const HOST = import.meta.env.MODE === 'development' ? '' : 'https://wxproject.cl8023.com'

const params = [
  { name: 'getWallparper', url: 'https://unsplash.it/1920/1080?random', method: 'get', host: 'self' },

  { name: 'importBookmark', url: '/api/bookmark/importBookmark/', method: 'post' },
  { name: 'modifyBookmark', url: '/api/bookmark/modifyBookmark/', method: 'post' },
  { name: 'moveBookmark', url: '/api/bookmark/moveBookmark/', method: 'post' },
  { name: 'removeBookmark', url: '/api/bookmark/removeBookmark/', method: 'post' },
  { name: 'sortBookmark', url: '/api/bookmark/sortBookmark/', method: 'post' },
  { name: 'getBookmark', url: '/api/bookmark/getBookmark/', method: 'post' },
  { name: 'addBookmark', url: '/api/bookmark/addBookmark/', method: 'post' },
  { name: 'saveNewNode', url: '/api/bookmark/saveNewNode/', method: 'post' },
  { name: 'getWebsiteTitleAndIcon', url: '/api/bookmark/getWebsiteTitleAndIcon/', method: 'post' },
]

const api = {}

params.forEach((ele) => {
  api[ele.name] = (data) => {
    const url = data.host === 'self' ? data.url : `${HOST}${data.url}`
    return ele.method === 'get' ? axios.get(ele.url, { params: data }) : axios.post(ele.url, data)
  }
})

export default api
