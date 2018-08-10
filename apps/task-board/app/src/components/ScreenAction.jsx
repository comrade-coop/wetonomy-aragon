import React from 'react'
import styled from 'styled-components'
import { Text, Badge, Button, theme } from '@aragon/ui'
 class ScreenAction extends React.Component {
	render() {
		return (
			<div>
				<ScreenBar>
					<ActiveScreen className={(this.props.screen === 1 ? 'active' : '')} ><Text color={theme.textDimmed} size="xlarge" onClick={() => this.props.changeScreen(1)}>Timeline</Text></ActiveScreen>
					<ActiveScreen className={(this.props.screen === 2 ? 'active' : '')} ><Text color={theme.textDimmed} size="xlarge" onClick={() => this.props.changeScreen(2)}>Board</Text></ActiveScreen>
					<ActiveScreen className={(this.props.screen === 3 ? 'active' : '')} ><Text color={theme.textDimmed} size="xlarge" onClick={() => this.props.changeScreen(3)}>My Tasks</Text></ActiveScreen>
				</ScreenBar>
				<ButtonBar>
					<NewAchivment onClick={() => this.props.handleTaskPanelToggle(undefined)}><Text size="large">Post an Achivment</Text></NewAchivment>
					<NewTaskButton onClick={() => this.props.handleTaskPanelToggle(undefined)} mode="strong"><Text size="large">Propose a new Task</Text></NewTaskButton>
				</ButtonBar>
			</div>
		)
  }
}
const ScreenBar = styled.div`
  float: left;
  display: inline-block;
  margin-bottom: 30px;
  height 50px;
  text-align: center;
`
const ButtonBar = styled.div`
  float: right;
  font-weight: 600;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 30px;
  height 50px;
  text-align: center;
`
const ActiveScreen = styled.div`
  cursor: pointer;
  float: left;
  display: inline-block;
  padding: 10px 20px 5px 10px;
`
const NewTaskButton = styled.div`
  height: 40px;
  color: #00c3e4;
  text-align: center;
  width: 300px;
  padding: 8px 5px 5px 5px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: inline-block;
  float: right;
  background: white;
  margin-right: 20px;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
  }
`
const NewAchivment = styled.div`
  height: 40px;
  color: white;
  text-align: center;
  width: 300px;
  padding: 8px 5px 5px 5px;
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
export default ScreenAction