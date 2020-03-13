<template>
  <main-layout>
    <div id="pokemons-cards">
      <vue-headful title="Pokedex" />
      <div class="features">
        <div class="cards-on-page">
          <span class="label">Cards count:</span>
          <select
            type="text"
            v-model="cardsOnPage"
            @change="updateData"
          >
            <option
              v-for="value in [5, 10, 20, 50]"
              :key="value"
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </div>
      <pokemon-card-list :list="pokemons.results"/>
      <div class="pagination-container">
        <pagination
          @navigate="navigate"
          :buttonList="paginationButtonList" 
          :lastPage="lastPage"
          :currentPage="currentPage"
        />
      </div>
    </div>
  </main-layout>
</template>

<script>
import MainLayout from '@/hoc/MainLayout.vue'
import qs from 'query-string'
import PokemonCardList from '@/components/PokemonCardList/PokemonCardList.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { getData } from '@/helpers/api'

export default {
  name: 'Main',
  components: {
    Pagination,
    PokemonCardList,
    MainLayout
  },
  
  data: function() {
    const query = qs.parse(window.location.search)

    return ({
      pokemons: {},
      cardsOnPage: +query.limit || 5,
      currentPage: +query.page || 1,
      paginationButtonsCount: 5
    })
  },

  computed: {
    lastPage() {
      return Math.ceil((this.pokemons.count || 0) / this.cardsOnPage)
    },

    paginationButtonList() {
      const from = this.currentPage - Math.floor(this.paginationButtonsCount / 2)
      const to = this.currentPage + Math.floor(this.paginationButtonsCount / 2)
      const buttonList = []

      for (let i = from; i <= to; i++) {
        if (i > 0 && i <= this.lastPage) {
          buttonList.push(i)
        }
      }

      return buttonList
    }
  },

  methods: {
    navigate(page, limit = this.cardsOnPage) {
      this.$router.push('?' + qs.stringify({ page: page, limit: limit })).catch(() => {})

      window.scrollTo(0, 0)
    },

    async updateData() {
      const data = await getData('pokemon', '', {
        offset: (this.currentPage - 1) * this.cardsOnPage,
        limit: this.cardsOnPage
      })

      this.pokemons = data
    },
  },

  async beforeRouteUpdate(to, from, next) {
    this.currentPage = +to.query.page || 1
    this.cardsOnPage = +to.query.limit || 5

    await this.updateData()

    next()
  },

  mounted() {
    this.updateData()
  },

  watch: {
    cardsOnPage(limit) {
      this.navigate(1, limit)
    }
  }
}
</script>

<style scoped lang="sass">
  div#pokemons-cards
    padding: 10px 0px

    .features
      padding: 5px 10px
      
      .cards-on-page
        display: flex
        justify-content: flex-end

        .label
          margin-right: 10px

        select
          width: 50px
          height: 20px
          background-color: white

  .pagination-container
    display: flex
    justify-content: center
</style>
