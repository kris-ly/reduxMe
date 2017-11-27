# reduxMe

> 该分支支持combineReducers

## 简介

对redux及react-redux做一层封装，使其用法更加简单。

仓库整体是个用法例子，也是该封装的一种较好的实践。

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

1. `initialState[Object]`： store的初始state，与master分支的不同

initialState的key为各个reducer的namespace， value才是各个reducer的initialState, 即以namespace区分不同的reducer。

例如：
```javascript
const numState = {
  num: 0,
}

const arrState = {
  arr: [1],
}

const initialState = {
  first: numState,
  second: arrState,
}
```


2. `syncs[Array]`：对state的同步操作，跟master分支相比，增加了namespace

例如：

```javascript
const syncs = [{
  namespace: 'first',
  name: updatNum,
  method: (state, data) => ({
    num: data,
  }),
}]
```
3. `asyncs[Array]`：对state的异步操作，跟master分支相比，增加了namespace

例如：

```javascript
const asyncs = [{
  namespace: 'second',
  name: concatArr,
  method: (state, data) => ({
    arr: state.arr.concat(data),
  }),
  launch: (delay) => (
    new Promise((resolve) => {
      window.setTimeout(() => {
        resolve([2])
      }, delay)
    })
  ),
}]
```

4. `storePkg[Object]`：storeCreator的返回结果

```
{
    actions: , // 所有的action生成函数
    store: , // store对象
}
```

### 2. connectMe

对react-redux中connect的封装，包括：mapStateToProps和mapDispatchToProps

输入输出：`(component, keys, actions) => smartComponent`

1. component[react组件]：需要变成smart component的react组件
2. keys[Object]：将组件所需的state中对应的keys变为组件的props
  > 与master分支不同，不是Array类型，得添加namespace字段，形如：{ [namespace]: Array }

例如：

```javascript

{
  first: ['num'],
  second: ['arr'],
}
```

3. actions[Object]：将组件所需的actions变为组件对应的props

### 3. renderProvider

对react-redux的Provider和react-dom中render方法的封装

输入：`(store, Component, containerId)`

- `store[Object]`： app的store
- `Component[react组件]`：包在Provider中的smart component
- `containerId`：html文件中挂载react组件的html元素的id
