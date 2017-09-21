import NumberWrapper from './NumberWrapper.js'
import { renderProvider } from './reduxMe.js'
import storePkg from './store.js'

const { store } = storePkg;
renderProvider(store, NumberWrapper, 'container');
