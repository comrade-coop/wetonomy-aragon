import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import { Task } from './Task'
class Column extends React.Component {
	render() {
		var tasks = undefined;
		if(this.props.tasks!=undefined){
			tasks = this
				.props
				.tasks
				.map(task => 
				<Task
					drag = {this.props.drag}
					dragEnd = {this.props.dragEnd}
					handleTaskPanelToggle={this.props.handleTaskPanelToggle} 
					key = {task.id}
					task = {task}
				/>)
		}
		return (
			<ColumnHolder style={{top: 0, left: this.props.id*370 }}
				className="droppable"
				onDrop={(event) => this.props.drop(event)} 
				onDragOver={(event) => this.props.allowDrop(event)}
			>
				<ColumnHeading weight="bold">{this.props.name}</ColumnHeading>
				{tasks}
			</ColumnHolder>
		)
	}
}

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
export {
	Column
}