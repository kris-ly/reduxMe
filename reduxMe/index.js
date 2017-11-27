import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux'
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

export const generateAction = (namespace, method, key, isAsync) => { // 生成对应的
  if (isAsync) return `${namespace}${method}${key}async`
  return namespace + method + key;
}

export const storeCreator = (states, syncs, asyncs) => {
  const actionTypeToItem = {} // 映射actionType改变对应state的key
  const actionCreators = {} // 所有action生成函数
  const reducerHandlers = {} // 区分namespace的state处理函数

  const handleAction = (handlers, actionVal, isAsync) => {
    const { namespace, method, name } = actionVal
    let actionType = `${namespace.toUpperCase()}_${name.toUpperCase()}`
    if (isAsync) actionType += '_ASYNC'
    if (!handlers[namespace]) handlers[namespace] = {} // eslint-disable-line

    handlers[namespace][actionType] = (state, action) => { // eslint-disable-line
      const nextState = method(state, action.data)
      return Object.assign({}, state, nextState)
    }

    return actionType;
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
        return handlers[actionType](state, action, actionTypeToItem[actionType])
      }
      return state
    })

  const reducers = {}
  const stateEntries = Object.entries(states)
  stateEntries.forEach((entry) => {
    reducers[entry[0]] = createReducer(entry[1], reducerHandlers[entry[0]])
  })

  const store = createAppStore(combineReducers(reducers), middlewares)
  console.log(store.getState(), actionCreators)
  return {
    actions: actionCreators,
    store,
  }
};

export const connectMe = (component, keys, actions) => {
  const mapStateToProps = (state) => {
    const propsStore = {}
    const keyEntries = Object.entries(keys)

    keyEntries.forEach((entry) => {
      entry[1].forEach((key) => {
        propsStore[key] = state[entry[0]][key]
      })
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
