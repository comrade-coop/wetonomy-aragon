import React from 'react'
import PropTypes from 'prop-types'
import BaseTaskForm from "./BaseTaskForm"

const initialState = {
  id: 0,
  workField: '',
  heading: '',
  description: '',
  project: 0,
  tags: [],
  tag: '',
  column: 0,
  tokens: 0,
  difficulty: 0,
  error: null,
}

class TaskForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
    }
  }

  render() {
    return (
      <BaseTaskForm 
        delete = {false} 
        handleNewTask={this.props.handleNewTask}
        day = { this.props.day }
        onClose={this.props.onClose}
        state = {this.state}
      />
    )
  }
}

TaskForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default TaskForm