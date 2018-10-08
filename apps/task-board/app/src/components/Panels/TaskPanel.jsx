import React from 'react'
import { SidePanel } from '@aragon/ui'
import PropTypes from 'prop-types'

import AddTaskForm from '../Forms/AddTaskForm'
import EditTaskForm from '../Forms/EditTaskForm'
export const PanelMode = {
  ADD: 'Add a new task',
  EDIT: 'Edit task',
  BASE: 'BASE'
}

const _getPanelContent = (mode, onAddTask, onUpdateTask, onRemoveTask, onClose, task = null) => {
  switch (mode) {
    case PanelMode.EDIT: {
      return (
        <EditTaskForm
          selectedTask = {task}
          onClose={onClose}
          onUpdateTask = {onUpdateTask}
          onDeleteTask = {onRemoveTask}
          onAddTask={onUpdateTask} />
      )
    }
    case PanelMode.ADD: {
      return (
        <AddTaskForm
          onClose={onClose}
          onAddTask={onAddTask}  />
      )
    }
    default: {
      return (
        <div id="new"></div>
      )
    }
  }
}

const TaskPanel = ({ mode, opened, onAddTask, onUpdateTask, onRemoveTask, onClose, selectedTask }) => (
  <SidePanel
    title={mode}
    opened={opened}
    onClose={onClose}>
    {_getPanelContent(mode, onAddTask, onUpdateTask, onRemoveTask, onClose, selectedTask)}
  </SidePanel>
)

TaskPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired
}

export default TaskPanel