import React, { Component } from 'react'
import { connect } from 'react-redux'
import TaskPanel from '../components/Panels/TaskPanel'
import { closeAndReset } from '../actions/panel'
import { addTaskUI, updateTaskUI, removeTaskUI, reloadTaskState } from '../actions/tasks'
import { createActivity, updateActivity, removeActivity, contributeActivity } from '../actions/activities'
class TaskPanelContainer extends Component {

  handleAddTask = (task) => {
    const { dispatch } = this.props
    console.log(task)
    dispatch(addTaskUI(task))
    dispatch(closeAndReset())
    dispatch(createActivity(task))
  }

  handleUpdateTask = (task) => {
    const { dispatch } = this.props
    const realTask = this.props.real.filter(t => t.id === task.id)[0]
    const contrubute = task.tokens - parseInt(realTask.tokens)
    if(contrubute > 0) dispatch(contributeActivity(task, contrubute))
    let check = false
    for(let prop in realTask) {
      console.log(prop)
      console.log(task[prop] !== realTask[prop] && prop !== '_tokens' && prop !== '_type' && prop !== '_column')
      if(task[prop] !== realTask[prop] && prop !== '_tokens'
        && prop !== '_type' && prop !== '_column' && prop !== '_assignee') check = true
    }
    // in case we can choose the assignee in the sidebar
    // possible problems with contract sync
    if( !check && task._column === realTask._column && task._assignee !== realTask._assignee) check = true
    if(check) {
      dispatch(updateTaskUI(task))
      dispatch(updateActivity(task))
    }
    dispatch(closeAndReset())
  }

  handleRemoveTask = () => {
    const { dispatch } = this.props
    dispatch(closeAndReset())
    dispatch(reloadTaskState(this.props.selectedTask))
    dispatch(removeActivity(this.props.selectedTask))
    dispatch(removeTaskUI(this.props.selectedTask))
  }

  handleClose = () => {
    const { dispatch } = this.props
    dispatch(closeAndReset())
  }

  render() {
    const { opened, mode, selectedTask } = this.props

    return (
      <TaskPanel
        opened={opened}
        mode={mode}
        selectedTask={selectedTask}
        onAddTask={this.handleAddTask}
        onUpdateTask={this.handleUpdateTask}
        onRemoveTask={this.handleRemoveTask}
        onClose={this.handleClose} />
    )
  }
}

const mapStateToProps = state => ({
  opened: state.panel.opened,
  mode: state.panel.mode,
  tasks: state.tasks.tasks,
  real: state.tasks.realTasks,
  selectedTask: state.panel.selectedTask
})

export default connect(mapStateToProps)(TaskPanelContainer)
