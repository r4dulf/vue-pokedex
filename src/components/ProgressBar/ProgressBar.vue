<template>
  <div class="progress-container">
    <div class="progress-value" ref="progress"></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    value: Number,
    maxValue: Number
  },
  mounted() {
    this.updateProgress()
  },
  watch: {
    value() {
      this.updateProgress()
    }
  },

  methods: {
    updateProgress() {
      this.$refs.progress.style.width = `${ this.value / this.maxValue * 100 }%`
    }
  }
}
</script>

<style scoped lang="sass">
  .progress-container
    border-radius: 20px
    border: 5px solid #222
    background-color: #444
    overflow: hidden

    .progress-value
      background-color: orange
      height: 20px
</style>
