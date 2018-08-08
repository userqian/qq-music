import Jsonp from 'jsonp'

// 定义commonJSONP函数 里面传入url，data, options
export default function commonJSONP (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    Jsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    let val = data[k] !== undefined ? data[k] : ' '
    url += `&${k}=${encodeURIComponent(val)}`
  }
  // 删除第一个&
  return url ? url.substring(1) : ''
}
