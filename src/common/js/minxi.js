import {mapGetters} from 'vuex'

export const playingMinxi = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    console.log(this.playList)
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(val) {
      this.handlePlayList(val)
    }    
  },
  methods: {
    handlePlayList(playlist) {
      throw new Error('没有使用hanlePlayLiat函数!')
    }
  }
}
