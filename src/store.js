import { storeCreator } from './reduxMe.js'

const initialState = {
  num: 0,
  arr: [1],
}

const syncs = [{
  item: 'num',
  method: 'update',
}]

const asyncs = [{
  item: 'arr',
  method: 'concat',
  launch: (delay) => (
    new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([2])
      }, delay)
    })
  ),
}]

const storePkg = storeCreator(initialState, syncs, asyncs)

export default storePkg;
