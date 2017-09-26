import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

const middlewares = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(createLogger())
}

const createAppStore = (reducer, mws) => {
  const createStoreWithMW = applyMiddleware(...mws)(createStore)
  return createStoreWithMW(reducer)
}

export const storeCreator = (initialState, syncs, asyncs) => {
  const actionCreators = {} // action的所有action函数
  const reducerHandlers = {} // 异步action对应的state处理函数

  const handleAction = (handlers, actionVal, isAsync) => {
    const { method, name } = actionVal
    let actionType = name.toUpperCase() // action的type名

    if (isAsync) actionType += '_ASYNC'

    handlers[actionType] = (state, action) => { // eslint-disable-line
      const nextState = method(state, action.data)
      return Object.assign({}, state, nextState)
    }

    return actionType
  }

  syncs.forEach((val) => { // 添加同步action和reducer处理函数
    const actionType = handleAction(reducerHandlers, val)

    actionCreators[val.name] = (data) => ({
      type: actionType,
      data,
    })
  })

  if (asyncs) { // 添加异步action和reducer处理函数
    asyncs.forEach((val) => {
      const actionType = handleAction(reducerHandlers, val, true)
      const { name, launch } = val
      actionCreators[name] = (param) => (
        (dispatch) => {
          launch(param).then((data) => {
            dispatch({
              type: actionType,
              data,
            })
          })
        }
      )
    })
  }

  const createReducer = (initState, handlers) => ( // reducer生成函数
    (state = initState, action) => {
      const actionType = action.type
      if (handlers[actionType]) {
        return handlers[actionType](state, action)
      }
      return state
    })

  const reducer = createReducer(initialState, reducerHandlers)
  const store = createAppStore(reducer, middlewares)
  return {
    actions: actionCreators,
    store,
  }
};

export const connectMe = (component, keys, actions) => {
  const mapStateToProps = (state) => {
    const propsStore = {}
    keys.forEach((key) => {
      propsStore[key] = state[key]
    })
    return propsStore;
  }

  const mapDispatchtoProps = (dispatch) => (
    bindActionCreators(actions, dispatch)
  )

  return connect(mapStateToProps, mapDispatchtoProps)(component)
}

export const renderProvider = (store, Component, containerId) => {
  const container = global.document.getElementById(containerId);
  ReactDOM.render(
    <Provider store={store}><Component /></Provider>, container);
}
