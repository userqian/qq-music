<template>
<transition name="slider">
  <div class="singer-detail">
    <music-list :title="title" :bgImg="bgImg" :songList="song"></music-list>
  </div>
</transition>
</template>

<script>
import musicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import {createData, isValidMusic, processSongsUrl} from 'common/js/song.js'
export default {
  computed: {
    title() {
      return this.singer.name
    },
    bgImg() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      song: []
    }
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._nomalSoneList(res.data.list)).then((songs) => {
            this.song = songs
            console.log('songs')
          })
        }
      })
    },
    _nomalSoneList(list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
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
  .slider-enter-active, .slider-leave-active {
    transition all .3s
  }
  .slider-enter, .slider-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform translate3d(100%, 0, 0)
  }

  .singer-detail
    position fixed
    top 0px
    left 0px
    right 0px
    bottom 0px
    z-index 100
    background #222
</style>
