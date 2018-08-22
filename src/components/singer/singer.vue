<template>
  <div class="singer" ref='singer'>
    <list-view :list='singerList' @select='selectSinger' ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import { getSingerList } from 'api/singer.js'
import Singer from 'common/js/singer.js'
import listView from 'base/listview/listview'
import {playingMinxi} from 'common/js/minxi'
const TITLE_NAME = '热门'
const HOT_LENGTH = 10
export default {
  mixins: [playingMinxi],
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlayList(list) {
      let bottom = list.length > 0 ? '60px' : 0
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(item) {
      this.$router.push({
        path: '/singer/' + item.id
      })
      this.setSinger(item)
    },
    _getSingerList() {
      getSingerList()
        .then(res => {
          this.singerList = this._nomalSingerList(res.data.list)
        })
        .catch(err => {
          console.log(err)
        })
    },
    _nomalSingerList(singerList) {
      let list = singerList
      let map = {
        hot: {
          title: TITLE_NAME,
          item: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_LENGTH) {
          map.hot.item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          }
        }
        map[key].item.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === TITLE_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    listView
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .singer{
    position fixed
    top 84px
    left 0
    bottom 0
    width 100%
  }
</style>
