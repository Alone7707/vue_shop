<template>
  <div class="home">
    home组件
    <div>
      <el-button type="info" @click="logout">退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 通过Promise延迟一秒跳转回登陆页面
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>