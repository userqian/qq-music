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
        <div class="middle" @touchstart='middleStart' @touchmove='middleMove' @touchend='middleEnd'>
          <div class="middle-l" ref='middleL'>
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd">
                <img :src="currentSong.image" :class="cdRotate">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{playLyric}}</p>
            </div>
          </div>
          <scroll class="middle-r" ref="lyric" v-if="currentLyric" :data='currentLyric && currentLyric.lines'>
            <div class="lyric-wrapper">
              <p class="lyric" 
              v-for="(item, index) in currentLyric.lines" 
              :key="index"
              :class="{'active': lyricActive === index}"
              ref='lyricLine'>
                {{item.txt}}
              </p>
            </div>
          </scroll>
          </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentDot === 'cd'}"></span>
            <span class="dot" :class="{'active': currentDot === 'lyric'}"></span>
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
    <audio ref="playing" 
           :src="currentSong.url" 
           @canplay='ready' 
           @error='error' 
           @timeupdate='updateTime'
           @ended='end'></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'api/dom.js'
import progressBar from 'base/progress-bar/progress-bar'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'
import LyricParse from 'lyric-parser'
import scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transition-duration')
const time = 300
export default {
  data() {
    return {
      readyPlay: false,
      currentTime: 0,
      currentLyric: null,
      lyricActive: 0,
      currentDot: 'cd',
      playLyric: ''
    }
  },
  created() {
    this.touch = {}
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
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    prevPlay() { 
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        this.commonPLay(index)
      }
    },
    nextPlay() { 
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        this.commonPLay(index)
      }
    },
    loop() {
      this.$refs.playing.currentTime = 0
      this.$refs.playing.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
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
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextPlay()
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 滚动条拖拽进度
    _offset(size) {
      const currentTime = size * this.currentSong.duration
      this.currentTime = this.$refs.playing.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
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
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new LyricParse(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    handleLyric({lineNum, txt}) {
      if (lineNum > 5) {
        let lyricNum = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyric.scrollToElement(lyricNum, 1000)
      } else {
        this.$refs.lyric.scrollToElement(0, 0, 1000)
      }
      this.lyricActive = lineNum
      this.playLyric = txt
    },
    // 左右屏幕滑动
    middleStart(e) {
      this.initShow = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleMove(e) {
      if (!this.initShow) {
        return
      }
      const touch = e.touches[0]
      let delatX = touch.pageX - this.touch.startX
      let delatY = touch.pageY - this.touch.startY
      if (Math.abs(delatY) > Math.abs(delatX)) {
        return
      }
      const left = this.currentDot === 'cd' ? 0 : -window.innerWidth
      let offsetWidth = Math.min(Math.max(-window.innerWidth, delatX + left), 0)
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyric.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
    },
    middleEnd(e) {
      let offsetWidth
      let opacity
      // 向左滑
      if (this.currentDot === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentDot = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentDot = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyric.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyric.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
    },
    ...mapMutations({
      'setFullScreen': 'SET_FULL_SCREEN',
      'setPlayingState': 'SET_PLAYING',
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setMode': 'SET_MODE',
      'setPlayList': 'SET_PLAY_LIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.playing.play()
        this.getLyric()
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
      'mode',
      'sequenceList'
    ])
  },
  components: {
    progressBar,
    scroll
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
          width: 80%;
          height: 40px;
          line-height: 40px;
          margin: 0 auto;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          display inline-block
          position relative
          width 100%
          height 0
          padding-top 80%
          vertical-align top
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
        .playing-lyric-wrapper
          width 100%
          text-align center
          margin-top 50px
          .playing-lyric
            color #fff
            font-size 14px
        .middle-r
          display inline-block
          position relative
          width 100%
          .lyric-wrapper
            width 80%
            margin 0 auto
            text-align center
            .lyric
              line-height 32px
              font-size 14px
              color rgba(255,255,255,0.5)
              &.active
                color #fff
      .bottom
        position absolute
        bottom 50px
        width 100%
        .dot-wrapper
          width 100%
          text-align center
          .dot
            display inline-block
            width 8px
            height 8px
            border-radius 50%
            background rgba(255,255,255,.5)
            margin-right 10px
            &.active
              width 20px
              border-radius 10px
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
