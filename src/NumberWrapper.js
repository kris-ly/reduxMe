import React from 'react';
import PropTypes from 'prop-types'
import { connectMe } from '../reduxMe'
import { actions, addNum, concatArr } from './store.js'

class NumberWrapper extends React.Component {
  handleChange = () => {
    this.props.updateNum(1)
  }

  handleConcat = () => {
    this.props.concatArr(2000)
  }

  render() {
    const { num, arr } = this.props
    return (
      <div>
        <div>{num}</div>
        <button onClick={this.handleChange}>改变</button>
        <div>{JSON.stringify(arr)}</div>
        <button onClick={this.handleConcat}>追加</button>
      </div>
    )
  }
}

NumberWrapper.propTypes = {
  num: PropTypes.number.isRequired,
  arr: PropTypes.array.isRequired,
  updateNum: PropTypes.func.isRequired,
  concatArr: PropTypes.func.isRequired,
};

export default connectMe(NumberWrapper, ['num', 'arr'], {
  updateNum: actions[addNum],
  concatArr: actions[concatArr],
});
