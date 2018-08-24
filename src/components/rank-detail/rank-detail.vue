<template>
  <div class="rank-detail">
    <musci-list :title="title" :bgImg="bgImg" :songList="songList" :rank='rank'></musci-list>
  </div>
</template>

<script>
import MusciList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createData, isValidMusic, processSongsUrl} from 'common/js/song'
export default {
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.topTitle
    },
    bgImg() {
      if (this.songList.length) {
        return this.songList[0].image
      }
      return ''
    }
  },
  data() {
    return {
      songList: [],
      rank: true
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalLizeMusic(res.songlist)).then((songs) => {
            this.songList = songs
          })
        }
      })
    },
    _normalLizeMusic(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createData(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusciList
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.rank-detail
  position fixed
  top 0
  left 0
  bottom 0
  width 100%
  background #222
</style>
