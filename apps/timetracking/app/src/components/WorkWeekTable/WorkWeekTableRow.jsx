import React from 'react'
import { TableRow } from '@aragon/ui'
import { WorkWeekDay } from './WorkWeekDay'
export const WorkWeekTableRow = (props) => {
	return (
		<TableRow>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[1]} day={props.days[0]}/>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[2]} day={props.days[1]}/>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[3]} day={props.days[2]}/>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[4]} day={props.days[3]}/>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[5]} day={props.days[4]}/>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[6]} day={props.days[5]}/>
			<WorkWeekDay handleNewTrackPanelToggle = {props.handleNewTrackPanelToggle} workedHours={props.workedHours[0]} day={props.days[6]}/>
		</TableRow>
	)
}
