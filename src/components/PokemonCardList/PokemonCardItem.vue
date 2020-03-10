<template>
  <div class="pokemon-card" v-if="pokemon">
    <div class="header-container">
      <div class="pokemon-name">
        <router-link :to="`pokemon/${pokemon.id}`">
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
        <router-link :to="`pokemon/${pokemon.id}`" class="menu-button" title="More info">
          <font-awesome-icon :icon="['fa', 'info']"/>
        </router-link>
      </div>
    </div>
    <sprites-container
      :sprites="pokemon.sprites"
    />
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
import SpritesContainer from '@/components/SpritesContainer/SpritesContainer.vue'
import PokemonStats from '@/components/PokemonStats/PokemonStats.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfo, faVenusMars } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

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
    PokemonStats,
    SpritesContainer
  },

  computed: {
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

  .types-container
    display: flex
    justify-content: space-between
    align-items: center
    margin: 15px 0px

    .type-title
      font-size: 15px
      text-transform: uppercase
      font-weight: bold

    .types-list
      display: flex
      flex-wrap: wrap
      justify-content: flex-end
</style>
