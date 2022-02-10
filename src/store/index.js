import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import { resetRouter } from '../router/router' 
import router from '../router/'

import { userInfo } from '@/api/login'

// 引入权限模块
import permission from './permission'

export default new Vuex.Store({
    //所有的数据都放在state中
    state: {
        roles: [],
        token: localStorage.getItem('token') || ''
    },

    //操作数据，唯一的通道是mutations
    mutations: {
        // 将获取到的token存储到本地
        SET_TOKEN (state, token) {
            state.token = token
            localStorage.setItem('token', state.token)
        },
        // 将获取到的roles粗出到本地
        SET_ROLES (state, roles) {
            state.roles = roles
            localStorage.setItem('roles', JSON.stringify(state.roles))
        }
    },

    // 可以来做异步操作，然后提交给mutations，而后再对state(数据)进行操作
    actions: {
        // 用户登录
        userLogin ({ commit }, data) {

            // 返回一个异步回调，promise
            return new Promise(async (resolve, reject) => {
                // 调用登录接口 
                let res = await userInfo({password: data.password, username: data.username})
                // 如果登录成功
                if (res.status === 200) {
                    // 调用mutations中的方法，将token存储到本地中
                    commit('SET_TOKEN', res.data.token)
                    resolve(res.data)
                } else {
                    reject(res.message)
                }
                
            })
        },
        // 根据用户的token获取用户的个人信息，里面包含了权限信息
        getUserInfo ({ state, commit }) {
            // 返回一个异步回调，promise
          return new Promise((resolve, reject) => {
            // 获取有无缓存权限菜单
            let roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : []
            // 如果已有权限菜单则不必再去请求接口
            if (roles.length > 0) {
                commit('SET_ROLES', roles)
            // 调用用户权限接口方法获取数据 (看自己项目，有的在登录接口则返回，有的在用户信息接口)
            // 将获取到的信息放到数组中存储 (这里自定义)
            } else {
                let data = ['report']
                commit('SET_ROLES', data)
            }
            resolve(state.roles)
          })
        },
        // 退出登录
        userLogout ({ commit }) {
            // 清空权限菜单
            commit('SET_ROLES', [])
            // 清空token
            commit('SET_TOKEN', '')
            // 清除路由
            resetRouter()
            // 跳转到登录菜单
            router.push({path: '/login'})
        }
    },
    // vuex的计算属性
    getters: {
        // 将用户数据放到计算属性中，一旦数据发生变化，可以重新计算
        roles (state) {
            return state.roles
        },
        token (state) {
            return state.token
        }
    },
    // 模块
    modules: {
        permission
    }
})