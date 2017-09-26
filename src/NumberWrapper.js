import React from 'react';
import PropTypes from 'prop-types'
import { connectMe } from './reduxMe.js'
import { storePkg, addNum, concatArr } from './store.js'

const { actions } = storePkg

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
        <div onClick={this.handleChange}>改变</div>
        <div>{JSON.stringify(arr)}</div>
        <div onClick={this.handleConcat}>追加</div>
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
