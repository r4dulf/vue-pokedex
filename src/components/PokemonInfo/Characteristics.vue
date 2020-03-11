<template>
  <table>
    <tr v-for="key in Object.keys(characteristics)" :key="key" >
      <td>
        {{ key.replace(/_/g, ' ') }}
      </td>
      <td>
        {{ characteristics[key] }}
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  name: 'Characteristics',
  props: {
    characteristics: Object
  }
}
</script>

<style scoped lang="sass">
  table
    width: 100%
    border: 1px solid black
    border-collapse: collapse

    tr
      td
        width: 50%
        border: 1px solid black
        padding: 10px

        &:last-child
          text-align: end

        text-transform: uppercase
</style>
