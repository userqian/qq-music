import { getSongsUrl, getLyric } from 'api/song.js'
import { ERR_OK } from 'api/config.js'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise().resolve(this.lyric)
    } 
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric!'))
        }
      })
    })
  }
}

export function createData(data) {
  return new Song({
    id: data.songid,
    mid: data.songmid,
    singer: filterSinger(data.singer),
    name: data.songname,
    album: data.albumname,
    duration: data.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    url: data.url
  })
}

function filterSinger(singer) {
  if (!singer) {
    return ''
  }
  let name = []
  singer.forEach((item) => {
    name.push(item.name)
  })
  return name.join(' / ')
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo
      midUrlInfo.forEach((info, index) => {
        let song = songs[index]
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
      })
    }
    return songs
  })
}
