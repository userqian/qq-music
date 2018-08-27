<template>
  <div class="tab">
    <router-link to='/recommend' tag='div' class='tab-item'>推荐</router-link>
    <router-link to='/singer' tag='div' class='tab-item'>歌手</router-link>
    <router-link to='/rank' tag='div' class='tab-item'>排行</router-link>
    <router-link to='/search' tag='div' class='tab-item'>搜索</router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  .tab
    display flex
    height 40px
    line-height 40px
    .tab-item
      width 25%
      text-align center
    .router-link-active
      color #31c27c
</style>
