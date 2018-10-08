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
    <suggest :query='query' v-show="query" v-on:select='saveSelect'></suggest>
    <div class="search-history">
      <div class="search-header">
        <h1 class="title">搜索历史</h1>
        <i class="icon-clear"></i>
      </div>
      <searchHistory></searchHistory>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import searchHistory from 'base/search-history/search-history'
import SearchBox from 'base/search-box/search-box'
import Suggest from 'base/suggest/suggest'
import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config.js'
import {mapActions} from 'vuex'
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
    },
    saveSelect() {
      this.searchHistory(this.query)
    },
    ...mapActions({
      searchHistory: 'searchHistory'
    })
  },
  components: { 
    SearchBox,
    Suggest,
    searchHistory
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
