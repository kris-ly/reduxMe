import { storeCreator } from './reduxMe.js'

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
  item: 'num',
  method: 'update',
}]

const asyncs = [{
  namespace: 'second',
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
