//src/utils/request.js
import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, 
  timeout: 10000, // request timeout
})

// 接口请求拦截
service.interceptors.request.use(config => {
  // 让每个请求携带当前用户token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    //届时根据后端返回success或者code值判断
    if (res.success === true) {
      return res
    } else {
      return res
    }
  },
  (error) => {
    //响应错误
    return Promise.reject(error)
  }
)

export default service