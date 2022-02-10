<template>
    <div class="home">
        <el-button @click="handleLogout">退出登录</el-button>
    </div>
</template>    
<script>
    

    export default {
        methods: {
            // 退出登录
            async handleLogout () {
                
                // 退出登录清空权限菜单，清空token
                this.$store.dispatch('userLogout')
            }
        }
    }
</script>