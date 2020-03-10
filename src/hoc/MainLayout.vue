<template>
  <div id="main">
    <Header/>
    <div id="main-container">
      <slot/>
    </div>
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
  #main-container
    display: flex
    justify-content: center
    overflow: hidden
</style>
