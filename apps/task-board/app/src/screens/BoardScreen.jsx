import React from 'react'
import styled from 'styled-components'
import { Column } from '../components/Task Board/Column'
export class BoardScreen extends React.Component {
	constructor(props){
		super(props)
		this.state = {isOver: false}
	}
	allowDrop = (ev) => {
		ev.preventDefault();
	}

	drag = (ev) => {
			ev.dataTransfer.setData("dragged", ev.target.id);
			ev.target.style.visibility = "hidden";
	}
	dragEnd = (ev) => {
		ev.target.style.visibility = "visible";
	}

	drop = (ev) => {
			ev.preventDefault();
			var data = ev.dataTransfer.getData("dragged");
			this.setState({isOver: !this.state.isOver})
			var target = ev.target.closest(".droppable")
			document.getElementById(data).style.visibility = "visible";
			target.appendChild(document.getElementById(data));
	}
  render() {
		var Columns = undefined;
		if(this.props.columns!=undefined && this.props.tasks!=undefined){
			Columns = this
				.props
				.columns
				.map(column => 
				<Column
					key = {this.props.columns.indexOf(column)}
					id = {this.props.columns.indexOf(column)}
					tasks = {this.props.tasks.filter(task => task.column == this.props.columns.indexOf(column))}
					handleTaskPanelToggle={this.props.handleTaskPanelToggle} 
					name={column} 
					drag = {this.drag}
					drop = {this.drop}
					allowDrop = {this.allowDrop}
					dragEnd = {this.dragEnd}
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
::-webkit-scrollbar-thumb {
	background: #FFF; 
	}
`

const BoardColumns = styled.div`
	min-height: 900px;
	position: relative;
`
