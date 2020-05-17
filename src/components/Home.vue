<template>
  <div>
    home
    <h2>{{count}}</h2>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
</script>

<style scoped>

</style>
