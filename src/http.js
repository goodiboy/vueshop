import axios from 'axios'
import { Loading } from 'element-ui'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

let loading = null

const startLoading = function () {
  loading = Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    fullscreen: false,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
const endLoading = function () {
  loading.close()
}

axios.interceptors.request.use(
  config => {
    // 开启loading
    startLoading()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    // 关闭loading
    endLoading()
    return response
  },
  error => {
    endLoading()
    return Promise.reject(error)
  }
)

export default axios
