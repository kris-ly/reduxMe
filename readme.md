# reduxMe

## 简介

对redux及react-redux做一层封装，使其用法更加简单。

仓库整体是个用法例子，也是该封装的一种较好的实践。

> 本分支未支持redux.combineReducers方法，feature/combineReducer支持


> 分支demo/todolist是用改封装实现的todoList，可作为借鉴


### 没想到这么就引来了reduxMe1.0，鼓掌👏。

更新log:
- 0.9：内置两种action类型：`update`、`concat`，基本满足使用要求
- 1.0：全面放开action的定义，state的改变更加灵活，不再受限


查看效果：
```
$ yarn install # 安装依赖
$ yarn start # 打开浏览器，在http://localhost:8080/ 查看
```

> `/reduxMe/index.js`是对redux和react-redux的封装

## 主要接口

### 1. storeCreator

输入输出：`(initialState, syncs, asyncs) => {storePkg}`

1. `initialState[Object]`： store的初始state

例如：
```javascript
const initialState = {
  num: 0,
  arr: [1],
}
```


2. `syncs[Array]`：对state的同步action操作

`Array`的每一项是一个`Object`，包含以下key：

- `name`：action的名字
- `method`：action对state的操作，输入输出：`(state, data) => newState Object`

例如：

```javascript
const syncs = [{
  name: 'addNum', // action的名字
  method: (state, data) => ({
    num: state.num + data,
  }), // action的操作
}]
```

3. `asyncs[Array]`：对state的异步操作

`Array`的每一项也是一个`Object`，key除了包含以上的 `name`、`method`，还有`launch`。

`launch`是异步action的数据返回函数，目前只支持了Promise的返回形式

例如：

```javascript
const syncs = [{
  name: concatArr,
  method: (state, data) => ({
    arr: state.arr.concat(data),
  }),
  launch: [function], // 为异步操作的数据流方法，返回一个Promise，在resolve中传递action的payload
}]
```

4. `storePkg[Object]`：storeCreator的返回结果

```
{
    actions: [Object], // 所有的action生成函数
    store: [Object], // store对象
}
```

### 2. connectMe

对react-redux中connect的封装，包括：mapStateToProps和mapDispatchToProps

输入输出：`(component, keys, actions) => smartComponent`

- component[react组件]：需要变成smart component的react组件
- keys[Array]：将组件所需的state中对应的keys变为组件的props
- actions[Object]：将组件所需的actions变为组件对应的props


### 3. renderProvider

对react-redux的Provider和react-dom中render方法的封装

输入：`(store, Component, containerId)`

- `store[Object]`： app的store
- `Component[react组件]`：包在Provider中的smart component
- `containerId`：html文件中挂载react组件的html元素的id
