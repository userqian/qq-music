<template>
  <div class="player-wrapper" v-show="playList.length">
    <div class="normal-wrapper" v-if="fullScreen">
      全局播放
    </div>
    <div class="mini-wrapper" v-if="!fullScreen">
      迷你播放
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen'
    ])
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .player-wrapper
    position fixed
    top 0px
    left 0px
    width 100%
    height 100%
    z-index 100
    color #fff
    background #222
</style>
