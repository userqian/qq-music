<template>
  <ul class="song-list">
    <li class="song-item" v-for="(item, index) in songList" :key="index">
      <h2 class="name">{{item.name}}</h2>
      <p class="desc">{{item.singer}} · {{item.album}}</p>
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
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.song-list
  .song-item
    margin-bottom 30px
    color #fff
    font-size 14px
    .name, .desc
      width 100%
      margin-top 10px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .desc
      color rgba(255,255,255,0.3)
</style>
