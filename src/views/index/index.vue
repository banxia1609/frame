<template>
    <div class="index">
        <el-button @click="toHome">去首页</el-button>
    </div>
</template>    
<script>
    export default {
        methods: {
            toHome () {
                this.$router.push('/home')
            }
        }
    }
</script>