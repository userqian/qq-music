<template>
  <div class="rank-wrapper">
    <div class="topic-item" v-for="(item, index) in toplist" :key="index">
      <div class="topic-main">
        <div class="topic-media">
          <img :src="item.picUrl" alt="">
          <span class="listen-count">{{item.listenCount}}</span>
        </div>
        <div class="topic-info">
          <h1 class="title">{{item.topTitle}}</h1>
          <ul class="song-list">
            <li class="song-item" v-for="(song, index) in item.songList" :key="index">
              <span class="rank-index">{{index + 1}}</span>
              <span class="singer">{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getTopList} from 'api/rank'
import { ERR_OK } from 'api/config'
export default {
  data() {
    return {
      toplist: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.toplist = res.data.topList
        }
      })
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .rank-wrapper
    padding 10px
    background #efefef
    .topic-item
      margin-bottom 10px
      background #fff
      .topic-main
        display flex
        .topic-media
          position relative
          flex 0 0 100px
          img
            width 100%
          .listen-count
            position absolute
            bottom 10px 
            left 10px
            width 100%
            color #fff
            font-size 10px
        .topic-info
          flex 1
          padding 10px 0 10px 15px
</style>
