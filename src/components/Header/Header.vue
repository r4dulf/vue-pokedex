
<template>
  <header>
    <router-link to="/">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Pokedex Logo" class="logo-img">
        <p class="logo-label">Pokedex</p>
      </div>
    </router-link>
  </header>
</template>

<script>
  export default {
    name: 'Header'
  }

</script>

<style lang="sass" scoped>
  header
    background-color: #333
    display: flex
    justify-content: space-between
    user-select: none
    padding: 5px

    .logo
      display: flex
      align-items: center
      cursor: pointer

      p.logo-label
        text-align: center
        padding: 0
        margin: 0

      img.logo-img
        height: 50px
        width: 50px

    a
      text-decoration: none
      color: white

@media screen and (max-width: 640px)
  header
    justify-content: center !important
</style>
