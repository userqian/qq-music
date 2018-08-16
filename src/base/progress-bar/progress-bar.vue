<template>
  <div class="progress-bar" ref="progressBar" @click="progressBarCick">
    <div class="bar-inner">
      <div class="progress" ref='progress'></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" 
             ref="progressBtn"
             @touchstart.prevent='touchStart'
             @touchmove.prevent='touchMove'
             @touchend.prevent='touchEnd'></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'api/dom.js'

let transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      barWidth: 0,
      touch: {

      }
    }
  },
  watch: {
    precent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        this.barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let barWidth = this.barWidth
        let offset = newVal * barWidth
        this._offset(offset)
      }
    }
  },
  methods: {
    touchStart(e) {
      this.touch.initiated = true
      this.touch.start = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      this.touch.end = e.touches[0].pageX
      let offset = Math.min(Math.max(0, this.touch.left + (this.touch.end - this.touch.start)), this.barWidth)
      this._offset(offset)
    },
    touchEnd(e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressBarCick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _offset(offset) {
      this.$refs.progress.style.width = offset + 'px'
      this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`
    },
    _triggerPercent() {
      let offset = this.$refs.progress.clientWidth / this.barWidth
      this.$emit('barOffset', offset)
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"

  .progress-bar
    height 40px
    .bar-inner
      position relative
      top 18px
      height 4px
      background rgba(0,0,0,.5)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid #fff
          border-radius: 50%
          background: $color-theme
</style>
