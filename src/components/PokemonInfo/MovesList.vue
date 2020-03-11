<template>
  <ul v-show="isLoaded">
    <li v-for="move in movesInfo" :key="move.name">
      <pokemon-move :move="move" />
    </li>
  </ul>
</template>

<script>
import PokemonMove from '@/components/PokemonInfo/Move.vue'

export default {
  name: 'PokemonMovesList',
  components: {
    PokemonMove
  },

  data: () => ({
    movesInfo: [],
    isLoaded: false
  }),

  props: {
    moves: Array
  },

  methods: {
    async getMovesInfo() {
      this.isLoaded = false

      const values = await Promise.all((this.moves || []).map(
        async item => (await (await fetch(item.move.url)).json())
      ))

      this.movesInfo = values
      this.isLoaded = true
    },
  },

  mounted() {
    this.getMovesInfo()
  },

  watch: {
    moves() {
      this.getMovesInfo()
    }
  }
}
</script>

<style scoped lang="sass">
  ul
    margin: 0
    padding: 0
    list-style-type: none

    li
      padding: 5px
      border: 1px solid black
      border-top: 0

      &:first-child
        border-top: 1px solid black
</style>
