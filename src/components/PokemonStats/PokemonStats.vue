<template>
  <div class="stats">
    <div class="switch" v-if="!type">
      <div
        class="toggle"
        v-for="value in ['progress', 'diagramm']"
        :key="value"
        :data-type="value"
        @click="switchType(value)"
        :class="displayType === value? 'active': ''"
      >
        {{ value.toUpperCase() }}
      </div>
    </div>

    <div class="diagramm" v-if="displayType === 'diagramm'">
      <canvas ref="diagramm" :height="radius * 2 + padding * 2" :width="radius * 2 + padding * 2">
        Oops! Your browser doesn't support the HTML5 CANVAS tag.
      </canvas>
    </div>

    <div
      class="progress"
      v-if="displayType === 'progress'"
      :class="fullWidth? 'full-width': ''"
    >
      <div class="stat-item" v-for="key in Object.keys(stats)" :key="key">
        <div class="stat-info">
          <router-link class="stat-name" :to="`/stat/${key}`">
            {{ key }}
          </router-link>
          <span class="stat-value">
            {{ stats[key] }}
          </span>
        </div>
        <progress-bar :value="+stats[key]" :maxValue="maxValue"/>
      </div>
    </div>

  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'

const radius = 150
const padding = 40

export default {
  name: 'PokemonStats',

  data() {
    return {
      radius: radius,
      padding: padding,
      radiusWithPadding: radius + padding,
      fontSize: 14,
      displayType: this.type || 'progress'
    }
  },

  props: {
    stats: Object,
    maxValue: Number,
    type: String, // 'diagramm' || 'progress' || null,
    fullWidth: Boolean
  },

  components: {
    ProgressBar,
  },

  mounted() {
    if (this.displayType === 'diagramm') {
      this.drawDiagramm()
    }
  },

  updated() {
    if (this.displayType === 'diagramm') {
      this.drawDiagramm()
    }
  },

  methods: {
    degToRad: deg => deg * Math.PI / 180,

    drawDiagramm() {
      const canvas = this.$refs.diagramm
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'black'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 1

      this.drawCircle(ctx)

      this.drawGrid(ctx)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.font = Math.round(this.fontSize) + 'px Roboto, Arial'

      this.drawText(ctx)

      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(255, 165, 0, 1)'
      ctx.fillStyle = 'rgba(255, 165, 0, 0.33)'

      this.drawStats(ctx)
    },

    switchType(type) {
      this.displayType = type 
    },

    drawCircle(ctx) {
      ctx.save()

      ctx.beginPath()
      ctx.arc(this.radiusWithPadding, this.radiusWithPadding, this.radius - ctx.lineWidth, this.degToRad(0), this.degToRad(360))
      ctx.closePath()

      ctx.restore()
      ctx.stroke()
    },

    drawGrid(ctx) {
      ctx.beginPath()

      Object.keys(this.stats).forEach((val, ind, arr) => {
        ctx.moveTo(this.radiusWithPadding, this.radiusWithPadding)

        this.rotateCanvas(ctx, 360 / arr.length)

        ctx.lineTo(this.radiusWithPadding, this.padding + ctx.lineWidth)
      })

      ctx.stroke()
      ctx.closePath()
    },

    drawStats(ctx, scale = 1) {
      ctx.beginPath()

      Object.values(this.stats).forEach((val, ind, arr) => {
        ctx.save()

        ctx.moveTo(this.radiusWithPadding, this.radiusWithPadding)

        this.rotateCanvas(ctx, 360 / arr.length * ind)

        ctx.lineTo(this.radiusWithPadding, this.radiusWithPadding + ctx.lineWidth - this.radius * val / this.maxValue * scale)

        ctx.restore()
      })

      Object.values(this.stats).forEach((val, ind, arr) => {
        ctx.save()

        this.rotateCanvas(ctx, 360 / arr.length * ind)

        ctx.lineTo(this.radiusWithPadding, this.radiusWithPadding + ctx.lineWidth - this.radius * val / this.maxValue * scale)

        this.rotateCanvas(ctx, -360 / arr.length * ind)
        
        ctx.restore()
      })

      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    },

    drawText(ctx) {
      ctx.save()

      Object.keys(this.stats).forEach((key, ind, arr) => {
        ctx.fillText(key.toUpperCase(), this.radiusWithPadding, this.padding / 2)
        ctx.fillText(this.stats[key], this.radiusWithPadding, this.padding)
        
        this.rotateCanvas(ctx, 360 / arr.length)
      })

      ctx.restore()
    },

    rotateCanvas(ctx, angle) {
      ctx.translate(this.radiusWithPadding, this.radiusWithPadding)
      ctx.rotate(this.degToRad(angle))
      ctx.translate(-this.radiusWithPadding, -this.radiusWithPadding)
    }
  }
}
</script>

<style scoped lang="sass">
  .stats
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    canvas, .full-width
      width: 380px
      height: 380px
      display: flex
      justify-content: center
      align-items: center

  .switch
    display: flex
    justify-content: center
    margin: 5px

    .toggle
      padding: 10px
      background-color: white
      border: 1px solid black
      cursor: pointer

      &.active
        cursor: default
        background-color: grey
        color: white
        border: 1px solid transparent


  .progress
    width: 100%

    &.full-width
      display: flex
      flex-direction: column

      & > *
        width: 100%

    .stat-info
      display: flex
      justify-content: space-between  
      font-size: 15px
      text-transform: uppercase
      font-weight: bold
      margin: 5px 0px
    
</style>
