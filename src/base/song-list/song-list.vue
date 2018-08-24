<template>
  <ul class="song-list">
    <li class="song-item" @click="selectItem(item, index)" v-for="(item, index) in songList" :key="index">
      <div class="rank" v-show="rank">
        <span :class="rankImg(index)" v-text="rankText(index)"></span>
      </div>
      <div class="info">
        <h2 class="name">{{item.name}}</h2>
        <p class="desc">{{item.singer}} · {{item.album}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songList: {
      type: Array,
      default() {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('selectItem', item, index)
    },
    rankImg(index) {
      if (index <= 2) {
        return `icon${index + 1}`
      } else {
        return 'text'
      }
    },
    rankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/mixin"
.song-list
  .song-item
    display flex
    margin-bottom 30px
    color #fff
    font-size 14px
    align-items center
    &:last-child
      margin-bottom 0
    .rank
      flex 0 0 25px
      width 25px
      height 25px
      margin-right 30px
      text-align center
      span
        display block
        width 100%
        height 100%
        &.icon1
          bg-image('./first')
        &.icon2
          bg-image('./second')
        &.icon3
          bg-image('./third')
        &.text
          color: #ffcd32;
          font-size: 18px;
    .info
      flex 1
      .name, .desc
        width 100%
        margin-top 10px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .desc
        color rgba(255,255,255,0.3)
</style>
