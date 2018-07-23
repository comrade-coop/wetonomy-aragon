import React from 'react'
import WorkButton from './WorkButton'
import {TableCell, Text, Button} from '@aragon/ui'
import styled from 'styled-components'
<<<<<<< HEAD:apps/timetracking/app/src/components/DayWork.js
class DayWork extends React.Component {
=======
import {COLORS} from  '../../utils/dummyDataProvider'
class WorkWeekDay extends React.Component {
>>>>>>> Edit/Delete traked hours almost done:apps/timetracking/app/src/components/WorkWeekTable/WorkWeekDay.jsx
	render() {
		var WorkedHours;
		if(this.props.workedHours!=[]){
			WorkedHours = this
				.props
				.workedHours
				.map(workedHour => 
				<WorkButton 
					key={workedHour.id} 
					workedHour = {workedHour} 
					color={COLORS[workedHour.project]}
					handleNewTrackPanelToggle = {this.props.handleNewTrackPanelToggle}
				/>)
		}
		
		return (
			<DayCell>
				<Div>
					{WorkedHours}
<<<<<<< HEAD:apps/timetracking/app/src/components/DayWork.js
					<TrackWork mode="normal"><Text size="xlarge">+ Track Work</Text></TrackWork>
=======
					<TrackWork onClick = {()=>this.props.handleNewTrackPanelToggle(this.props.day)} mode="normal"><Text size="xlarge">+ Track Work</Text></TrackWork>
>>>>>>> Edit/Delete traked hours almost done:apps/timetracking/app/src/components/WorkWeekTable/WorkWeekDay.jsx
				</Div>
			</DayCell>
		)
	}
}
const TrackWork = styled(Button)`
	margin-top:15px;
	width: 90%;
	box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	:hover {
		box-shadow: 0 3px 3px rgba(0,0,0,0.16), 0 3px 3px rgba(0,0,0,0.23);
`

const DayCell = styled(TableCell)`
  border: 1px solid #E6E6E6;
  width:200px;
  padding: 0px;
  :last-child { 
    border-radius: 0 0 5px 0;
  }
  :first-child { 
    border-radius: 0 0 0 5px;
  }
`
const Div = styled.div`
	height:800px;
	width: 100%;
	text-align:center;
`
export {
	WorkWeekDay,
	DayCell
}

