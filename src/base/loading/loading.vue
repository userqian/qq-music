<template>
  <div class="loading">
    <img src="./loading.gif">
    <p>{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .loading
    width 100%
    text-align center
    margin-top 50px
    img
      width 45px
    p
      font-size 12px
      line-height 20px
</style>
