<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="sass">

  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap')
  @import url('https://fonts.googleapis.com/css?family=Krona+One&display=swap')

  html, body
    margin: 0
    padding: 0
    font-family: Roboto //'Krona One', sans-serif
    color: white

  a
    text-decoration: none
    color: black
  
  body
    background-color: #222

  .fade-enter-active, .fade-leave-active
    overflow: hidden
    transition: opacity 0.25s

  .fade-enter, .fade-leave-to
    opacity: 0

</style>
