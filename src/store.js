import { storeCreator } from './reduxMe.js'

const initialState = {
  num: 0,
  arr: [1],
}

export const addNum = 'addNum'
export const concatArr = 'concatArrAsync'

const syncs = [{
  name: addNum,
  method: (state, data) => ({
    num: state.num + data,
    arr: state.arr.concat([data]),
  }),
}]

const asyncs = [{
  name: concatArr,
  method: (state, data) => ({
    arr: state.arr.concat(data),
  }),
  launch: (delay) => (
    new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([2])
      }, delay)
    })
  ),
}]

export const storePkg = storeCreator(initialState, syncs, asyncs);
