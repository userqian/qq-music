<template>
  <div class="search-box">
    <div class="search-form">
      <span class="icon-search"></span>
      <input type="text" v-model="query" class="search-input" :placeholder="placeholder">
      <div v-if="query" @click="clear" class="icon-dismiss"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  created() {
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery)
    })
  },
  methods: { 
    clear() {
      this.query = ''
    },
    searchQuery(k) {
      this.query = k
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .search-box
    width 100%
    padding 10px 0
    background #f4f4f4
    box-sizing border-box
    .search-form
      position relative
      width 80%
      margin 0 auto
      background #fff
      padding 15px 0
      .icon-search
        position absolute
        top 4px
        left 5px
        z-index 1
        font-size 24px
        color #ddd
      .icon-dismiss
        position: absolute;
        top: 7px;
        right: 5px;
        z-index: 1;
        font-size: 18px;
        color: #ddd;
      .search-input
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        line-height 30px
        outline none
        padding-left 30px
        color rgba(0,0,0,.3)
        font-size 14px
        box-sizing border-box
        &::placeholder
          color rgba(0,0,0,.3)
</style>
