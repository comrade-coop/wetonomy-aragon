import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, Badge, Button, theme } from '@aragon/ui'
import { DIFFICULTIES, WORK_FIELD } from '../../utils/appConstants'
import editLogo from '../../assets/edit.svg'
class Task extends React.Component {
	constructor(props){
		super(props)
		this.state = {task: this.props.task}
	}
  isPriority = () => {
		var task = this.state.task;
		task.isPriority = !task.isPriority;
		this.setState({task: this.props.task})
	}
	acceptTask = () => {
		console.log("Task accepted")
	}
  render() {
		
		var tags = this.state.task.tags.map(tag => 
				<NewTag
          key = {this.state.task.tags.indexOf(tag)}
					name={tag}
				/>)
		
		return (
			<TaskHolder draggable="true" 
				onDragStart={(event) => this.props.drag(event)} 
				onDragEnd={(event) => this.props.dragEnd(event)} 
				// onClick = {this.props.handleTaskPanelToggle}
				id={"task"+this.state.task.id}>
				<Text size="small" weight="bold">{WORK_FIELD[this.state.task.workField]}</Text>
				<Icon src={editLogo} alt="Edit Task" onClick={() => this.props.handleTaskPanelToggle(this.state.task.id)} />
				<Tags>
				<Tag background="#5ae39d" foreground="white">{this.state.task.project}</Tag>
					{tags}
				</Tags>
				<Description>
					<Text size="normal"> {this.state.task.heading.substring(0, 42)+ " ..."} </Text>
				</Description>
				<Difficulty>
					<Text color={theme.textSecondary} >Difficulty: </Text>
					<Text color={theme.textSecondary} weight="bold">{DIFFICULTIES[this.state.task.difficulty]}</Text>
				</Difficulty>
				<Reward>
					<Text color={theme.textSecondary} >Reward: so far: </Text>
					<Text color={theme.accent} weight="bold">{this.state.task.tokens} DAO Tekens</Text>
				</Reward>
				<Actions>
				{this.state.task.isPriority==true ? ((
					<Priority onClick={this.isPriority}>
					<i class="material-icons">star_border</i>
					</Priority>
				)) : (
					<NotPriority onClick={this.isPriority}><i class="material-icons">star_border</i></NotPriority>
				)}
					<Accept>Accept Task</Accept>
				</Actions>
      </TaskHolder>
    )
  }
}
export const NewTag = (props) => {
  return (
    <Tag>{props.name}</Tag>
  )
}
const TaskHolder = styled.div`
	width:100%;
	margin-left:auto;
	margin-right:auto;
	margin-top:10px;
	height: 187px;
	padding:10px;
	cursor: pointer;
	border-radius: 3px;
	box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
	}
`
const Icon = styled.img`
	cursor: pointer;
	float: right;
`
const Description = styled.div`
 margin: 5px 0 5px 0;
`
const Tags = styled.div`
	margin: 0 8px 0 0;
`
const Difficulty = styled.div`
	font-size: 14px;
`
const Reward = styled.div`
	font-size: 14px;
`
const Actions = styled.div`
	margin-top: 10px;
`
const Accept = styled.div`
	height: 30px;
	color: white;
	text-align: center;
	width: 80px;
	padding: 5px;
	cursor: pointer;
	border-radius: 3px;
	font-size: 12px;
	display: inline-block;
	float: right;
	background-image: linear-gradient( 130deg,#00B4E6,#00F0E0 );
	box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	:hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
  }
`
const NotPriority = styled.div`
	height: 30px;
	width: 30px;
	color: #00B4E6;
	text-align: center;
	padding-top: 3px;
	cursor: pointer;
	border-radius: 30px;
	font-size: 15px;
	font-weight: 600;
	display: inline-block;
	float: left;
	box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	:hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
  }
`
const Priority = styled.div`
	height: 30px;
	width: 30px;
	color: #fff;
	text-align: center;
	padding-top: 3px;
	cursor: pointer;
	border-radius: 30px;
	font-size: 15px;
	font-weight: 600;
	display: inline-block;
	float: left;
	background-image: linear-gradient( 130deg,#00B4E6,#00F0E0 );
	box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	:hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
  }
`
const Tag = styled(Badge)`
	margin-left: 8px;
	padding: 1px 14px 1px 14px;
	:first-child { 
		margin-left: 0px;
  }
`

export {
	Task
} 