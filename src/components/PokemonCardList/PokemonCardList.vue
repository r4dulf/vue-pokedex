<template>
  <ul class="pokemon-card-list">
    <li class="list-item" v-for="item in list" :key="item.name">
      <pokemon-card-item :initData="item"/>
    </li>
  </ul>
</template>

<script>
import PokemonCardItem from './PokemonCardItem.vue'

export default {
  name: 'PokemonCardList',
  components: {
    PokemonCardItem
  },
  props: {
    list: Array
  }
}
</script>

<style scoped lang="sass">
  ul.pokemon-card-list
    list-style-type: none
    padding: 0
    margin: 0
    display: flex
    flex-wrap: wrap
    justify-content: space-around

    li.list-item
      padding: 20px
      background-color: white
      color: black
      border-radius: 15px
      width: 350px
      max-width: 350px
      min-width: 250px
      margin: 10px
</style>
