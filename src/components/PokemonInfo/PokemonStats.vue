<template>
  <div class="stats">
    <div class="switch" v-if="!type">
      <div
        class="toggle-tab"
        @click="switchType('progress')"
        :class="displayType === 'progress'? 'active': ''"
      >
        <font-awesome-icon :icon="['fas', 'align-left']" size="2x"/>
      </div>
      <div
        class="toggle-tab"
        @click="switchType('diagramm')"
        :class="displayType === 'diagramm'? 'active': ''"
      >
        <font-awesome-icon :icon="['fas', 'chart-pie']" size="2x"/>
      </div>
    </div>

    <div class="diagramm" v-show="displayType === 'diagramm'">
      <canvas ref="diagramm" :height="radiusWithPadding * 2" :width="radiusWithPadding * 2">
        Oops! Your browser doesn't support the HTML5 CANVAS tag.
      </canvas>
    </div>

    <div class="progress" v-show="displayType === 'progress'" >
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
import { faAlignLeft, faChartPie } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faAlignLeft, faChartPie)

const radius = 156
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
    type: String, // 'diagramm' || 'progress' || null
  },

  components: {
    ProgressBar,
  },

  watch: {
    stats() {
      this.drawDiagramm()
    },

    displayType() {
      this.drawDiagramm()
    }
  },

  methods: {
    degToRad: deg => deg * Math.PI / 180,

    drawDiagramm() {
      if (this.displayType === 'diagramm') {
        const canvas = this.$refs.diagramm
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, this.radiusWithPadding * 2, this.radiusWithPadding * 2)

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
      }
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

    & > .switch ~ div
      padding: 5px
      border: 1px solid black

    canvas
      width: 100%

  .switch
    position: relative
    left: 1px
    margin-right: 0
    padding-top: 45px

    .toggle-tab
      text-align: center
      padding: 5px
      cursor: default
      background-color: #ddd
      border: 1px solid transparent
      border-right-color: black
      cursor: pointer

      &.active
        background-color: white
        border: 1px solid black
        border-right: 1px solid transparent

  .progress
    width: 100%

    .stat-info
      display: flex
      justify-content: space-between  
      font-size: 15px
      text-transform: uppercase
      font-weight: bold
      margin: 9px 0px
    
</style>
