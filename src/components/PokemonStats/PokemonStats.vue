<template>
  <div class="stats">

    <div class="switch" v-if="!type">
      <div
        class="toggle"
        v-for="value in ['progress', 'diagramm']"
        :key="value"
        :data-type="value"
        @click="switchType(value)"
      >
        {{ value.toUpperCase() }}
      </div>
    </div>

    <div class="diagramm" v-if="displayType === 'diagramm'">
      <canvas ref="diagramm" :height="radius * 2 + padding * 2" :width="radius * 2 + padding * 2">
        Oops! Your browser doesn't support the HTML5 CANVAS tag.
      </canvas>
    </div>

    <div class="progress" v-if="displayType === 'progress'">
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
      count: Object.keys(this.stats).length,
      fontSize: 14,
      displayType: this.type || 'progress'
    }
  },

  props: {
    stats: Object,
    maxValue: Number,
    type: String // 'diagramm' || 'progress'
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

      for(let i = 0; i < this.count; i++) {
        ctx.save()

        ctx.moveTo(this.radiusWithPadding, this.radiusWithPadding)

        ctx.translate(this.radiusWithPadding, this.radiusWithPadding)
        ctx.rotate(this.degToRad(360 / this.count * i))
        ctx.translate(-this.radiusWithPadding, -this.radiusWithPadding)

        ctx.lineTo(this.radiusWithPadding, this.padding + ctx.lineWidth)

        ctx.restore()
      }

      ctx.stroke()
      ctx.closePath()
    },

    drawStats(ctx, scale = 1) {
      const values = Object.values(this.stats)

      ctx.beginPath()

      for(let i = 0; i < this.count; i++) {
        ctx.save()

        ctx.moveTo(this.radiusWithPadding, this.radiusWithPadding)

        ctx.translate(this.radiusWithPadding, this.radiusWithPadding)
        ctx.rotate(this.degToRad(360 / this.count * i))
        ctx.translate(-this.radiusWithPadding, -this.radiusWithPadding)

        ctx.lineTo(this.radiusWithPadding, this.radiusWithPadding + ctx.lineWidth - this.radius * values[i] / this.maxValue * scale)

        ctx.restore()
      }

      for(let i = 0; i < this.count; i++) {
        ctx.save()

        ctx.translate(this.radiusWithPadding, this.radiusWithPadding)
        ctx.rotate(this.degToRad(360 / this.count * i))
        ctx.translate(-this.radiusWithPadding, -this.radiusWithPadding)

        ctx.lineTo(this.radiusWithPadding, this.radiusWithPadding + ctx.lineWidth - this.radius * values[i] / this.maxValue * scale)

        ctx.translate(this.radiusWithPadding, this.radiusWithPadding)
        ctx.rotate(this.degToRad(-360 / this.count * (i + 1)))
        ctx.translate(-this.radiusWithPadding, -this.radiusWithPadding)
        
        ctx.restore()
      }

      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    },

    drawText(ctx) {
      for(let i = 0; i < this.count; i++) {
        ctx.save()

        ctx.translate(this.radiusWithPadding, this.radiusWithPadding)
        ctx.rotate(this.degToRad(360 / this.count * i))
        ctx.translate(-this.radiusWithPadding, -this.radiusWithPadding)

        ctx.fillText(Object.keys(this.stats)[i].toUpperCase(), this.radiusWithPadding, this.padding / 2)
        ctx.fillText(`${Object.values(this.stats)[i]}`, this.radiusWithPadding, this.padding)

        ctx.restore()
      }
    }
  }
}
</script>

<style scoped lang="sass">
  canvas, .progress 
    width: 380px
    height: 380px
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    & > *
      width: 100%

  .progress
    .stat-info
      display: flex
      justify-content: space-between  
      font-size: 15px
      text-transform: uppercase
      font-weight: bold
      margin: 5px 0px
    
</style>
