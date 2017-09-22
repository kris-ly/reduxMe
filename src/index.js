import Todos from './Todos.js'
import { renderProvider } from './reduxMe.js'
import storePkg from './store.js'

const { store } = storePkg;
renderProvider(store, Todos, 'container');
