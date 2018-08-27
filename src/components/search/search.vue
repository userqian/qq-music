<template>
  <div class="search">
    <search-box ref="searchBox" @query='onQueryChage'></search-box>
    <div class="hot-search" v-show="!query">
      <h1 class="title">热门搜索</h1>
      <ul class="hot-search-list">
        <li class="item" v-for="item in hotKey" :key="item.n" @click="searchQuery(item.k)">
          <span>{{item.k}}</span>
        </li>
      </ul>
    </div>
    <suggest :query='query' v-show="query"></suggest>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'base/suggest/suggest'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
export default {
  created() {
    this._getHotKey()
  },
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    searchQuery(k) {
      this.$refs.searchBox.searchQuery(k)
    },
    onQueryChage(query) {
      this.query = query
    }
  },
  components: { 
    SearchBox,
    Suggest
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .search
    .hot-search
      margin-top 20px
      .title
        margin-bottom 15px
        margin-left 15px
        color rgba(0,0,0,.6)
        font-size 14px
        font-weight bold
      .hot-search-list
        width 100%
        display flex
        flex-wrap wrap
        .item
          padding 5px 7px
          border 1px solid rgba(0,0,0,.6)
          border-radius 99px
          margin 0 8px 10px 10px
          font-size 14px
</style>
