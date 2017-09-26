import { storeCreator } from './reduxMe.js'

/*
todo = {
  content: String,
  isComplete: Boolean,
}
 */

export const updateTodo = 'updateTodo'
export const addTodo = 'addTodo'

const todoState = {
  todos: [],
}

const syncs = [{
  name: updateTodo,
  method: (state, data) => {
    const { todos } = state
    const todoItem = todos[data]
    todoItem.isComplete = !todoItem.isComplete
    return {
      todos: [...todos.slice(0, data), todoItem, ...todos.slice(data + 1)],
    }
  },
}, {
  name: addTodo,
  method: (state, data) => ({
    todos: state.todos.concat(data),
  }),
}]

export const storePkg = storeCreator(todoState, syncs);
