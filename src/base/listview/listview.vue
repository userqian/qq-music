<template>
  <scroll ref="listView"
          :probeType='3'
          @posY='singerScroll'
          :listenScroll=listenScroll>
    <ul>
      <li class="list-group" v-for="(item, index) in list" :key="index"  ref="listGroup">
        <h1 class="title">{{item.title}}</h1>
        <ul>
          <li class="list-group-item" @click='selectItem(data)'  v-for="(data, index) in item.item" :key="index">
            <img v-lazy="data.avatar" class="avatar">
            <span class="name">{{data.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="shortCutList">
      <li v-for="(item, index) in shortCutList"
          :key="index"
          class="shortCut"
          @touchstart='touchStartShortCut(index, $event)'
          @touchmove.prevent.stop='touchMoveShortCut'
          :class="{active: index === pageIndex}">
        {{item}}
      </li>
    </ul>
    <div class="fixed-title" ref="fixedTitle">
      <h1 class="title">{{fixedTitle}}</h1>
    </div>
    <loading v-if="!list.length"></loading>
  </scroll>
</template>

<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
const SHORT_HEIGHT = 16
const TITLE_HEIGHT = 30
export default {
  props: {
    list: {
      type: Array
    }
  },
  created() {
    this.touches = {}
    this.listHeight = []
  },
  data() {
    return {
      pageIndex: 0,
      listenScroll: true,
      scrollY: -1,
      diff: -1
    }
  },
  computed: {
    shortCutList() {
      return this.list.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (!this.scrollY > 0) {
        return ''
      }
      return this.list[this.pageIndex] ? this.list[this.pageIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.listView.refresh()
    },
    // 左右列表滚动
    touchStartShortCut(index, e) {
      // 点击右侧时候 记录下当前的index 当前pageY
      let touch = this.touches
      touch.fristY = e.touches[0].pageY
      touch.pageIndex = index
      this._scroll(index)
    },
    touchMoveShortCut(e) {
      // 滑动右侧时候 计算当前pageY 减去上次y的值 除去每个高度 算出滑了几个
      let touch = this.touches
      let pageIndex = touch.pageIndex
      touch.sencodeY = e.touches[0].pageY
      let size = (touch.sencodeY - touch.fristY) / SHORT_HEIGHT
      let index = parseInt(size) + parseInt(pageIndex)
      this._scroll(index)
    },
    _scroll(index) {
      // 利用scroll组件滚动 添加高亮
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
      this.pageIndex = index
    },
    singerScroll(pos) {
      // 获取scroll组件传来的活动左侧时候的位置
      let y = Math.abs(pos.y)
      this.scrollY = y
    },
    _getSingerListHeight() {
      // 获取左侧列表高度
      let listHeight = []
      let height = 0
      let list = this.$refs.listGroup
      listHeight.push(height)
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        height += item.clientHeight
        listHeight.push(height)
      }
      this.listHeight = listHeight
    }
  },
  watch: {
    list(val) {
      if (val) {
        setTimeout(() => {
          this._getSingerListHeight()
        }, 20)
      }
    },
    scrollY(val) {
      // 监听滚动的值 判断在哪个高度区间 对应右边的index
      let list = this.listHeight
      // 顶部滚动
      if (val < 0) {
        this.pageIndex = 0
      }
      // 中间滚动
      for (let i = 0, len = list.length - 1; i < len; i++) {
        let h1 = list[i]
        let h2 = list[i + 1]
        if (val >= h1 && val < h2) {
          this.pageIndex = i
          this.diff = h2 - val
          // console.log(this.diff)
          return
        }
      }
      // 底部滚动
      this.pageIndex = list.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    scroll,
    loading
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.list-group{
  width 100%
  padding-bottom 30px
  .title{
    width 100%
    height 30px
    line-height 30px
    padding-left 20px
    font-size 14px
    background #eee
  }
  .list-group-item{
    display flex
    width 100%
    padding-left 30px
    margin-top 20px
    box-sizing border-box
    .avatar{
      flex 0 0 50px
      width 50px
      height 50px
      border-radius 50%
      margin-right 20px
    }
    .name{
      line-height 50px
    }
  }
}
.shortCutList{
  position fixed
  top 50%
  right 10px
  transform translateY(-40%)
  background rgba(100,100,100,.2)
  border-radius 8px
  padding 5px 3px
  z-index 10
  .shortCut{
    font-size 12px
    height 16px
    line-height 16px
    text-align center
    color #666
    &.active{
      color #31c27c
    }
  }
}
.fixed-title{
  position absolute
  top 0
  left 0
  width 100%
  height 30px
  line-height 30px
  padding-left 20px
  font-size 14px
  background #eee
}
</style>
