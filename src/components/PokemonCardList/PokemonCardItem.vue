<template>
  <div class="pokemon-card" v-if="pokemon">
    <div class="header-container">
      <div class="pokemon-name">
        <router-link :to="`pokemon/${pokemon.name}`">
          {{ pokemon.name }}
        </router-link>
      </div>
      <div class="more-info">
        <font-awesome-icon :icon="['fa', 'bars']" size="2x" @click="showMenu = !showMenu" class="menu-icon"/>
        <transition name="fade">
          <div class="menu" v-if="showMenu">
            <router-link :to="`pokemon/${pokemon.name}`">
              More info
            </router-link>
          </div>
        </transition>
      </div>
    </div>
    <div class="sprites-container" ref="spriteBox">
      <img
        v-for="key in Object.keys(getExistingSprites).reverse()"
        :key="key"
        :src="getExistingSprites[key]"
        :alt="key"
        :title="key.replace(/_/g, ' ')"
      >
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
    <div class="stats-container">
      <div class="stat-item" v-for="{ stat, base_stat } in pokemon.stats" :key="stat.name">
        <div class="stat-info">
          <router-link class="stat-name" :to="`stat/${stat.name}`">
            {{ stat.name }}
          </router-link>
          <span class="stat-value">
            {{ base_stat }}
          </span>
        </div>
        <progress-bar :value="+base_stat" :maxValue="255"/>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
import PokemonType from '@/components/PokemonType/PokemonType.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars)

export default {
  name: 'PokemonCardItem',
  props: ['initData'],

  data:() => ({
    pokemon: {},
    showMenu: false
  }),

  components: {
    ProgressBar,
    PokemonType
  },

  computed: {
    getExistingSprites: function() {
      const { sprites } = this.pokemon
      const newObj = {}

      for (const key in this.pokemon.sprites) {
        if (sprites[key]) {
          newObj[key] = sprites[key]
        }
      }
      
      return newObj
    },

    getSortedTypes: function() {
      const types = []

      if (Array.isArray(this.pokemon.types)) {
        types.push(...this.pokemon.types)
        types.sort((type1, type2) => type1.slot - type2.slot)
      }

      return types
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

      .more-info
        padding: 0px
        position: relative

        .menu-icon
          border-radius: 50%
          width: 35px
          cursor: pointer

        .menu
          position: absolute
          right: 0
          display: flex
          flex-direction: column
          background-color: #fff
          overflow: hidden
          box-shadow: 0px 15px 15px lightgrey
          padding: 5px
          text-align: center
          border-radius: 20px

          & > *
            white-space: nowrap
            padding: 10px 20px
            cursor: pointer
            border-bottom: 1px solid transparent
            transition: border 0.15s linear

            &:hover
              border-bottom: 1px solid black
            

      .pokemon-name
        padding: 10px 0px
        font-size: 25px
        font-weight: bold
        &::first-letter
          text-transform: uppercase 

    .sprites-container
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

    .stats-container
      .stat-info
        display: flex
        justify-content: space-between  
        font-size: 15px
        text-transform: uppercase
        font-weight: bold
        margin: 5px 0px

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
