// 先把路由和vuex引进来使用
import router from '../router'
import store from '../store'

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  if (store.getters.token) {
    // 判断如果是去登陆页面的话，返回主页，不让他返回登录页
    if (to.path === '/login') {
      next({ path: '/home' })
    } else {
      // 否则判断一下用户的个人信息是否已经拉取完毕
      if (store.getters.roles.length === 0) {
        // 拉取用户个人信息
        store.dispatch('getUserInfo').then(data => {
          // 拿到用户后台返回的权限数据
          const roles = data
          // 调用 permission.js方法中的GenerateRoutes方法，将后台返回的用户的权限数据，传递回去进行筛选处理
          store.dispatch('GenerateRoutes', roles).then(() => { // 生成可访问的路由表
            // 将筛选的权限路由数组动态挂载
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes添加完成
          })
        }).catch(error => {
          // 验证失败重新登陆
          next({ path: '/login' })
        })
      } else {
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的页面会自动进入404页面
      }
    }
  } else {
    // 如果已经去了登陆页面了，就不需要再next到登陆页面了，这就是重定向白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})