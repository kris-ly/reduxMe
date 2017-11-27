import React from 'react';
import PropTypes from 'prop-types'
import { connectMe } from '../reduxMe'
import { actions, updatNum, concatArr } from './store.js'

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

const stateProps = {
  first: ['num'],
  second: ['arr'],
}

const actionProps = {
  updateNum: actions[updatNum],
  concatArr: actions[concatArr],
}

export default connectMe(NumberWrapper, stateProps, actionProps);
