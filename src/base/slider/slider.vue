<template>
  <div class="slider" ref='slider'>
    <!-- 在recommend页面 slider组件下所有的内容都会放到slot下 -->
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <template></template>
      <div class="dot" v-for="(item, index) in dots" :key="index" :class="{active: index === currentPageIndex}"></div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'api/dom'

export default {
  props: {
    autoplay: {
      type: Boolean,
      default: true 
    },
    loop: {
      type: Boolean,
      default: true 
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoplay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth (isRsize) {
      let w = document.documentElement.clientWidth
      this.children = this.$refs.sliderGroup.children
      // this.dots = this.children.length
      let listWidth = 0
      for (let i = 0; i < this.children.length; i++) {
        let slider = this.children[i]
        slider.style.width = w + 'px'
        addClass(slider, 'slider-item')
        listWidth += slider.clientWidth
      }
      // 判断是否是页面变化  如果不是页面变化  宽度就不 * 2
      if (this.loop && !isRsize) {
        listWidth += (2 * w) 
      }
      this.$refs.sliderGroup.style.width = listWidth + 'px'
    },
    // 初始化轮播图
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        click: true,
        snap: {
          loop: true
        }
      })
      // better-scroll 滑动结束返回当前值
      this.slider.on('scrollEnd', () => {
        // 获取当前页面第几个子元素
        let index = this.slider.getCurrentPage().pageX
        this.currentPageIndex = index
        if (this.autoplay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    // 让轮播图自动轮播 使用goToPage方法
    _play () {
      let index = this.currentPageIndex
      let _this = this
      if (this.loop) {
        this.timer = setTimeout(() => {
          index += 1
          if (index === _this.dots.length) {
            index = 0
          }
          _this.slider.goToPage(index, 0, 400)
        }, this.interval)
      }
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          width 100%
          display block
          overflow hidden
          text-decoration none
          img
            display block
            width 100%
    .dots
      position absolute
      bottom 10%
      left 0
      width 100%
      display flex
      justify-content center
      .dot
        width 8px
        height 8px
        border-radius 50%
        background rgba(144,144,144,.8)
        margin 0 5px
        &.active
          background #fff
</style>
