import React from 'react'
import { SidePanel } from '@aragon/ui'
import PropTypes from 'prop-types'

import TaskForm from './Forms/TaskForm'
import EditTaskForm from './Forms/EditTaskForm'
export const PanelMode = {
  BASE: 0,
  ADD: 1,
  EDIT: 2,
}
class TaskPanel extends React.Component {
  getPanelContent = () => {
    switch (this.props.mode) {      
      case PanelMode.ADD: {
        return (
          <TaskForm
            onClose={this.props.onClose}            
            handleNewTask={this.props.handleNewTask}  />
        )
      }
      case PanelMode.EDIT: {
        return (
          <EditTaskForm 
            selectedTask = {this.props.selectedTask}
            onClose={this.props.onClose}
            handleDeleteTask = {this.props.handleDeleteTask}
            handleNewTask={this.props.handleNewTask} />
        )
      }
      default: {
        return (
          <div id="new"></div>
        )
      }
    }
  }
  getTitle = () => {
    switch (this.props.mode) {      
      case PanelMode.EDIT:
        return 'Edit Task'
      case PanelMode.ADD:
      default:
        return 'Add Task'
    }
  }
  render() {
    return (
      <SidePanel
        title={this.getTitle()}
        opened={this.props.opened}
        onClose={this.props.onClose}>
        {this.getPanelContent()}
      </SidePanel>
    )
  }
}

TaskPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default TaskPanel