import Todos from './Todos.js'
import { renderProvider } from '../reduxMe'
import { store } from './store.js'

renderProvider(store, Todos, 'container');
