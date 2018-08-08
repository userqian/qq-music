<template>
  <div class="recommend">
    <scroll :data='discList' class='content' ref="scroll">
      <div>
        <div class="slider-wrapper" v-if='sliderList.length'>
          <slider>
            <div v-for='item in sliderList' :key='item.id' ref='sliderItem'>
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load='_imgLoad'>
              </a>
            </div>
          </slider>
        </div>
        <!-- 歌单列表 -->
        <div class="disc-wrapper">
          <h1>热门歌单推荐</h1>
          <ul>
            <li class="disc-item" v-for="item in discList" :key="item.dissid">
              <div class="pic">
                <!-- 图片懒加载 -->
                <img v-lazy="item.imgurl">
              </div>
              <div class="msg">
                <p class="title" v-html="item.creator.name"></p>
                <p class="info">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
          
        </div>
        <loading v-show = '!discList.length'></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import {getRecommend, getRecommendList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
export default {
  data () {
    return {
      sliderList: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getRecommendList()
  },
  methods: {
    // 获取轮播列表
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider
        }
      })
    },
    // 获取推荐歌单列表
    _getRecommendList () {
      getRecommendList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // 监听slider img load事件  防止网络延迟造成图片没有加载出来，没有高度，滚动有问题
    _imgLoad () {
      // 让图片加载一次 剩下不执行
      if (!this.isload) {
        // 让scroll执行refresh()
        this.$refs.scroll.refresh()
        this.isload = true
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  // 当退出组件的时候 清下定时器
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable';
  .recommend
    position fixed
    width 100%
    top 84px
    bottom 0
    .content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .disc-wrapper
        height 100%
        overflow hidden        
        h1
          text-align center
          margin 10px 0
        ul
          .disc-item
            display flex
            align-items center
            padding 5px 20px
            .pic
              flex 0 0 60px
              width 60px
              padding-right 20px
              img 
                width 100%
            .msg
              flex 1
              display flex
              flex-direction column
              justify-content space-between
              line-height 20px
              font-size $font-size-medium
              .title
                margin-bottom 10px
                color $color-text
              .info
                color #a9a9a9
</style>
