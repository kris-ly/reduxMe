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
  const actionCreators = {} // action的所有action函数
  const reducerHandlers = {} // 异步action对应的state处理函数

  const handleAction = (handlers, actionVal, isAsync) => {
    const { method, item } = actionVal
    const actionName = generateAction(method, item, isAsync) // action生成方法的名字
    let actionType = `${method.toUpperCase()}_${item.toUpperCase()}` // action的type名
    if (isAsync) actionType += '_ASYNC'

    if (method === 'concat') {
      handlers[actionType] = (state, action, key) => ( // eslint-disable-line
        Object.assign({}, state, {
          [key]: state[key].concat(action.data),
        })
      )
    } else {
      handlers[actionType] = (state, action, key) => ( // eslint-disable-line
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
  const reducer = createReducer(initialState, reducerHandlers)

  return {
    actions: actionCreators,
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
