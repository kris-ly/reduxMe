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

export const generateAction = (method, key, isAsync) => { // 生成对应的
  if (isAsync) return `${method}${key}async`
  return method + key;
}

export const storeCreator = (initialState, syncs, asyncs) => {
  const actionTypeToItem = {} // 映射actionType改变对应state的key
  const syncActions = {} // 同步action的所有action函数
  const syncHandlers = {} // 同步action对应的state处理函数
  const asyncActions = {} // 异步action的所有action函数
  const asyncHandlers = {} // 异步action对应的state处理函数

  syncs.forEach((val) => { // 添加同步action和reducer处理函数
    const { method, item } = val
    const actionName = generateAction(method, item) // action生成方法的名字
    const actionType = `${method.toUpperCase()}_${item.toUpperCase()}` // action的type名

    actionTypeToItem[actionType] = item
    syncActions[actionName] = (data) => ({
      type: actionType,
      data,
    })

    if (method === 'concat') {
      syncHandlers[actionType] = (state, action, key) => (
        Object.assign({}, state, {
          [key]: state[key].concat(action.data),
        })
      )
    } else {
      syncHandlers[actionType] = (state, action, key) => (
        Object.assign({}, state, {
          [key]: action.data,
        })
      )
    }
  })

  if (asyncs) { // 添加异步action和reducer处理函数
    asyncs.forEach((val) => {
      const { method, item, launch } = val
      const actionName = generateAction(method, item, true)
      const actionType = `${method.toUpperCase()}_${item.toUpperCase()}_ASYNC`

      actionTypeToItem[actionType] = item
      asyncActions[actionName] = (param) => (
        (dispatch) => {
          launch(param).then((data) => {
            dispatch({
              type: actionType,
              data,
            })
          })
        }
      )

      if (method === 'concat') {
        asyncHandlers[actionType] = (state, action, key) => (
          Object.assign({}, state, {
            [key]: state[key].concat(action.data),
          })
        )
      } else {
        asyncHandlers[actionType] = (state, action, key) => (
          Object.assign({}, state, {
            [key]: action.data,
          })
        )
      }
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

  const reducer = createReducer(initialState, Object.assign({}, syncHandlers, asyncHandlers))

  return {
    actions: Object.assign({}, syncActions, asyncActions),
    store: createAppStore(reducer, middlewares),
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
