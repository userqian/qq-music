import {commonParam, options} from './config'
import commonJSONP from 'common/js/jsonp'
import axios from 'axios'

export function getRecommend () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, commonParam, {
    uin: 0
  })
  return commonJSONP(url, data, options)
}

export function getRecommendList () {
  let url = '/api/getRecommendList'
  let data = Object.assign({}, commonParam, {
    picmid: 1,
    rnd: Math.random(),
    g_tk: 842232383,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
