<template>
  <div class="pokemon-card" v-if="pokemon">
    <div class="header-container">
      <div class="pokemon-name">
        <router-link :to="`pokemon/${pokemon.name}`">
          {{ pokemon.name }}
        </router-link>
      </div>
      <div class="menu">
        <span class="toggle-favorite menu-button" title="Add to/Remove from favorites">
          <font-awesome-icon :icon="['far', 'star']"/>
        </span>
        <span class="toggle-gender menu-button" title="Change gender" @click="selectedGender = !selectedGender">
          <font-awesome-icon :icon="['fa', 'venus-mars']"/>
        </span>
        <router-link :to="`pokemon/${pokemon.name}`" class="menu-button" title="More info">
          <font-awesome-icon :icon="['fa', 'info']"/>
        </router-link>
      </div>
    </div>
    <div class="sprite-content">
      <div class="sprites-container" ref="spriteBox">
        <img
          v-for="sprite in getSprites"
          :key="sprite"
          :src="getExistingSprites()[sprite]"
          :alt="sprite"
          :title="sprite.replace(/_/g, ' ')"
        >
      </div>
    </div>
    <div class="types-container">
      <span class="type-title">
        type
      </span>
      <div class="types-list">
        <pokemon-type
          v-for="{ type } in pokemon.types"
          :key="type.name"
          :type="type"
        />
      </div>
    </div>
    <div class="stats">
      <pokemon-stats
        :maxValue="255"
        :stats="pokemonStats"
        type="progress"
      />
    </div>
  </div>
</template>

<script>
import PokemonType from '@/components/PokemonType/PokemonType.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfo, faVenusMars } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import PokemonStats from '@/components/PokemonStats/PokemonStats.vue'

library.add(faInfo, faVenusMars, faStar)

export default {
  name: 'PokemonCardItem',
  props: ['initData'],

  data:() => ({
    pokemon: { },
    selectedGender: true
  }),

  components: {
    PokemonType,
    PokemonStats
  },

  computed: {
    getSprites: function() {
      const sprites = Object.keys(this.getExistingSprites())
        .filter(sprite => this.selectedGender? !sprite.includes('female') : sprite.includes('female'))
        .reverse()

        return sprites
    },

    getSortedTypes: function() {
      const types = []

      if (Array.isArray(this.pokemon.types)) {
        types.push(...this.pokemon.types)
        types.sort((type1, type2) => type1.slot - type2.slot)
      }

      return types
    },

    pokemonStats() {
      const stats = {};

      (this.pokemon.stats || []).forEach(statItem => {
        stats[statItem.stat.name] = statItem.base_stat
      })

      return stats
    },
  },

  methods: {
    getExistingSprites: function() {
      const { sprites } = this.pokemon
      const newObj = {}

      for (const key in this.pokemon.sprites) {
        if (sprites[key]) {
          newObj[key] = sprites[key]
        }
      }
      
      return newObj
    }
  },

  mounted: async function () {
    const newData = await (await fetch(this.initData.url)).json()

    if (newData) {
      this.pokemon = newData
    }
  }
}
</script>

<style scoped lang="sass">
.pokemon-card
  .header-container
    display: flex
    justify-content: space-between
    align-items: center

    .pokemon-name
      padding: 10px 0px
      font-size: 25px
      font-weight: bold
      &::first-letter
        text-transform: uppercase

    .menu
      display: flex

      & > *
        padding: 5px
        font-size: 25px

      .menu-button
        cursor: pointer


  .sprite-content
    display: flex
    justify-content: space-between

    .sprites-container
      width: 100%
      min-height: 115px
      display: flex
      flex-direction: row
      overflow-x: scroll
      margin: 10px 0px
      user-select: none
      padding: 0px 20px

      img
        max-width: 96px
        max-height: 96px
        min-width: 96px
        min-height: 96px

  .types-container
    display: flex
    justify-content: space-between
    align-items: center
    margin: 15px 0px

    .type-title
      font-size: 15px
      text-transform: uppercase
      font-weight: bold
</style>
