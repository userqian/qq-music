import storage from 'good-storage'

const NAME = '_serarch_'
const MAXLENGTH = 15

function saveArray(arr, query, compaer, max) {
  let index = arr.findIndex(compaer)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(query)
  if (max && arr.length > max) {
    arr.pop()
  }
  return arr
}

export function saveStorage(query) {
  let arr = storage.get(NAME) ? storage.get(NAME) : []
  let searchArray = saveArray(arr, query, (item) => {
    return item === query
  }, MAXLENGTH)
  storage.set(NAME, searchArray)
  return searchArray
}
