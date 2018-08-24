<template>
  <div class="rank-wrapper" ref="rank">
    <scroll :data='toplist' ref='scroll'>
      <div class="topic-menu">
        <div class="topic-item"  @click="selectItem(item)" v-for="(item, index) in toplist" :key="index">
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
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getTopList} from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import {playingMinxi} from 'common/js/minxi'
import {mapMutations} from 'vuex'

export default {
  mixins: [playingMinxi],
  data() {
    return {
      toplist: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    handlePlayList(list) {
      let bottom = list.length > 0 ? '60px' : '0'
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.toplist = res.data.topList
        }
      })
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`   
      })
      this.set_top_list(item)
    },
    ...mapMutations({
      set_top_list: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .rank-wrapper
    position: absolute;
    top: 84px;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 0;
    overflow: hidden;
    background: #efefef;
    .topic-item
      margin-bottom 10px
      background #fff
      .topic-main
        display flex
        .topic-media
          position relative
          flex 0 0 100px
          width 100px
          height 100px
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
          .title
            font-size 16px
          .song-list
            margin-top 5px
            .song-item
              width 90%
              margin-top 8px
              overflow hidden
              white-space nowrap
              text-overflow: ellipsis
              font-size 14px
</style>
