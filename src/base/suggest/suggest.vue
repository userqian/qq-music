<template>
  <div class="suggest" ref="suggest">
    <scroll :data='songlist' v-show="songlist.length" ref="scroll" :pullUpLoad='pullUpLoad' @scrollToEnd='searchMore'>
      <ul ref='searchList'>
        <li v-for="(item, index) in songlist" :key="index" class="search-list" @click="selectItem(item)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <span class="text" v-text="getName(item)"></span>
          </div>
        </li>
        <loading v-if="checkMore" title=''></loading>
      </ul>
    </scroll>
    <no-result v-show='!songlist.length'></no-result>
  </div>
</template>

<script>
import {search} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
import {processSongsUrl, isValidMusic, createData} from 'common/js/song.js'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import noResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    singer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      songlist: [],
      pullUpLoad: true,
      checkMore: true
    }
  },
  watch: {
    query() {
      this._search()
    }
  },
  methods: {
    _search(ispullLoad) {
      this.checkMore = true
      this.page = 1
      search(this.page, this.query, this.singer, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.songlist = result
          })
          this._checkMore(res.data)
        }
      })
    },
    _genResult(data) {
      let ret = []
      // 判断有zhida 运用扩展运算符将zhida里面的值push到ret里面，并且添加type值
      if (data.zhida && data.zhida.singerid && data.song.curpage === 1) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      return processSongsUrl(this._normallizeSong(data.song.list)).then((res) => {
        ret = ret.concat(res)
        return ret
      })
    },
    _normallizeSong(list) {
      let ret = []
      list.forEach((musicdata) => {
        if (isValidMusic(musicdata)) {
          ret.push(createData(musicdata))
        }
      })
      return ret
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return item.name + '-' + item.singer
      }
    },
    _checkMore(data) {
      let song = data.song
      if (!song.list.length || song.curnum + (song.page - 1) * song.perpage >= song.totalnum) {
        this.checkMore = false
      }
    },
    searchMore() {
      if (!this.checkMore) {
        return
      }
      this.page += 1
      search(this.page, this.query, this.singer, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.songlist = this.songlist.concat(result)
          })
          this._checkMore(res.data)
        }
      })
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.set_singer(singer)
      } else {
        this.insertSong(item)
      }
    },
    ...mapMutations({
      set_singer: 'SET_SINGER'
    }),
    ...mapActions({
      insertSong: 'insertSong'
    })
  },
  components: {
    scroll,
    loading,
    noResult
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .suggest
    position fixed
    top 134px
    bottom 0
    width 100%
    margin-top 10px
    box-sizing border-box
    .search-list
      display flex
      align-items center
      width 100%
      height 45px
      line-height 45px
      padding 0 30px
      border-bottom 1px solid #ddd
      box-sizing border-box
      .icon
        flex 0 0 30px
        width 30px
      .name
        flex 1
        font-size 14px
        height 100%
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
</style>
