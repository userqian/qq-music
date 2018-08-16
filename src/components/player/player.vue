<template>
  <div class="player-wrapper" v-show="playList.length">
    <transition name="normal" @enter='enter' @after-enter='afterEnter' @leave='leave' @after-leave='afterLeave'>
      <div class="normal-wrapper" v-show="fullScreen">
        <div class="bg-img">
          <img :src="currentSong.image" alt="">
        </div>
        <div class="header">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <p class="name">{{currentSong.singer}}</p>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd">
                <img :src="currentSong.image" :class="cdRotate">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric"></p>
            </div>
          </div>
          <div class="middle-r">

          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrappper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="time-bar">
              <progress-bar :precent='precent' @barOffset='_offset'></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="prevPlay" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i @click="nextPlay" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini" v-show='!fullScreen'>
      <div class="mini-wrapper" @click="mini" v-show="!fullScreen">
        <div class="icon">
          <img :src="currentSong.image" :class="cdRotate">
        </div>
        <div class="text">
          <h1 class="title">{{currentSong.name}}</h1>
          <span class="name">{{currentSong.singer}}</span>
        </div>
        <div class="control" @click.stop="togglePlay">
          <i :class="playMiniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="playing" :src="currentSong.url" @canplay='ready' @error='error' @timeupdate='updateTime'></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'api/dom.js'
import progressBar from 'base/progress-bar/progress-bar'
import {playMode} from 'common/js/config.js'

const transform = prefixStyle('transform')
export default {
  data() {
    return {
      readyPlay: false,
      currentTime: 0
    }
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    mini() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const {x, y, scale} = this._getPoxAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        preset: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter(el) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPoxAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave(el) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPoxAndScale() {
      let targetWidth = 40
      // mini播放器中心坐标距离左边
      let paddingLeft = 40
      let paddingBottom = 30
      // 大播放器距离顶部
      let paddingTop = 80
      let cdWidth = window.innerWidth * 0.8
      let scale = targetWidth / cdWidth
      let x = -(window.innerWidth / 2 - paddingLeft)
      let y = window.innerHeight - paddingTop - cdWidth / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    togglePlay() {
      if (!this.readyPlay) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    prevPlay() { 
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.commonPLay(index)
    },
    nextPlay() { 
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.commonPLay(index)
    },
    commonPLay(index) {
      if (!this.readyPlay) {
        return
      }
      this.setCurrentIndex(index)
      this.$nextTick(() => {
        this.togglePlay()
      })
      this.readyPlay = false
    },
    ready() {
      this.readyPlay = true
    },
    error() {
      this.readyPlay = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    _offset(size) {
      const currentTime = size * this.currentSong.duration
      this.currentTime = this.$refs.playing.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay()
      }
    },
    // 时间戳转分秒算法
    format(intval) {
      // 取整
      intval = intval | 0
      let m = intval / 60 | 0
      let s = intval % 60
      s = this._pad(s)
      return `${m}:${s}`
    },
    // 当时间个位数前面加0
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      const list = null
      if(mode === 0) {
          
      }     
    },
    ...mapMutations({
      'setFullScreen': 'SET_FULL_SCREEN',
      'setPlayingState': 'SET_PLAYING',
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setMode': 'SET_MODE'
    })
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.playing.play()
      })
    },
    playing(val) {
      this.$nextTick(() => {
        const audio = this.$refs.playing
        val ? audio.play() : audio.pause()
      })
    }
  },
  computed: {
    cdRotate() {
      return this.playing ? 'play' : ''
    },
    playMiniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini' 
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    precent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random' 
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  components: {
    progressBar
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @keyframes cd-rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
  .player-wrapper
    .play
      animation cd-rotate 20s linear infinite
    .normal-wrapper
      position fixed
      top 0px
      left 0px
      width 100%
      height 100%
      z-index 100
      color #fff
      background #222
      .bg-img
        position absolute
        top 0px
        left 0
        width 100%
        height 100%
        z-index -1
        filter blur(20px)
        opacity 0.6
        img
          width 100%
          height 100%
      .header
        position relative
        margin-bottom 25px
        text-align center
        .back
          position absolute
          top 0px
          left 6px
          z-index 50
          .icon-back
            display block
            padding 9px
            font-size 22px
            color #ffcd32
            transform rotate(-90deg)
        .title
          line-height 40px
          font-size 18px
        .name
          line-height 20px
          font-size 14px
      .middle
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l
          position relative
          height 0
          padding-top 80%
          .cd-wrapper
            position absolute
            top 0px
            left 10%
            width 80%
            height 100%
            .cd
              width 100%
              height 100%
              border-radius 50%
              img
                width 100%
                height 100%
                border-radius 50%
                border 10px solid rgba(255,255,255,0.1)
                box-sizing border-box
      .bottom
        position absolute
        bottom 50px
        width 100%
        .progress-wrapper
          display flex
          width 80%
          margin 0 auto
          .time
            flex 0 0 30px
            width 30px
            font-size 14px
            line-height 40px
          .time-bar
            flex 1
            padding 0 5px
        .operators
          display flex
          align-items center
          .icon
            flex 1
            color #ffcd32
            &.i-left
              text-align right
            &.i-center
              text-align center
              i
                font-size 40px
                padding 0 30px
            &.i-right
              text-align left
            i
              font-size 30px
      &.normal-enter-active, &.normal-leave-active
        transition all 0.4s
        .header, .bottom
          transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        .header
          transform translate3d(0,-100px,0)
        .bottom
          transform translate3d(0,100px,0)
    .mini-wrapper
      display flex
      align-items center
      position fixed
      bottom 0
      left 0
      z-index 200
      width 100%
      height 60px
      line-height 60px
      background #333
      &.mini-enter-active, &.mini-leave-active
        transition all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity 0        
      .icon
        flex 0 0 40px
        width 40px
        height 40px
        padding 0 10px 0 20px
        img
          width 100%
          height 100%
          border-radius 50%
      .text
        display flex
        flex-direction column
        justify-content center
        flex 1
        line-height 20px
        overflow hidden
        .title
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: #fff
        .name
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex 0 0 30px
        width 30px
        margin-right 10px
        color $color-theme-d
        font-size 30px
</style>
