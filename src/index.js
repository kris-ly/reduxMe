import NumberWrapper from './NumberWrapper.js'
import { renderProvider } from '../reduxMe'
import { store } from './store.js'

renderProvider(store, NumberWrapper, 'container');
