<template>
  <div id="main">
    <Header/>
    <slot/>
  </div> 
</template>

<script>
import Header from '@/components/Header/Header.vue'

export default {
  name: 'MainLayout',
  components: {
    Header
  }
}
</script>

<style scoped lang="sass">

</style>
