import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Column from '../components/TaskBoard/Column'
import { COLUMNS, DELETE_TYPE, TASK_TYPES } from '../utils/appConstants'
import { stageChangeActivity, deleteActivity } from '../actions/activities'
import { moveTaskUI, acceptTaskUI, errorTask } from '../actions/tasks'

class BoardScreen extends React.Component {
  // Drag events are defined in TaskContainer
  allowDrop = (ev) => {
    ev.preventDefault()
  }
  drop = (ev) => {
    ev.preventDefault()
    var data = ev.dataTransfer.getData('dragged')
    var target = ev.target.closest('.droppable')
    var task = document.getElementById(data)
    task.style.visibility = 'visible'
    const stage = parseInt(target.id[[target.id.length - 1]])
    var id = parseInt(task.id.slice(4))
    task = this.props.tasks.find(t => t.id === id)
    
    const realTasks = this.props.realTasks.find(t => t.id === id)
    const { dispatch } = this.props
    if (realTasks && task.type === TASK_TYPES.BASE) {
      if (realTasks.column !== 4) {
        if (task.column !== 0) {
          if (realTasks.column === stage) dispatch(deleteActivity(task, DELETE_TYPE.REMOVE_STAGE_CHANGE))
          else dispatch(stageChangeActivity(task, stage))
          dispatch(moveTaskUI(task, stage))
        }
        else {
          if (realTasks.column === stage) {
            dispatch(deleteActivity(task, DELETE_TYPE.REMOVE_STAGE_CHANGE))
            dispatch(moveTaskUI(task, stage))
          }
          else {
            dispatch(stageChangeActivity(task, stage))
            dispatch(acceptTaskUI(task, stage))
          }
        }
      }
      else dispatch(errorTask(task, 'Can\'t revert rewarded task!'))
    }
    else dispatch(errorTask(task, 'Can\'t move this task!'))
  }

  render() {
    var Columns = undefined
    var tasks = this.props.tasks
    if (this.props.tasks !== undefined) {
      Columns = COLUMNS.map(column =>
        <Column
          key={COLUMNS.indexOf(column)}
          id={COLUMNS.indexOf(column)}
          tasks={tasks.filter(task => task.column === COLUMNS.indexOf(column))}
          onEditTaskClick={this.props.onEditTaskClick}
          name={column}
          drop={this.drop}
          allowDrop={this.allowDrop}
        />)
    }
    return (
      <Board>
        <BoardColumns>
          {Columns}
        </BoardColumns>
      </Board>
    )
  }
}

const Board = styled.div`
  /* margin-left: 30px; */
  width:100%;
	margin-top:10px;
	overflow-x: scroll;
	font-size: 17px;
	/* width */
	::-webkit-scrollbar {
    width: 10px;
	}
	::-webkit-scrollbar-track {
    background: #f1f1f1;
	}
::-webkit-scrollbar-thumb{
	background: #FFF;
	}
`

const BoardColumns = styled.div`
  min-height: 800px;
  margin-left: 30px;
	position: relative;
`
const mapStateToProps = state => ({
  tasks: state.tasks.tasks,
  realTasks: state.tasks.realTasks
})

export default connect(mapStateToProps)(BoardScreen)
