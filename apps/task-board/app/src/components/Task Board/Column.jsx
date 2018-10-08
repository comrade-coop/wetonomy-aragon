import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from '@aragon/ui'
import TaskContainer from '../../containers/TaskContainer'

const ditributeTasks = (props) => {
  return props.tasks.map(task =>
    <TaskContainer
      onEditTaskClick={props.onEditTaskClick}
      key={task.id}
      task={task}
    />)

}
const Column = (props) => (
  <ColumnHolder style={{ top: 0, left: props.id * 370 }}
    id={'droppable' + props.id}
    className="droppable"
    onDrop={(event) => props.drop(event)}
    onDragOver={(event) => props.allowDrop(event)}
  >
    <ColumnHeading weight="bold">{props.name}</ColumnHeading>
    {ditributeTasks(props)}
  </ColumnHolder>
)


const ColumnHolder = styled.div`
	background:white;
	display: inline-block;
	width:350px;
	border: 1px solid #E6E6E6;
	border-radius: 4px;
	min-height: 70px;
	padding: 15px;
	text-align:left;
	position: absolute;
`
const ColumnHeading = styled(Text)`
	margin-left: 10px;
`
export default Column
