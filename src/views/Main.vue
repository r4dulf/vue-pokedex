<template>
  <div>
    <Header/>
    <div id="content">
      <pokemon-card-list :list="pokemons.results"/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Header.vue'
import PokemonCardList from '@/components/PokemonCardList/PokemonCardList.vue'
import { getData } from '@/helpers/api'

export default {
  name: 'Main',
  components: {
    Header,
    PokemonCardList
  },
  
  data: () => ({
    pokemons: {}
  }),

  async mounted() {
    const data = await getData()

    if (data) {
      this.pokemons = data
    }
  },
}
</script>

<style scoped lang="sass">

  div#content
    padding: 20px

</style>
