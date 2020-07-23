//封装axios请求
import axios from 'axios' //引入axios
import QS from 'qs' //引入qs模块，用于序列化数据

/*
环境切换
if (process.env.NODE_ENV == 'development') {    
    axios.defaults.baseURL = 'https://www.baidu.com';} 
else if (process.env.NODE_ENV == 'debug') {    
    axios.defaults.baseURL = 'https://www.ceshi.com';
} 
else if (process.env.NODE_ENV == 'production') {    
    axios.defaults.baseURL = 'https://www.production.com';
}*/
const $axios = axios.create({
  // 设置超时时间
  timeout: 5000,
  // 基础url，会在请求url中自动添加前置链接
  //baseURL: 'https://www.fastmock.site/mock/8d1fba3d73489e1c38feff913a232bdc/admin'
  // baseURL: 'http://47.99.78.196:8083/api'
  baseURL:'http://localhost:52950/api'
})

//请求头设置
$axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

//添加一个请求拦截器
$axios.interceptors.request.use(
  function(config) {
    let token = window.sessionStorage.getItem('token')
    if (token !== null) {
      config.headers['token'] = token
    }

    return config
  },
  function(error) {
    // Do something with request error
    console.info('error: ')
    console.info(error)
    return Promise.reject(error)
  }
)

//封装get/post方法
export function get(url, params) {
  //url是请求地址  params是请求参数
  return new Promise((resolve, reject) => {
    $axios
      .get(url, {
        params
      })
      .then(response => {
        resolve(response.data) //这里的resolve是在调用时定义的
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
/*
    {String} url 请求地址
    {Object}params请求参数
*/
export function post(url, params) {
  //url是请求地址  params是请求参数
  return new Promise((resolve, reject) => {
    $axios
      .post(url, params)
      .then(response => {
        resolve(response) //这里的resolve是在调用时定义的
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
