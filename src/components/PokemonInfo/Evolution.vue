<template>
  <div class="evolution-container">
    <div class="evo-level-container" v-for="(chain, index) in evoChain" :key='index' >
      <ul class="pokemons-list">
        <li v-for="pokemon in chain" :key="pokemon.name" class="pokemon-plate">
          <router-link :to="`/pokemon/${pokemon.name}`" @click="$emit('navigate', pokemon.id)">
            <div class="sprite-container" v-if="pokemon.sprites.front_default">
              <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
            </div>
            <div class="name">
              {{ pokemon.name.trim() }}
            </div>
          </router-link>
        </li>
      </ul>
      <div class="separator">
        <font-awesome-icon :icon="['fas', 'angle-down']"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from '@/helpers/api'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleDown)

export default {
  name: 'PokemonEvolution',
  props: {
    species: {
      required: true,
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    evoChain: []
  }),

  methods: {
    async getEvolutionChain() {
      const species = await (await fetch(this.species.url)).json()
      const evolution = await (await fetch(species.evolution_chain.url)).json()
      const result = []

      result.push([ evolution.chain.species.name ]);

      (function getEvoChains(evo, lev) {
        if (!evo.evolves_to.length) return

        result[lev] = [
          ...evo.evolves_to.map(elem => elem.species.name)
        ]

        evo.evolves_to.forEach(elem => {
          getEvoChains(elem, lev + 1)
        })
      })(evolution.chain, 1)

      return result
    },

    async getPokemonsInfo() {
      const pokemonsEvoChain = await this.getEvolutionChain()
      const result = []

      pokemonsEvoChain.forEach((chain, i) => {
        result.push([])

        chain.forEach(async name => {
          result[i].push(await getData('pokemon', name))
        })
      })

      return result
    },

    async updatePokemonInfo() {
      this.evoChain = await this.getPokemonsInfo()
    }
  },

  async mounted() {
    this.updatePokemonInfo()
  },

  watch: {
    async species() {
      this.updatePokemonInfo()
    }
  }
}
</script>

<style scoped lang="sass">
  .pokemons-list
    display: flex
    justify-content: center
    list-style-type: none
    flex-wrap: wrap
    margin: 0
    padding: 0

    li
      a
        display: block
        text-align: center

      .name::first-letter
        text-transform: uppercase

  .evo-level-container:last-child > .separator
    display: none

  .pokemon-plate
    padding: 5px

  .separator
    display: flex
    justify-content: center
</style>
