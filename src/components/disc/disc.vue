<template>
  <div class="disc" ref='disc'>
    <music-list :title="title" :bgImg="bgImg" :songList='songList'></music-list>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import musicList from 'components/music-list/music-list'
import {getSongList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
import {createData, isValidMusic, processSongsUrl} from 'common/js/song.js'
export default {
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    bgImg() {
      return this.disc.imgurl
    }
  },
  data() {
    return {
      songList: []
    }
  },
  created() {
    this._getDiscList()
  },
  methods: {
    _getDiscList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
            this.songList = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createData(musicData))
        }
      })
      return ret
    }
  },
  components: {
    musicList
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .disc
    position fixed
    top 0px
    left 0px
    right 0px
    bottom 0px
    z-index 100
    background #222
</style>
