import React, { Component } from 'react'
import { connect } from 'react-redux'

import Task from '../components/TaskBoard/Task'
import {
  clearError,
  acceptTaskUI,
  finishTaskUI,
  rewardTaskUI
} from '../actions/tasks'
import { contributeActivity, stageChangeActivity } from '../actions/activities'
class TaskContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      points: 0,
      error: false
    }
  }

  handleAcceptTask = () => {
    console.log('Task accepted')
    const { dispatch } = this.props
    dispatch(stageChangeActivity(this.props.task, 1))
    dispatch(acceptTaskUI(this.props.task))
  }

  handleFinishTask = () => {
    console.log('Task finished')
    const { dispatch } = this.props
    dispatch(stageChangeActivity(this.props.task, 3))
    dispatch(finishTaskUI({ task: this.props.task }))
  }

  handleRewardTask = () => {
    console.log('Task rewarded')
    const { dispatch } = this.props
    dispatch(stageChangeActivity(this.props.task, 4))
    dispatch(rewardTaskUI(this.props.task))
  }

  handleOpen = newPoints => {
    const id = 'star' + this.props.task.id
    var el = document.getElementById(id)
    if (parseInt(el.innerHTML))
      this.setState({ points: this.state.points + newPoints })
    else {
      this.setState({ points: newPoints })
      el.style.backgroundImage = 'linear-gradient( 130deg,#00B4E6,#00F0E0 )'
      el.style.color = 'white'
      el.style.paddingTop = '6px'
      el.style.fontSize = '13px'
    }
  }
  mouseLeaveHandler = () => {
    if (
      parseInt(this.props.task.tokens) !==
      parseInt(this.props.task.tokens) + parseInt(this.state.points)
    ) {
      const { dispatch } = this.props
      dispatch(contributeActivity(this.props.task, this.state.points))

      const id = 'star' + this.props.task.id
      var el = document.getElementById(id)
      el.style.background = 'white'
      el.style.color = '#00CBE6'
      el.style.paddingTop = '3px'
      this.setState({ points: 0 })
    }
  }
  drag = ev => {
    ev.dataTransfer.setData('dragged', ev.target.id)
    ev.target.style.visibility = 'hidden'
  }

  dragEnd = ev => {
    ev.target.style.visibility = 'visible'
  }

  clearError = () => {
    const { dispatch } = this.props
    dispatch(clearError(this.props.task, 4))
  }

  render() {
    const error = this.props.errors.filter(
      er => er.id === this.props.task.id
    )[0]
    return (
      <Task
        error={error}
        clearError={this.clearError}
        user={this.props.currentUser}
        points={this.state.points}
        onMouseLeave={this.mouseLeaveHandler}
        onAcceptTask={this.handleAcceptTask}
        onFinishTask={this.handleFinishTask}
        onRewardTask={this.handleRewardTask}
        onOpenClick={this.handleOpen}
        isOpen={this.state.isOpen}
        task={this.props.task}
        drag={this.drag}
        dragEnd={this.dragEnd}
        onEditTaskClick={this.props.onEditTaskClick}
      />
    )
  }
}
const mapStateToProps = state => ({
  currentUser: state.tasks.currentUser,
  errors: state.tasks.errors
})
export default connect(mapStateToProps)(TaskContainer)
