<template>
  <ul class="song-list">
    <li class="song-item" @click="selectItem(item, index)" v-for="(item, index) in songList" :key="index">
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
  },
  methods: {
    selectItem(item, index) {
      this.$emit('selectItem', item, index)
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
    &:last-child
      margin-bottom 0
    .name, .desc
      width 100%
      margin-top 10px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .desc
      color rgba(255,255,255,0.3)
</style>
