<template>
  <div class="suggest">
    <ul>
      <li v-for="item in songlist" :key="item.mid">
        <div class="icon">
          <i class="icon"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {search} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
import {processSongsUrl, isValidMusic, createData} from 'common/js/song.js'
const TYPE_SINGER = 'singer'
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
      songlist: []
    }
  },
  watch: {
    query() {
      this._search()
    }
  },
  methods: {
    _search() {
      search(this.page, this.query, this.singer).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.songlist = result
            // console.log(this.songlist)
          })
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
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  
</style>
