<template>
  <ul class="pagination-list">
    <li class="page-button" @click="$emit('navigate', 1)">
      <font-awesome-icon :icon="['fa', 'angle-double-left']"/>
    </li>
    <li
      class="page-button"
      v-for="page in buttonList"
      :key="page"
      @click="currentPage === page? null : $emit('navigate', page)"
      :class="currentPage === page? 'router-link-active': ''"
    >
      {{ page }}
    </li>
    <li class="page-button" @click="$emit('navigate', lastPage)">
      <font-awesome-icon :icon="['fa', 'angle-double-right']"/>
    </li>
  </ul>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleDoubleRight, faAngleDoubleLeft)

export default {
  name: 'Pagination',
  props: {
    buttonList: Array,
    lastPage: Number,
    currentPage: Number
  }
}
</script>

<style scoped lang="sass">
ul.pagination-list
  list-style-type: none
  margin: 0
  padding: 0
  display: flex
  border-radius: 5px
  overflow: hidden
  user-select: none

  li.page-button
    padding: 10px
    background-color: white
    color: black
    cursor: pointer

    &.router-link-active
      background-color: lightgrey
      color: grey
      cursor: default
</style>
