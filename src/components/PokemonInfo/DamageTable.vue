<template>
  <div class="damage-info-container">
    <table>
      <tr v-for="key in Object.keys(damageInfo)" :key="key" >
        <td>
          {{ key.replace(/_/g, ' ') }}
        </td>
        <td>
          <pokemon-type v-for="type in damageInfo[key]" :key="type.name" :type="type" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import PokemonType from '@/components/PokemonInfo/Type.vue'

export default {
  name: 'PokemonDamageTable',
  components: {
    PokemonType
  },
  props: {
    damageInfo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="sass">
  .damage-info-container
    table
      border-collapse: collapse
      border: 1px solid black
      tr
        td
          width: 50%
          border: 1px solid black
          padding: 5px

          &:first-child
            text-transform: uppercase
            white-space: nowrap
          &:last-child
            text-align: center
            & > *
              display: inline-block
              margin: 3px
</style>
