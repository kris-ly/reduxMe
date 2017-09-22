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
  // const syncActions = {} // 同步action的所有action函数
  // const syncHandlers = {} // 同步action对应的state处理函数
  // const asyncActions = {} // 异步action的所有action函数
  // const asyncHandlers = {} // 异步action对应的state处理函数
  const actionCreators = {}

  const reducerHandlers = {} // 区分namespace的state处理函数

  const handleAction = (handlers, actionVal, isAsync) => {
    const { namespace, method, item } = actionVal
    const actionName = generateAction(namespace, method, item, isAsync)
    let actionType = `${namespace.toUpperCase()}_${method.toUpperCase()}_${item.toUpperCase()}`
    if (isAsync) actionType += '_ASYNC'
    if (!handlers[namespace]) handlers[namespace] = {} // eslint-disable-line

    if (method === 'concat') {
      handlers[namespace][actionType] = (state, action, key) => ( // eslint-disable-line
        Object.assign({}, state, {
          [key]: state[key].concat(action.data),
        })
      )
    } else {
      handlers[namespace][actionType] = (state, action, key) => ( // eslint-disable-line
        Object.assign({}, state, {
          [key]: action.data,
        })
      )
    }
    return {
      actionName,
      actionType,
    }
  }

  syncs.forEach((val) => { // 添加同步action和reducer处理函数
    const { actionName, actionType } = handleAction(reducerHandlers, val)
    actionTypeToItem[actionType] = val.item
    actionCreators[actionName] = (data) => ({
      type: actionType,
      data,
    })
  })

  if (asyncs) { // 添加异步action和reducer处理函数
    asyncs.forEach((val) => {
      const { actionName, actionType } = handleAction(reducerHandlers, val, true)
      const { item, launch } = val

      actionTypeToItem[actionType] = item
      actionCreators[actionName] = (param) => (
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

  // console.log(store.getState(), actionCreators)
  return {
    actions: actionCreators,
    store: createAppStore(combineReducers(reducers), middlewares),
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
