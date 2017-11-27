import { storeCreator } from '../reduxMe'

export const updatNum = 'updatNum'
export const concatArr = 'concatArr'

const numState = {
  num: 0,
}

const arrState = {
  arr: [1],
}

const initialState = {
  first: numState,
  second: arrState,
}

const syncs = [{
  namespace: 'first',
  name: updatNum,
  method: (state, data) => ({
    num: data,
  }),
}]

const asyncs = [{
  namespace: 'second',
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

const storePkg = storeCreator(initialState, syncs, asyncs)
export const actions = storePkg.actions
export const store = storePkg.store

