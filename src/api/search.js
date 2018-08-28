import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'
import Axios from 'axios'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParam, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search(page, query, zhida, perpage) {
  const url = '/api/search'
  const data = Object.assign({}, commonParam, {
    p: page,
    w: query,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    uin: 0,
    format: 'json',
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all'
  })
  
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
