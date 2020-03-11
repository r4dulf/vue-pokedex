<template>
  <div class="pokemon-move" v-if="move">
    <div class="short-info">
      <span class="name">{{ move.name }}</span>
      <div class="types">
        <pokemon-type :type="move.type" />
      </div>
      <span class="expand" @click="expanded = !expanded" :class="expanded && 'rotate-down'">
        <font-awesome-icon :icon="['fas', 'chevron-right']"/>
      </span>
    </div>
    <div class="effect-info" v-show="expanded">
      {{ getEffectDescription(move) }}
    </div>
  </div>
</template>

<script>
import PokemonType from '@/components/PokemonType/PokemonType.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronRight)

export default {
  name: 'PokemonMove',
  components: {
    PokemonType
  },

  data: () => ({
    expanded: false
  }),

  props: {
    move: {
      type: Object,
      required: true
    }
  },

  methods: {
    getEffectDescription(move) {
      let descr = move.effect_entries[0].effect;

      (descr.match(/(?:\$([a-zA-Z_]+))/g) || []).forEach(key => {
        const objKey = key.replace(/\$|%/g, '')
        
        descr = descr.replace(key, this.move[objKey])
      })

      return descr
    }
  }
}
</script>

<style scoped lang="sass">
  .effect-info
    width: 100%
    margin: 5px 0px

  .short-info
    display: grid
    grid-template-columns: 1fr 1fr 25px
    align-items: center

    .types
      display: flex
      justify-content: flex-end

    .expand
      display: flex
      justify-content: center
      align-items: center
      cursor: pointer
      transform: rotate(0)
      transition: transform .15s

      &.rotate-down
        transform: rotate(90deg)

  .name
    text-transform: uppercase
</style>
