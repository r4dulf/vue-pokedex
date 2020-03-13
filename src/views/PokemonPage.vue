<template>
  <main-layout>
    <div id="content" v-if="isLoaded">
      <vue-headful :title="title" />

      <div class="pokemon-header">
        <div class="pokemon-title">
          <h1 class="pokemon-name">{{ pokemon.name }}</h1>
          <div class="add-to-favorite button">
            <font-awesome-icon :icon="['far', 'star']" size="2x"/>
          </div>
        </div>
        <div class="buttons-list" v-if="+id">
          <router-link class="button" v-if="id > 1" :to="`/pokemon/${id - 1}`">
            <font-awesome-icon :icon="['far', 'caret-square-left']" size="2x"/>
          </router-link>
         <router-link class="button" v-if="id < 999" :to="`/pokemon/${id + 1}`">
            <font-awesome-icon :icon="['far', 'caret-square-right']" size="2x"/>
          </router-link>
        </div>
      </div>

      <div class="pokemon-info">

        <div class="first-column">
          <div class="sprites">
            <h2 class="sprites-title">Sprites</h2>
            <sprites-container :sprites="pokemon.sprites" class="wrap-elements" />
          </div>

          <div class="types">
            <div class="types-title">
              <h2>Types</h2>
              <div class="types-container">
                <pokemon-type v-for="{ type } in pokemon.types" :key="type.name" :type="type" />
              </div>
            </div>
          </div>

          <div class="characteristics">
            <div class="characteristics-title">
              <h2>Characteristics</h2>
            </div>
            <characteristics :characteristics="characteristics"/>
          </div>

          <div class="evolution">
            <div class="evolution-title">
              <h2>Evolution</h2>
            </div>
            <evolution :species="pokemon.species"/>
          </div>

          <div class="damage-info">
            <div class="damage-info-title">
              <h2>Damage info</h2>
            </div>
            <pokemon-damage-table :damageInfo="damageInfo"/>
          </div>
        </div>
        <div class="second-column">

          <div class="stats">
            <div class="stats-title">
              <h2>Stats</h2>
            </div>
            <div class="stats-container">
              <pokemon-stats :stats="pokemonStats" :maxValue="255" :fullWidth="true" />
            </div>
          </div>
          <div class="moves">
            <div class="moves-title">
              <h2>Moves</h2>
            </div>
            <pokemon-moves-list :moves="pokemon.moves"/>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script>
import PokemonType from '@/components/PokemonInfo/Type.vue'
import PokemonMovesList from '@/components/PokemonInfo/MovesList.vue'
import PokemonDamageTable from '@/components/PokemonInfo/DamageTable.vue'
import PokemonStats from '@/components/PokemonInfo/Stats.vue'
import Characteristics from '@/components/PokemonInfo/Characteristics.vue'
import Evolution from '@/components/PokemonInfo/Evolution.vue'

import SpritesContainer from '@/components/SpritesContainer/SpritesContainer.vue'
import MainLayout from '@/hoc/MainLayout.vue'
import { getData } from '@/helpers/api'

import { faCaretSquareRight, faCaretSquareLeft, faStar } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faCaretSquareLeft, faCaretSquareRight, faStar)

export default {
  name: 'PokemonPage',
  components: {
    PokemonStats,
    PokemonDamageTable,
    MainLayout,
    Evolution,
    PokemonType,
    PokemonMovesList,
    Characteristics,
    SpritesContainer
  },

  data() {
    return {
      pokemon: {},
      isLoaded: false,
      damageInfo: {},
      id: 0
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

    title() {
      return this.pokemon.name[0].toUpperCase() + this.pokemon.name.split('').splice(1).join('')
    },

    characteristics() {
      const { height, base_experience, weight } = this.pokemon

      return {
        height: `${height / 10} m`,
        weight: `${weight / 10} kg`,
        base_experience
      }
    }
  },

  methods: {
    async updateDamageInfo() {
      const { types } = this.pokemon
      const values = await Promise.all(types.map(
        async item => (await (await fetch(item.type.url)).json()).damage_relations
      ))
      
      const damageInfo = values.reduce((prev, curr) => {
        Object.keys(prev).forEach(key => {
          const names = prev[key].map(item => item.name)
          const array = curr[key].filter(item => !names.includes(item.name))

          prev[key].push(...array)
        })

        return prev
      })

      this.damageInfo = damageInfo
    }
  },

  async mounted() {
    const data = await getData('pokemon', this.$route.params.id.toLowerCase())

    if (data) {
      this.pokemon = data
      this.isLoaded = true
      this.id = this.pokemon.id
      this.updateDamageInfo()
    }
  },

  beforeRouteUpdate(to, from, next) {
    this.id = +to.params.id
    
    next()
  },

  watch: {
    async id() {
      const data = await getData('pokemon', this.id)

      if (data) {
        this.pokemon = data
        this.updateDamageInfo()
      }
    }
  }
}
</script>

<style scoped lang="sass">
  #content
    background-color: white
    color: black
    padding: 20px

    .buttons-list
      display: flex
      justify-content: center
      align-items: center

    .button
      margin: 5px
      cursor: pointer

    .pokemon-header
      display: flex
      align-items: center
      justify-content: space-between

      .pokemon-title
        display: flex
        align-items: center

      h1::first-letter
        text-transform: uppercase

      .pokemon-name::first-letter
        text-transform: uppercase

    .pokemon-info
      display: grid
      grid-template-columns: repeat(2, minmax(min-content, 450px))
      gap: 20px

      .types
        .types-title
          display: flex
          align-items: center
          justify-content: space-between

        .types-container
          display: flex
          justify-content: flex-end

  @media screen and (max-width: 954px)
    #content
      .pokemon-info
        grid-template-columns: 1fr
</style>
