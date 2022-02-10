<template>
    <div class="login">
        <el-button @click="handleUserLogin">登录</el-button>
    </div>
</template>    
<script>
    export default {
        mounted () {
            
        },
        methods: {
            // 用户登录
            handleUserLogin () {
                this.$store.dispatch('userLogin', {password: "123456", username: "13556157417"}).then(res => {
                    // 登陆成功跳转主页
                    this.$router.push('/home')
                }).catch(error => {})
            }
        }
    }
</script>