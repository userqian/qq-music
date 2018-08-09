<template>
  <div class="singer">
    <list-view :list='singerList'></list-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer.js'
import Singer from 'common/js/singer.js'
import listView from 'base/listview/listview'
const TITLE_NAME = '热门'
const HOT_LENGTH = 10
export default {
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
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
    }
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
    z-index -1
  }
</style>
