import { storeCreator } from './reduxMe.js'

/*
todo = {
  content: String,
  isComplete: Boolean,
}
 */

const todoState = {
  todos: [],
}

const syncs = [{
  item: 'todos',
  method: 'update',
}, {
  item: 'todos',
  method: 'concat',
}]

const storePkg = storeCreator(todoState, syncs)

export default storePkg;
