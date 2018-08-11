<template>
  <div class="music-list">
    <div class="head">
      <div class="bank">
        <i class="icon-bank"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div class="container">
      <div class="bg-img">
        <img :src="bgImg" alt="">
      </div>
      <div class="play-box">
        <i class="icon-play"></i>
        <span>随机播放全部</span>
      </div>
      <ul class="song-list">
        <li class="song-item" v-for="(item, index) in songList" :key="index">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{item.singer}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
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
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.music-list
    .head
      display flex

</style>
