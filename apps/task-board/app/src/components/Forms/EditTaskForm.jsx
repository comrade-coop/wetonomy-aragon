import React from 'react'
import PropTypes from 'prop-types'
import BaseTaskForm from "./BaseTaskForm"
import {PROJCETS} from '../../utils/dummyDataProvider'

class EditTaskForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.selectedTask.id,
      workField: this.props.selectedTask.workField,
      heading: this.props.selectedTask.heading,
      description: this.props.selectedTask.description,
      project: PROJCETS.indexOf(this.props.selectedTask.project),
      tags: this.props.selectedTask.tags,
      difficulty: this.props.selectedTask.difficulty,
      column: this.props.selectedTask.column || 0,
      tokens: this.props.selectedTask.tokens || 0,
      tag: '',
      error: null
    }
  }

  render() {
    return (
			<BaseTaskForm 
				delete = {true}
				handleNewTask={this.props.handleNewTask}
				handleDeleteTask = {this.props.handleDeleteTask}
        onClose={this.props.onClose}
        state = {this.state}
      />
    )
  }
}

EditTaskForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default EditTaskForm