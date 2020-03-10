<template>
  <main-layout>
    <div id="content" v-if="isLoaded">
      <vue-headful :title="getTitle" />

      <div class="pokemon-header">
        <div class="pokemon-title">
          <h1 class="pokemon-name">{{ pokemon.name }}</h1>
          <div class="add-to-favorite button">
            <font-awesome-icon :icon="['far', 'star']" size="2x"/>
          </div>
        </div>
        <div class="buttons-list" v-if="+id">
          <span class="button" v-if="pokemon.id > 1" @click="navigate" :data-to="id - 1">
            <font-awesome-icon :icon="['far', 'caret-square-left']" size="2x"/>
          </span>
          <span class="button" @click="navigate" :data-to="id + 1">
            <font-awesome-icon :icon="['far', 'caret-square-right']" size="2x"/>
          </span>
        </div>
      </div>

      <div class="pokemon-info">
        <div class="first-column">

          <div class="sprites">
            <h2 class="sprites-title">
              Sprites
            </h2>
            <sprites-container
              :sprites="pokemon.sprites"
              class="wrap-elements"
            />
          </div>

          <div class="types">
            <div class="types-title">
              <h2>Types</h2>
              <div class="types-container">
                <pokemon-type
                  v-for="{ type } in pokemon.types"
                  :key="type.name"
                  :type="type"
                />
              </div>
            </div>
          </div>

          <div class="damage-info">
            <div class="damage-info-title">
              <h2>Damage info</h2>
              <div class="damage-info-container">
                <table>
                  <tr
                    v-for="key in Object.keys(damageInfo)"
                    :key="key"
                  >
                    <td>
                      {{ key.replace(/_/g, ' ') }}
                    </td>
                    <td>
                      <pokemon-type
                        v-for="type in damageInfo[key]"
                        :key="type.name"
                        :type="type"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

        </div>
        <div class="second-column">

          <div class="characteristics">
            <div class="characteristics-title">
              <h2>
                Characteristics
              </h2>
            </div>
            <table>
              <tr
                v-for="key in Object.keys(getCharacteristics)"
                :key="key"
              >
                <td>
                  {{ key.replace(/_/g, ' ') }}
                </td>
                <td>
                  {{ getCharacteristics[key] }}
                </td>
              </tr>
            </table>
          </div>

          <div class="stats">
            <div class="stats-title">
              <h2>
                Stats
              </h2>
            </div>
            <div class="stats-container">
              <pokemon-stats
                :stats="pokemonStats"
                :maxValue="255"
                :fullWidth="true"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </main-layout>
</template>

<script>
import MainLayout from '@/hoc/MainLayout.vue'
import PokemonType from '@/components/PokemonType/PokemonType.vue'
import { getData } from '@/helpers/api'
import PokemonStats from '@/components/PokemonStats/PokemonStats.vue'
import SpritesContainer from '@/components/SpritesContainer/SpritesContainer.vue'
import { faCaretSquareRight, faCaretSquareLeft, faStar } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faCaretSquareLeft, faCaretSquareRight, faStar)

export default {
  name: 'PokemonPage',
  components: {
    PokemonStats,
    MainLayout,
    PokemonType,
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

    getTitle() {
      return this.pokemon.name[0].toUpperCase() + this.pokemon.name.split('').splice(1).join('')
    },

    getCharacteristics() {
      const { height, base_experience, weight } = this.pokemon

      return { height, weight, base_experience }
    }
  },

  methods: {
    navigate(e) {
      this.$router.push(`/pokemon/${e.currentTarget.dataset.to}`)
      this.id = +e.currentTarget.dataset.to
    },

    async getDamageInfo() {
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

      return damageInfo
    }
  },

  async mounted() {
    const data = await getData('pokemon', this.$route.params.id.toLowerCase())

    if (data) {
      this.pokemon = data
      this.isLoaded = true
      this.id = this.pokemon.id
      this.damageInfo = await this.getDamageInfo()
    }
  },

  watch: {
    async id() {
      const data = await getData('pokemon', this.$route.params.id.toLowerCase())

      if (data) {
        this.pokemon = data
        this.id = this.pokemon.id
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

      .characteristics

        table
          width: 100%
          border: 1px solid black
          padding: 0
          border-collapse: collapse

          tr
            display: grid
            grid-template-columns: 1fr 1fr

            td
              border: 1px solid black
              padding: 10px

              &:last-child
                text-align: end

              &:first-letter
                text-transform: uppercase
</style>
