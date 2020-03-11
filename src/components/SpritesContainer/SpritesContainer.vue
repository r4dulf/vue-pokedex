<template>
  <div class="sprites-container">
    <div
      class="sprite-box"
      v-for="sprite in getSprites"
      :key="sprite"
      v-show="sprites[sprite]"
    >
      <img
        :src="sprites[sprite]"
        :alt="sprite"
        :title="sprite.replace(/_/g, ' ')"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpritesContainer',
  props: {
    sprites: Object
  },

  computed: {
    getSprites() {
      return Object.keys(this.sprites || {}).reverse()
    }
  }
}
</script>

<style scoped lang="sass">
  .sprites-container
    display: flex
    align-items: center
    flex-direction: row
    overflow-x: scroll
    margin: 10px 0px
    user-select: none
    padding: 0px 20px

    .sprite-box
      display: inline-block

      img
        max-width: 96px
        max-height: 96px
        min-width: 96px
        min-height: 96px
        
    &.wrap-elements
      flex-wrap: wrap
</style>
