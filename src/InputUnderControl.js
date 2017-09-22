import React from 'react';

class InputUnderControl extends React.component {
  state = {
    val: '',
  }

  handleChange = (e) => {
    this.setState({
      val: e.target.value,
    })
  }

  render() {
    return <input value={this.state.val} type={'text'} onChange={this.handleChange} placeholder={'老子今天要搞点事情...'} />
  }
}

export default InputUnderControl;
