import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { addTask } from '../actions/panel'
import ScreenAction from '../components/Top/ScreenAction'

class TaskActionContainer extends Component { 

  handleNewTask = () => {
    const { dispatch } = this.props
    dispatch(addTask())
  }

  render() {
    return (
      <ScreenAction
        onNewTaskClick={this.handleNewTask} />
    )
  }  
}

export default withRouter(connect()(TaskActionContainer))
