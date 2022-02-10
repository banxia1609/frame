
import VueRouter from 'vue-router'

// 路由基础表
export const routes = [
    // 起始页
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index/')
    },
    // 首页
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/')
    },
    // 登录页
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/')
    },
    {
        path: '/error',
        component: () => import('../views/404/'),
        name: 404
    },
    {
        path: "*", // 此处需特别注意置于最底部
        redirect: "/error"
    }
]

// 路由动态菜单 （需权限调控）
export const asyncRouteMap = [
    // 报表页
    {
        path: '/report',
        name: 'report',
        component: () => import('@/views/report/')
    },
    // 报表页
    {
        path: '/report2',
        name: 'report2',
        component: () => import('@/views/report2/')
    },
]


// 因为可以动态的挂载路由，但是不能动态删除路由。所以才考略到，
// 在需要动态清空动态挂载路由的话，直接将一个新的路由对象赋值给旧的路由对象，这样就可以达到动态清除的工作
const createRouter = () => new VueRouter({routes})
  
  
const router = createRouter()
  
// 调用该方法动态清除动态挂载路由
export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}
  
 export default router