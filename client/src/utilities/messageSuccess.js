import React, { Component } from 'react';

export default class MessageSuccess extends Component{
  render(){
    const {msg} = this.props;
    return(
      <div className="alert alert-success">
        {msg}
      </div>
    )
  }
}