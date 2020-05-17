<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  created () {
    if (localStorage.getItem('token')) {
      this.$store.dispatch('setToken', localStorage.token)
    }
  }
}
</script>

<style>

</style>
