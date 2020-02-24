<template>
  <router-link :to="`type/${type.name}`">
    <span
      class="type-name"
      :class="type.name">
      {{ type.name }}
    </span>
  </router-link>
</template>

<script>
export default {
  name: 'PokemonType',
  props: ['type']
}
</script>

<style scoped lang="sass">
  .type-name
    font-size: 16px
    box-sizing: border-box
    display: inline-block
    margin: 0px 5px 0px 0px
    padding: 5px 15px
    text-align: center
    min-width: 96px
    border: 3px solid #333
    border-radius: 20px
    text-transform: uppercase
    color: white
    
  .grass
    background-color: #78c850

  .poison
    background-color: #a040a0

  .fire
    background-color: #f08030

  .flying
    background-color: #a890f0

  .water
    background-color: #6890f0

  .bug
    background-color: #a8b820

  .fairy
    background-color: #f0b6bc

  .dragon
    background-color: #70f838

  .ghost
    background-color: #705898

  .ice
    background-color: #98d8d8

  .steel
    background-color: #b8b8d0

  .dark
    background-color: #705848

  .rock
    background-color: #b8a038

  .psychic
    background-color: #f85888

  .ground
    background-color: #e0C068

  .normal
    background-color: #e0C068

  .electric
    background-color: #f8d030

  .fighting
    background-color: darkred
</style>
