import React from 'react';
import PropTypes from 'prop-types'
import { connectMe, generateAction } from './reduxMe.js'
import storePkg from './store.js'

const { actions } = storePkg

class Todos extends React.Component {
  state = {
    val: '',
  }

  handleChange = (e) => {
    this.setState({
      val: e.target.value,
    })
  }

  handleAdd = () => {
    const content = this.state.val.trim()
    const { addTodo } = this.props

    if (!content) return
    const newItem = [{
      content,
      isComplete: false,
    }]
    addTodo(newItem)
    this.setState({
      val: '',
    })
  }


  handleComplete = (idx) => {
    const { todos, completeTodo } = this.props
    const todoItem = todos[idx]
    todoItem.isComplete = !todoItem.isComplete
    const newTodos = [...todos.slice(0, idx), todoItem, ...todos.slice(idx + 1)]
    completeTodo(newTodos)
  }

  render() {
    const { todos } = this.props
    return (
      <div>
        <input
          value={this.state.val}
          type={'text'}
          onChange={this.handleChange}
          placeholder={'老子今天要搞点事情...'}
        />
        <button onClick={this.handleAdd}>确定</button>
        <div>
          {!todos.length ? null :
            todos.map((todo, idx) => (
              <div key={`todo_${idx}`}>
                <input
                  type={'checkbox'}
                  checked={todo.isComplete}
                  onChange={() => {
                    this.handleComplete(idx)
                  }}
                />
                <span
                  style={todo.isComplete ? { color: '#aaa', textDecoration: 'line-through' } : { color: '#000' }}
                >{todo.content}</span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

Todos.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.string.isRequired,
    isComplete: PropTypes.bool.isRequired,
  })).isRequired,
  addTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired,
};

export default connectMe(Todos, ['todos'], {
  addTodo: actions[generateAction('concat', 'todos')],
  completeTodo: actions[generateAction('update', 'todos')],
});
