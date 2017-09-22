# reduxMe

> 该分支支持combineReducers

## 简介

对redux及react-redux做一层封装，使其用法更加简单。

仓库整体是个用法例子，也是该封装的一种较好的实践。

查看效果：
```
$ yarn install # 安装依赖
$ yarn start # 打开浏览器，在http://localhost:8080/ 查看
```

> `src/reduxMe.js`是对redux和react-redux的封装

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

目前包含的action类型有: `update`和`concat`

- update: 更新（更改）
- concat: 数组的连接

例如：

```javascript
const syncs = [{
  namespace: 'first', // 修改对应的state
  item: 'num', // 此action修改state对应的key
  method: 'update', // action的操作
}]
```
3. `asyncs[Array]`：对state的异步操作，跟master分支相比，增加了namespace

所含action类型同上

例如：

```javascript
const syncs = [{
  namespace: 'second',
  item: 'arr',
  action: 'concat',
  launch: [function], // 为异步操作的数据流方法，返回一个Promise，在resolve中传递action的payload
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

### 3. generateAction

获取action生成函数的函数名，输入比master多一个namespace

输入输入：`(namespace, method, key, isAsync) => actionName[String]`

- `key[String]`：改变对应的state
- `method[String]`: action的操作：update、concat
- `key[String]`：改变state对应key
- `isAsync[boolean]`：是否是异步action

### 4. renderProvider

对react-redux的Provider和react-dom中render方法的封装

输入：`(store, Component, containerId)`

- `store[Object]`： app的store
- `Component[react组件]`：包在Provider中的smart component
- `containerId`：html文件中挂载react组件的html元素的id
