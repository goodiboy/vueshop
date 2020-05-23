import axios from 'axios'
import { Loading } from 'element-ui'
// import router from './router'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

let loading = null

const startLoading = function () {
  loading = Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    fullscreen: true,
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
    config.headers.Authorization = localStorage.getItem('token')
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
    // 根据错误码判断是否token过期
    // if (response.data.meta.status === 400) {
    //   Message.error('token过期，请重新登陆')
    //   localStorage.removeItem('token')
    //   router.push('login')
    // }
    return response
  },
  error => {
    endLoading()
    console.log('失败')
    return Promise.reject(error)
  }
)

export default axios
