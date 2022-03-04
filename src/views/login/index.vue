<template>
    <div class="login">

        <!-- utils/debounce 防抖 -->
         <Debounce :time='200' >
            <el-button @click.native="handleUserLogin">登录</el-button>
        </Debounce>

        <!-- 自定义防抖 -->
        <!-- <el-button @click="handleUserLoginDebounce">登录</el-button> -->
    </div>
</template>    
<script>
    import { debounce } from '@/utils/tool'

    export default {
        mounted () {
        },
        methods: {
            // 用户登录
            handleUserLogin () {
                // 请求登录
                this.$store.dispatch('userLogin', {
                    password: "123456", 
                    username: "13556157417"
                }).then(res => {
                    // 登陆成功跳转主页
                    this.$router.push('/home')
                }).catch(error => {})
            },
            // 登录防抖
            handleUserLoginDebounce: debounce("handleUserLogin", 200)
        }
    }
</script>