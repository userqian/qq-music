<template>
  <div class="music-list">
    <div class="head">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div class="container">
      <div class="bg-img" :style="bgStyle" ref="bgImg">
        <div class="play-box" ref="playBox" v-if="songList.length" @click.prevent.stop="randomPlay">
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll :data='songList' 
              :probeType='probeType' 
              :listenScroll='listenScroll' 
              @posY='scroll'
              ref='scrollWrapper'>
        <div class="song-list-wrapper">
          <song-list :songList='songList' @selectItem='selectItem'></song-list>
        </div>
        <div class="loading-container">
          <loading></loading>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import loading from 'base/loading/loading'
import {prefixStyle} from 'api/dom.js'
import {mapActions} from 'vuex'
import {playingMinxi} from 'common/js/minxi'

const HEAD_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  mixins: [playingMinxi],
  props: {
    title: {
      type: String
    },
    bgImg: {
      type: String
    },
    songList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      posY: 0
    }
  },
  mounted() {
    this.h = this.$refs.bgImg.clientHeight
    this.minTranslateY = -this.h + HEAD_HEIGHT
    this.$refs.scrollWrapper.$el.style.top = `${this.h}px`
    // this.$refs.scrollWrapper.$el.style.height = `${document.documentElement.clientHeight - this.h}px`
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImg})`
    }
  },
  methods: {
    handlePlayList(list) {
      let bottom = list.length > 0 ? '60px' : 0
      this.$refs.scrollWrapper.$el.style.bottom = bottom
      this.$refs.scrollWrapper.refresh()
    },
    back() {
      this.$router.go(-1)
    },
    scroll(pos) {
      this.posY = pos.y
    },
    selectItem(item, index) {
      this.selectPlayer({
        list: this.songList,
        index
      })
    },
    randomPlay() {
      this.randomPlayList({
        list: this.songList
      })
    },
    ...mapActions([
      'selectPlayer',
      'randomPlayList'
    ])
  },
  watch: {
    posY(newY) {
      let max = Math.max(this.minTranslateY, newY)
      this.$refs.layer.style[transform] = `translate3d(0,${max}px,0)`
      let zIndex = 0
      let scale = 1
      let blur = 20
      const percent = Math.abs(newY / this.h)
      // 判断列表滑动到顶部 设置顶部图片高度以及z-index
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.bgImg.style.height = HEAD_HEIGHT + 'px'
        this.$refs.playBox.style.display = 'none'
      } else {
        this.$refs.bgImg.style.paddingTop = '70%'
        this.$refs.bgImg.style.height = 0
        this.$refs.playBox.style.display = ''
      }
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(percent * 20, blur)
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      }
      this.$refs.bgImg.style.zIndex = zIndex
      this.$refs.bgImg.style[transform] = `scale(${scale})`
    }
  },
  components: {
    songList,
    scroll,
    loading
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  .head
    position absolute
    top 0px
    left 0
    width 100%
    color #fff
    line-height 40px
    z-index 50
    .back
      position absolute
      top 0px
      left 6px
      .icon-back
        display inline-block
        padding 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      font-size 18px
      text-align center
  .container
    height 100%
    .bg-layer
      position relative
      height 100%
      background #222
    .bg-img
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-box
        position: absolute;
        bottom: 20px;
        left 50%;
        transform translateX(-50%)
        z-index: 50;
        padding: 6px 20px;
        border-radius 100px
        border: 1px solid #ffcd32;
        color: #ffcd32;
        .icon-play
          vertical-align middle
          margin-right 2px
        span
          font-size 12px
          vertical-align middle
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .scroll-wrapper
      position absolute
      left 0
      width 100%
      height auto
      overflow inherit
      .song-list-wrapper
        padding 20px 30px
</style>
