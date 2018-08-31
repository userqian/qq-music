<template>
  <div class="no-result">
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无搜索结果...'
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .no-result
    width 100%
    height 100%
    padding-top 50px
    text-align center
    .title
      color #333
      font-size 14px
</style>
