<template>
  <div id="content" v-if="isLoaded">
    <vue-headful :title="getTitle" />
    <header>
      <h1 class="pokemon-name">
        {{ pokemon.name }}
      </h1>
    </header>
    <div class="pokemon-content">
      <div class="stats">
        <pokemon-stats
          :stats="pokemonStats"
          :maxValue="255"
        />
      </div>
    </div>
  </div>  
</template>

<script>
import { getData } from '@/helpers/api'
import PokemonStats from '@/components/PokemonStats/PokemonStats.vue'

export default {
  name: 'PokemonPage',
  components: {
    PokemonStats
  },

  data() {
    return {
      pokemon: {},
      isLoaded: false,
    }
  },

  computed: {
    pokemonStats() {
      const stats = {}

      this.pokemon.stats.forEach(statItem => {
        stats[statItem.stat.name] = statItem.base_stat
      })

      return stats
    },
    getTitle() {
      const charArray = this.pokemon.name.split('').splice(1)

      return this.pokemon.name[0].toUpperCase() + charArray.join('')
    }
  },

  async mounted() {
    const data = await getData('pokemon', this.$route.params.id.toLowerCase())

    if (data) {
      this.pokemon = data
      this.isLoaded = true
    }
  }
}
</script>

<style scoped lang="sass">
  #content
    background-color: white
    color: black
    padding: 20px

    h1::first-letter
      text-transform: uppercase

    .pokemon-name::first-letter
      text-transform: uppercases

    
</style>
